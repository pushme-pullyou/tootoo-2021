// copyright 2021 Theo Armour. MIT license.
/* global THREE, COR */
// jshint esversion: 6
// jshint loopfunc: true

MDN = {};

MDN.src = "https://cdnjs.cloudflare.com/ajax/libs/showdown/1.9.1/showdown.min.js";

MDN.handle = function () {

	FRXdivLog2.innerText = "";

	if ( FRX.content ) { console.log( "content:", FRX.content.slice( 0, 20 ) ); MDN.onUnZip(); return; }

	if ( FRX.file ) { console.log( "file:", FRX.file.name ); MDN.read(); return; }

	if ( FRX.url ) { console.log( "url:", FRX.url.split( "/" ).pop() ); MDN.onChange(); return; }

};



MDN.onUnZip = function () {

	if ( MDN.loader === undefined ) {

		MDN.loader = document.body.appendChild( document.createElement( 'script' ) );
		MDN.loader.onload = () => MDN.display( FRX.content );
		MDN.loader.src = MDN.src;

	} else {

		MDN.loadDataUrl( FRX.content );

	}

};



MDN.read = function () {

	if ( MDN.loader === undefined ) {

		MDN.loader = document.body.appendChild( document.createElement( 'script' ) );
		MDN.loader.onload = () => MDN.readFile();
		MDN.loader.src = MDN.src;

	} else {

		MDN.readFile();

	}

};



MDN.readFile = function () {

	const reader = new FileReader();
	reader.onload = () => MDN.display( reader.result );
	reader.readAsText( FRX.file );

};



MDN.onChange = function () {

	if ( MDN.loader === undefined ) {

		MDN.loader = document.body.appendChild( document.createElement( 'script' ) );
		MDN.loader.onload = () => MDN.request( FRX.url );
		MDN.loader.src = MDN.src;

	} else {

		MDN.request( FRX.url );

	}
};



MDN.request = function ( url ) {

	const xhr = new XMLHttpRequest();
	FRX.addListeners( xhr );
	xhr.open( "get", url, true );
	xhr.onload = () => { MDN.display( xhr.responseText) };
	xhr.send( null );

	return xhr;

};



MDN.display = function ( content ) {

	showdown.setFlavor( "github" );

	const options = { excludeTrailingPunctuationFromURLs: true, ghMention: true, rquestImgDimensions: true, simplifiedAutoLink: true, simpleLineBreaks: true, emoji: true, openLinksInNewWindow: true };

	const txt = content.replace( /\<!--@@@/, "" ).replace( /\@@@-->/, "" );
	const htm = new showdown.Converter( options ).makeHtml( txt );
	divMainContent.innerHTML = `
<div style="border:0px solid red; margin: 0 auto; padding: 0 1rem; max-width: 40rem;" >
${ htm }
</div>`;

	FRX.timeEnd = performance.now();
	//console.log( "FRX time load", ( FRX.timeEnd - FRX.timeStart ).toLocaleString() );


};



MDN.handle();