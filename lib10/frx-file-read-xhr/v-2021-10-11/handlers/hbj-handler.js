// copyright 2021 Theo Armour. MIT license.
/* global THREE, COR */
// jshint esversion: 6
// jshint loopfunc: true

HBJ = {};



HBJ.handle = function () {

	if ( FRX.content ) { HBJ.addParser( JSON.parse( FRX.content ) ); return; }
	if ( FRX.file ) { console.log( "FRX.file", FRX.file.name ); HBJ.read(); return; }
	if ( FRX.url ) { console.log( "FRX.url.pop", FRX.url.split( "/" ).pop() ); HBJ.onChange( FRX.url ); return; }

};



HBJ.read = function () {

	const reader = new FileReader();
	reader.onload = ( event ) => HBJ.addParser( JSON.parse( event.target.result ) );
	reader.readAsText( FRX.file );

};



HBJ.onChange = function ( url ) {

	const xhr = new XMLHttpRequest();
	xhr.responseType = "json";
	xhr.open( "get", FRX.url, true );
	xhr.onload = ( xhr ) => HBJ.addParser( xhr.target.response );
	xhr.send( null );

};



HBJ.addParser = function ( json ) {

	const loader = document.body.appendChild( document.createElement( 'script' ) );
	loader.onload = () => { HBJ.parse( json )};
	loader.src = FRX.pathUtilities + "parsers/hbj-hbjson-parser.js";

};



HBJ.handle();