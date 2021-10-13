// copyright 2021 Theo Armour. MIT license.
/* global THREE, COR */
// jshint esversion: 6
// jshint loopfunc: true

HBJ = {};

HBJ.src = FRX.pathUtilities + "parsers/hbj-hbjson-parser.js";


HBJ.handle = function () {

	if ( FRX.file ) { console.log( "file", FRX.file.name ); HBJ.checkLoader(); return; }
	if ( FRX.url ) { console.log( "url", FRX.url.split( "/" ).pop() ); HBJ.onChange( FRX.url ); return; }
	if ( FRX.content ) { console.log( "zip", FRX.zipFileName ); HBJ.addParser( JSON.parse( FRX.content ) ); return; }

};


HBJ.checkLoader = function () {

	FRX.loadLoader( HBJ.loader, HBJ.src, HBJ.readFile );

};


HBJ.readFile = function () {

	const reader = new FileReader();
	reader.onload = ( event ) => HBJ.parse( JSON.parse( event.target.result ) );
	reader.readAsText( FRX.file );

};



HBJ.onChange = function () {

	FRX.loadLoader( HBJ.loader, HBJ.src, HBJ.requestFile);

};



HBJ.requestFile = function () {

	const xhr = new XMLHttpRequest();
	xhr.responseType = "json";
	xhr.open( "get", FRX.url, true );
	xhr.onload = ( xhr ) => HBJ.parse( xhr.target.response );
	xhr.send( null );

};



// HBJ.addParser = function ( json ) {

// 	const loader = document.body.appendChild( document.createElement( 'script' ) );
// 	loader.onload = () => { HBJ.parse( json )};
// 	loader.src = HBJ.src;

// };



HBJ.handle();