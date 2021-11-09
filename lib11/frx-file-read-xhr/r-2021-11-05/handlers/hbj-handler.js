// copyright 2021 Theo Armour. MIT license.
/* global THREE, COR */
// jshint esversion: 6
// jshint loopfunc: true

HBJ = {};

HBJ.src = FRX.pathUtilities + "parsers/hbj-hbjson-parser.js";
HBJ.loaded = false;

HBJ.handle = function () {

	if ( FRX.file ) { console.log( "file", FRX.file.name ); HBJ.read(); return; }

	if ( FRX.url ) { console.log( "url", FRX.url.split( "/" ).pop() ); HBJ.onChange(); return; }

	if ( FRX.content ) { console.log( "zip", FRX.zipFileName ); HBJ.checkLoader(); return; }

};



HBJ.read = function () {

	FRX.loadLoaders( HBJ, HBJ.src, HBJ.readFile );

};


HBJ.readFile = function () {

	const reader = new FileReader();
	reader.onload = ( event ) => HBJ.parse( JSON.parse( event.target.result ) );
	reader.readAsText( FRX.file );

};



HBJ.onChange = function () {

	FRX.loadLoaders( HBJ, HBJ.src, HBJ.requestFile );

};



HBJ.checkLoader = function () {

	FRX.loadLoaders( HBJ, HBJ.src, HBJ.parse );

};



HBJ.requestFile = function () {

	const xhr = new XMLHttpRequest();
	xhr.responseType = "json";
	xhr.open( "get", FRX.url, true );
	xhr.onload = ( xhr ) => HBJ.parse( xhr.target.response );
	xhr.send( null );

};



HBJ.handle();