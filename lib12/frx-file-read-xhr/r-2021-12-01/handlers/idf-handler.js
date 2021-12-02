// copyright 2020 Theo Armour. MIT license.
/* global THREE, COR */
// jshint esversion: 6
// jshint loopfunc: true


IDF = {};

IDF.src = FRX.pathUtilities + "parsers/idf-parser.js";


IDF.handle = function () {

	if ( FRX.file ) { console.log( "file", FRX.file.name ); IDF.read(); return; }

	if ( FRX.url ) { console.log( "url", FRX.url.split( "/" ).pop() ); IDF.onChange(); return; }

	if ( FRX.content ) { console.log( "zip", FRX.zipFileName ); IDF.checkLoader(); return; }

};



IDF.read = function () {

	FRX.loadLoaders( IDF, IDF.src, IDF.readFile );

};



IDF.read = function () {

	IDF.reader = new FileReader();
	IDF.reader.onload = ( event ) => IDF.parse( event.target.result );
	IDF.reader.readAsText( FRX.file );

};



IDF.onChange = function () {

	FRX.loadLoaders( IDF, IDF.src, IDF.requestFile );

};



IDF.checkLoader = function () {

	FRX.loadLoaders( IDF, IDF.src, IDF.parse );

};



IDF.requestFile = function () {

	const xhr = new XMLHttpRequest();
	xhr.open( "get", FRX.url, true );
	xhr.onload = ( xhr ) => IDF.parse( xhr.target.response );
	xhr.send( null );

};



IDF.handle();