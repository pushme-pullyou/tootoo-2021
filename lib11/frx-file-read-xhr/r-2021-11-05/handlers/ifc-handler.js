// copyright 2021 Theo Armour. MIT license.
/* global THREE, COR */
// jshint esversion: 6
// jshint loopfunc: true

IFC = {};


IFC.src = FRX.pathUtilities + "parsers/ifc-parser.js";


IFC.handle = function () {

	if ( FRX.file ) { console.log( "file", FRX.file.name ); IFC.read(); return; }

	if ( FRX.url ) { console.log( "url", FRX.url.split( "/" ).pop() ); IFC.onChange(); return; }

	if ( FRX.content ) { console.log( "zip", FRX.zipFileName ); IFC.checkLoader(); return; }

};



IFC.read = function () {

	FRX.loadLoaders( IFC, IFC.src, IFC.readFile );

};



IFC.readFile = function () {

	const reader = new FileReader();
	reader.onload = ( event ) => IFC.parse( event.target.result );
	reader.readAsText( FRX.file );

};



IFC.onChange = function () {

	FRX.loadLoaders( IFC, IFC.src, IFC.requestFile );

};



IFC.checkLoader = function () {

	FRX.loadLoaders( IFC, IFC.src, IFC.requestFile );

};



IFC.requestFile = function ( url ) {

	const xhr = new XMLHttpRequest();
	xhr.open( "get", FRX.url, true );
	xhr.onload = () => { console.log( "xhr", xhr ); IFC.parse( xhr.responseText ); };
	xhr.send( null );

	return;

};



IFC.handle();