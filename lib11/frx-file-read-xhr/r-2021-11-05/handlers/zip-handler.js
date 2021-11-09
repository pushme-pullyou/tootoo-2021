// copyright 2021 Theo Armour. MIT license.
/* global THREE, COR, FRX, JSZip, r3DM, GBX, GLTF, HBJ, IDF, IFC, OBJ, RAD, STL, ZIP, FRXdivLog */
// jshint esversion: 6
// jshint loopfunc: true


ZIP = {};

ZIP.src = "https://cdn.jsdelivr.net/npm/jszip@3.7.1/dist/jszip.min.js";

ZIP.target = FRXdivDetails.appendChild( document.createElement( "div" ) );



ZIP.handle = function () {

	if ( FRX.file ) { console.log( "files ", FRX.file.name ); ZIP.read(); return; }

	if ( FRX.url ) { console.log( "url", FRX.url.split( "/" ).pop() ); ZIP.onChange( FRX.url ); return; }

};



ZIP.read = function () {

	if ( !window.JSZip ) {

		FRX.loadLoaders( ZIP, ZIP.src, ZIP.readFile );

		return;

	}

	ZIP.readFile();

};



ZIP.readFile = function ( file = FRX.file ) {

	console.log( "file", FRX.file );

	JSZip.loadAsync( FRX.file )

		.then( ( zip ) => {

			console.log( "zip", zip );

			ZIP.zip = zip;

			const names = ZIP.getNames( zip );

			//ZIP.getZipContents( names[ 0 ], zip );

		} )

		.catch( error => { console.error( "There has been a problem with your file operation:", error ); } );

};



ZIP.onChange = function () {


	if ( !window.JSZip ) {

		FRX.loadLoaders( ZIP, ZIP.src, ZIP.fetchZipFile );

		return;

	}

	FRX.loadLoaders( ZIP, ZIP.src, ZIP.fetchZipFile );

};


ZIP.fetchZipFile = function ( url ) {

	const url = url || "https://pushme-pullyou.github.io/tootoo-2021/" + FRX.url.slice( 2 )
	console.log( "url", url );

	fetch( url )

		.then( response => {

			if ( !response.ok ) { throw new Error( "Error" + response.statusText ); }

			return response.blob();

		} )

		.then( JSZip.loadAsync )

		.then( zip => {

			ZIP.zip = zip;

			ZIP.getNames();

		} )

		.catch( error => {
			console.error( "There has been a problem with your fetch operation:", error );
		} );

};




ZIP.getNames = function () {

	const names = [];

	ZIP.zip.forEach( ( relativePath, zipEntry ) => {
		console.log( "zipEntry.name", zipEntry.name );
		names.push( zipEntry.name );
	} );

	// console.log( "names", names );

	if ( ZIP.target ) {

		const htm = `<h3>${ FRX.file.name }</h3>`

		ZIP.target.innerHTML = htm + names.map( name =>
			`<div><button onclick=ZIP.getZipContents("${ name }",ZIP.zip)>${ name }</button></div>` ).join( "" ) + "<br>";

	}

	return names;

};



ZIP.getZipContents = function ( fileName, zip ) {

	//console.log( "fileName", fileName );
	//console.log( "ZIP.zip", ZIP.zip );
	extension = fileName.split( "." ).pop().toLowerCase();

	ZIP.zip.file( fileName ).async( "uint8array" )

		.then( function ( uint8array ) {

			let text;
			//console.log( "text", text );

			if ( uint8array[ 0 ] !== 255 || uint8array[ 0 ] === 239 || uint8array[ 0 ] === 60 ) {

				text = new TextDecoder( "utf-8" ).decode( uint8array );
				//console.log( 'text', text );

			} else {

				const arr = new Uint8Array( uint8array.length / 2 );
				let index = 0;

				for ( let i = 0; i < uint8array.length; i++ ) {

					if ( i % 2 === 0 ) {

						arr[ index++ ] = uint8array[ i ];

					}

				}

				text = new TextDecoder( "utf-8" ).decode( arr );

			}

			const regex = /encoding="utf-16"/i;

			return text.match( regex ) ? text.slice( 1 ).replace( regex, "" ) : text;

		} )

		.then( text => {
			//divMainContent.innerText = text;

			FRX.content = text;
			FRX.file = "";
			FRX.url = "";

			FRX.zipFileName = fileName;

			//console.log( "223", fileName  );

			FRX.selectHandler( fileName );

			//console.log( "text", text );
		} )

		.catch( error => {
			console.error( "There has been a problem with your fetch operation:", error );
		} );

};



ZIP.handle();