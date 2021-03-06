// copyright 2021 Theo Armour. MIT license.
/* global  */
// jshint esversion: 6
// jshint loopfunc: true


const FOX = {};



FOX.init = function ( { defaultFile = "README.md", path = "../../../" } = {} ) {

	FOX.documentTitle = document.title;
	FOX.defaultFile = defaultFile;
	FOX.path = path;
	window.addEventListener( "hashchange", FOX.onHashChange );

};



FOX.onHashChange = function () {
	//console.log( "path", FOX.path );

	FOX.timeStart = performance.now();
	FOX.fileName = location.hash ? location.hash.slice( 1 ) : FOX.defaultFile;
	FOX.fileTitle = FOX.fileName.split( "/" ).pop();
	FOX.extension = FOX.fileTitle.toLowerCase().split( '.' ).pop();
	FOX.url = FOX.path + decodeURI( FOX.fileName );

	document.title = ` ${ FOX.fileTitle } ~ ${ FOX.documentTitle }`;
	// console.log( "FOX.path ", FOX.path  );
	// console.log( "FOX.url", decodeURI( FOX.url ) );
	//console.log( "extension", FOX.extension );



	if ( FOX.fileName.startsWith( "edit" ) ) {

		FOX.url = FOX.path + FOX.fileName.slice( 4 );

		console.log( "FOX.url", FOX.url );

		const xhr = new XMLHttpRequest();
		xhr.open( "get", FOX.url, true );
		xhr.onload = () => {
			const txt = xhr.responseText;
			divMainContent.innerHTML = `<textarea style="height:98vh;width:100%;" >${ txt }</textarea>`;
			window.scrollTo( 0, 0 );
			FOX.timeEnd = performance.now();
			//console.log( "FOX time load", ( FOX.timeEnd - FOX.timeStart ).toLocaleString() );
		};
		xhr.send( null );

		return;
	}

	if ( [ "htm", "html" ].includes( FOX.extension ) ) {

		divMainContent.innerHTML =
			`<iframe id=ifr src="${ decodeURI( FOX.url ) }" style="border:none;width:100%" ></iframe>`;

		ifr.onload = () => {

			ifr.contentWindow.document.body.style.overflow = "hidden";

			const height = ( 50 + ifr.contentWindow.document.body.offsetHeight ) + "px;";
			ifr.height = height;
			//console.log( "offset", height );

		};

		return;

	}

	if ( FOX.extension === "md" || FOX.extension.length > 4 ) {

		showdown.setFlavor( "github" );

		const options = { excludeTrailingPunctuationFromURLs: true, ghMention: true, parseImgDimensions: true, simplifiedAutoLink: true, simpleLineBreaks: true, emoji: true, openLinksInNewWindow: true };

		const xhr = new XMLHttpRequest();
		xhr.open( "get", FOX.url, true );
		xhr.onload = () => {
			const txt = xhr.responseText.replace( /\<!--@@@/, "" ).replace( /\@@@-->/, "" );
			htm = new showdown.Converter( options ).makeHtml( txt );
			divMainContent.innerHTML = `
<div style="border:0px solid red; margin: 0 auto; padding: 0 1rem; max-width: 40rem;" >
${ htm }
</div>`;

			window.scrollTo( 0, 0 );
			FOX.timeEnd = performance.now();
			//console.log( "FOX time load", ( FOX.timeEnd - FOX.timeStart ).toLocaleString() );
		};
		xhr.send( null );

		return;

	}


	if ( [ "gif", "jpg", "jpeg", "png", "svg" ].includes( FOX.extension ) ) {

		divMainContent.innerHTML = `<a href=${ FOX.url } title="Open this image in a new window" target="_blank" ><img src="${ decodeURI( FOX.url ) }" style=max-width:100% ></a>`;

		return;

	}


	divMainContent.innerHTML =
		`<iframe id=ifr src="${ decodeURI( FOX.url ) }" style="border:none;height:99vh;width:100%" ></iframe>`;

};

