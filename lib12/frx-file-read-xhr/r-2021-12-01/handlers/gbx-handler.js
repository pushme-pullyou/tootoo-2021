// copyright 2021 Theo Armour. MIT license.
/* global THREE, THR, THRU, COR */
// jshint esversion: 6
// jshint loopfunc: true

GBX = {};

GBX.src = FRX.pathUtilities + "parsers/gbx-gbxml-parser.js";

GBX.loaded = false;

GBX.handle = function () {

	if ( FRX.file ) { console.log( "file", FRX.file.name ); GBX.read(); return; }

	if ( FRX.url ) { console.log( "url", FRX.url.split( "/" ).pop() ); GBX.onChange(); return; }

	//if ( FRX.zipFileName ) { console.log( "FRX.zipFileName", FRX.zipFileName ); GBX.checkLoader(); return }

	if ( FRX.content ) { console.log( "zip", FRX.zipFileName ); GBX.checkLoader(); return; }

};



GBX.read = function () {

	FRX.loadLoaders( GBX, GBX.src, GBX.readFile );

};



GBX.readFile = function () {

	const reader = new FileReader();
	reader.onload = () => GBX.parse( reader.result );
	reader.readAsText( FRX.file );

};



GBX.onChange = function ( url ) {

	//console.log( "GBX.loaded", GBX.loaded );

	FRX.loadLoaders( GBX, GBX.src, GBX.requestFile );

};



GBX.checkLoader = function () {

	//console.log( "GBX.src", GBX.src );

	FRX.loadLoaders( GBX, GBX.src, GBX.parse );

};



GBX.requestFile = function () {

	const xhr = new XMLHttpRequest();
	xhr.open( "get", FRX.url, true );
	xhr.onload = ( xhr ) => GBX.parse( xhr.target.response );
	xhr.send( null );

};



GBX.handle();