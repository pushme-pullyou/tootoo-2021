// copyright 2021 Theo Armour. MIT license.
/* global COR, MNU, GRVdivDetails */
// jshint esversion: 6
// jshint loopfunc: true


const FXH = {};

FXH.loaded = true;
FXH.htm = [ "htm" ];
FXH.img = [ "gif", "jpg", "jpeg", "png", "svg" ];
FXH.mdn = [ "", "txt", "md", "markdown"  ];
FXH.zip = [ "zip" ];
FXH.all = FXH.img.concat( FXH.htm, FXH.mdn, FXH.zip );



FXH.init = function () {

	window.addEventListener( "hashchange", FXH.onHashChange );

};



FXH.onHashChange = function () {

	FXH.timeStart = performance.now();

	const relativeURL = location.hash ? location.hash.slice( 1 ) : COR.defaultFile;
	FXH.fileName = relativeURL.split( "/" ).pop();
	FXH.extension = FXH.fileName.includes( "." ) ? FXH.fileName.toLowerCase().split( '.' ).pop() : "";
	FXH.url = COR.urlBaseContent + relativeURL;

	FXH.selectHandler( FXH.url );

	window.scrollTo( 0, 0 );

};



FXH.selectHandler = function () {

	if ( FXH.htm.includes( FXH.extension ) ) {

		FXH.display = FXH.displayHTM;
		FXH.request();
		return;

	}

	if ( FXH.img.includes( FXH.extension ) ) {

		divMainContent.innerHTML = `
		<a href=${ FXH.url } title="Open this image in a new window" target="_blank" >
			<img src="${ decodeURI( FXH.url ) }" alt="${ FXH.fileName }"style=max-width:100% >
		</a>`;
		return;

	}

	if ( FXH.mdn.includes( FXH.extension ) ) {

		FXH.display = FXH.displayMarkdown;
		const load = document.body.appendChild( document.createElement( "script" ) );
		load.onload = FXH.request;
		load.src = "https://cdnjs.cloudflare.com/ajax/libs/showdown/1.9.1/showdown.min.js";
		return;

	}

	if ( FXH.zip.includes( FXH.extension ) ) {

		let loaded = 0;
		const loader = () => ++loaded === 2 && FXH.fetchZipFile();

		const load = document.body.appendChild( document.createElement( "script" ) );
		load.onload = loader;
		load.src = "https://cdn.jsdelivr.net/npm/jszip@3.7.1/dist/jszip.min.js";

		const load2 = document.body.appendChild( document.createElement( "script" ) );
		load2.onload = loader;
		load2.src = "zip-parser.js";
		return;

	}


	if ( !FXH.all.includes( FXH.extension ) ) {

		console.log( "FXH.url", decodeURI( FXH.url ) );
		divMainContent.innerHTML =
			`<iframe id=ifr src="${ decodeURI( FXH.url ) }" style="height:100vh;margin:2rem 0;width:100%;" ></iframe>`;

	}

};



FXH.request = function () {

	const xhr = new XMLHttpRequest();
	//FXH.addListeners( xhr );
	xhr.open( "get", FXH.url, true );
	xhr.onload = () => FXH.display( xhr.responseText );
	xhr.send( null );

};



FXH.displayMarkdown = function ( content ) {

	showdown.setFlavor( "github" );

	const options = { excludeTrailingPunctuationFromURLs: true, ghMention: true, rquestImgDimensions: true, simplifiedAutoLink: true, simpleLineBreaks: true, emoji: true, openLinksInNewWindow: true };

	const txt = content.replace( /\<!--@@@/, "" ).replace( /\@@@-->/, "" );
	const htm = new showdown.Converter( options ).makeHtml( txt );
	divMainContent.innerHTML = `
<div style="border:0px solid red; margin: 0 auto; padding: 0 1rem; max-width: 40rem;" >
${ htm }
</div>`;

	FXH.timeEnd = performance.now();
	//console.log( "FRX time load", ( FXH.timeEnd - FXH.timeStart ).toLocaleString() );

};



FXH.displayHTM = function ( content ) {
	//console.log( "content", content );

	divMainContent.innerHTML = `
	<div style="border:1px solid #888; margin: 0 auto; padding: 0 1rem; max-width: 40rem;" >
		${ content }
	</div>`;

};



FXH.getTestCases = function () {

	const files = [ "LICENSE", "NPP_16.stl", "Photo Album_Example Auckland.pdf", "README.md", "Structural_MRI_animation.ogv.240p.webm", "ca_cs.xls", "code-of-conduct.md", "concept.md", "envmap.png", "heritage-front.jpg", "markdown-help.md", "markdown.md", "noun_Information_585560.svg", "pano.mp4", "readme.html", "sample.md", "snippets.txt", "style-sample-tags.html", "system-map.gif", "test-case.zip", "text-to-hack-3.html", "text-to-hack.html", "text.txt", "the-scream.jpg", "tree.obj", "us-county-state-latlon-pop.csv" ];

	const htm = files.map( file => `<a href="#test-cases/${ file }" >${ file }</a>` ).join( "<br>" );

	return htm;

};



