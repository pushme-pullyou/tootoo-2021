// copyright 2021 Theo Armour. MIT license.
/* global COR, main, divMainContent, showdown */
// jshint esversion: 6
// jshint loopfunc: true


const FOX = {};

FOX.init = function ( { defaultFile = COR.defaultFile, path = COR.path } = {} ) {

	this.documentTitle = document.title;
	this.defaultFile = defaultFile;
	this.path = path;
	window.addEventListener( "hashchange", this.onHashChange );

};


FOX.getMenu = function () {

	const htm = `
<details id=FOXdet >

	<summary id=FOXsumNavMenu class="summary-primary gmd-1" >FOXSample files
		${ MNU.addInfoBox( "Files to try" ) }
	</summary>

		<div style=width:15rem;overflow:hidden;>

			<p><a href="#test-cases/heritage-front.jpg">heritage-front.jpg</a></p>

			<p><a href="#test-cases/Photo Album_Example Auckland.pdf">Photo Album_Example Auckland.pdf</a></p>

			<p><a href="#test-cases/style-sample-tags.html">style-sample-tags.html</a></p>

			<p><a href="#test-cases/the-scream.jpg">the-scream.jpg</a></p>

			<p><a href="#test-cases/system-map.gif">system-map.gif</a></p>

			<p><a href="#test-cases/noun_Information_585560.svg">noun_Information_585560.svg</a></p>

			<p><a href="#test-cases/markdown-help.md">markdown-help.md</a></p>

			<p><a href="#edittest-cases/markdown-help.md">edit markdown-help.md</a></p>

			<p><a
					href="#test-cases/Structural_MRI_animation.ogv.240p.webm">Structural_MRI_animation.ogv.240p.webm</a>
			</p>

			<p><a
					href="#test-cases/Riverside_Metro_Area_housing2b_week1.csv">Riverside_Metro_Area_housing2b_week1.csv</a>
			</p>

			<p><a href="#test-cases/pano.mp4">pano.mp4</a></p>

			<p><a href="#test-cases/ca_cs.xls">ca_cs.xls</a></p>

			<p><a href="#test-cases/"></a></p>

			<p><a href="#test-cases/"></a></p>

			<div id=MNUdivFooter></div>
		</div>

</details>`;

	return htm;

};



FOX.onHashChange = function () {
	//console.log( "path", FOX.path );

	FOX.timeStart = performance.now();
	FOX.fileName = location.hash ? location.hash.slice( 1 ) : FOX.defaultFile;
	FOX.fileTitle = FOX.fileName.split( "/" ).pop();
	FOX.extension = FOX.fileTitle.toLowerCase().split( '.' ).pop();
	FOX.url = FOX.path + decodeURI( FOX.fileName );

	document.title = ` ${ FOX.fileTitle } ~ ${ FOX.documentTitle }`;
	//console.log( "FOX.path ", FOX.path  );
	//console.log( "FOX.url", decodeURI( FOX.url ) );
	//console.log( "extension", FOX.extension );

	if ( main ) {

		main.style.overflow = "auto";
		window.main.scrollTo( 0, 0 );

	}

	if ( FOX.fileName.startsWith( "edit" ) ) {

		FOX.url = FOX.path + FOX.fileName.slice( 4 );

		//console.log( "FOX.url", FOX.url );

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

		// divMainContent.innerHTML =
		// 	`<iframe id=ifr src="${ decodeURI( FOX.url ) }" style="border:none;width:100%;" ></iframe>`;

		main.style.overflow = "hidden";

		divMainContent.innerHTML =
			`<iframe src="${ FOX.url }" height=${ window.innerHeight } style="border:none;width:100%;"  ></iframe>`;

		return;

	}

	if ( FOX.extension === "md" || FOX.extension.length > 4 ) {

		showdown.setFlavor( "github" );

		const options = { excludeTrailingPunctuationFromURLs: true, ghMention: true, parseImgDimensions: true, simplifiedAutoLink: true, simpleLineBreaks: true, emoji: true, openLinksInNewWindow: true };

		const xhr = new XMLHttpRequest();
		xhr.open( "get", FOX.url, true );
		xhr.onload = () => {
			const txt = xhr.responseText.replace( /\<!--@@@/, "" ).replace( /\@@@-->/, "" );
			const htm = new showdown.Converter( options ).makeHtml( txt );
			divMainContent.innerHTML = `
<div style="border:0px solid red; margin: 0 auto; padding: 0 1rem; max-width: 40rem;" >
${ htm }
</div>`;

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

	main.style.overflow = "hidden";

	divMainContent.innerHTML =
		`<iframe id=ifr src="${ decodeURI( FOX.url ) }" style="border:none;height:100vh;width:100%" ></iframe>`;

};
