// copyright 2021 Theo Armour. MIT license.
/* global THREE, THR, THRU, COR */
// jshint esversion: 6
// jshint loopfunc: true

GBX = {};

GBX.src = FRX.pathUtilities + "parsers/gbx-gbxml-parser.js";


GBX.handle = function () {

	if ( FRX.file ) { console.log( "file", FRX.file.name ); GBX.read(); return; }

	if ( FRX.url ) { console.log( "url", FRX.url.split( "/" ).pop() ); GBX.onChange(); return; }

	if ( FRX.content ) { console.log( "zip", FRX.zipFileName ); GBX.checkLoader(); return; }

};



GBX.read = function () {

	FRX.loadLoader( GBX.loader, GBX.src, GBX.readFile );

};



GBX.readFile = function () {

	const reader = new FileReader();
	reader.onload = () => GBX.parse( reader.result );
	reader.readAsText( FRX.file );

};



GBX.onChange = function ( url ) {

	FRX.loadLoader( GBX.loader, GBX.src, GBX.requestFile );

};



GBX.checkLoader = function () {

	FRX.loadLoader( GBX.loader, GBX.src, GBX.parseContent );

};



GBX.requestFile = function ( url = FRX.url ) {

	const xhr = new XMLHttpRequest();
	xhr.open( "get", url, true );
	xhr.onload = ( xhr ) => GBX.parse( xhr.target.response );
	xhr.send( null );

};



GBX.handle();