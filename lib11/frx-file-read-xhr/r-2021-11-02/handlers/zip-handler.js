// copyright 2021 Theo Armour. MIT license.
/* global THREE, COR, FRX, JSZip, r3DM, GBX, GLTF, HBJ, IDF, IFC, OBJ, RAD, STL, ZIP, FRXdivLog */
// jshint esversion: 6
// jshint loopfunc: true


ZIP = {};

ZIP.src = "https://cdn.jsdelivr.net/npm/jszip@3.7.1/dist/jszip.min.js";

ZIP.target = FRXdivDetails.appendChild( document.createElement( "div" ) );



ZIP.handle = function () {

	if ( FRX.file ) { console.log( "files ", FRX.file.name ); ZIP.read(); return; }

	if ( FRX.url ) { console.log( "url", FRX.url.split( "/" ).pop() ); ZIP.fetchZipFile( FRX.url ); return; }

};



ZIP.read = function () {

	if ( !window.JSZip ) {

		FRX.loadLoaders( ZIP.loader, ZIP.src, ZIP.readFile );

		return;

	}

	ZIP.readFile();

};



ZIP.readFile = function ( file = FRX.file ) {

	JSZip.loadAsync( file )

		.then( ( zip ) => {

			ZIP.zip = zip;

			const names = ZIP.getNames( zip );

			ZIP.getZipContents( names[ 0 ], zip );

		} )

		.catch( error => { console.error( "There has been a problem with your file operation:", error ); } );

};




ZIP.fetchZipFile = function ( url = url2 ) {

	//console.log( "url", url );

	fetch( url )

		.then( response => {

			if ( !response.ok ) { throw new Error( "Error" + response.statusText ); }

			return response.blob();

		} )

		.then( JSZip.loadAsync )

		.then( zip => {

			ZIP.zip = zip;

			const names = ZIP.getNames();

			ZIP.getZipContents( names[ 0 ] );

		} )

		.catch( error => {
			console.error( "There has been a problem with your fetch operation:", error );
		} );

};




ZIP.getNames = function ( zip ) {

	const names = [];

	ZIP.zip.forEach( ( relativePath, zipEntry ) => {
		//console.log( "zipEntry.name", zipEntry.name );
		names.push( zipEntry.name );
	} );

	if ( ZIP.target ) {

		ZIP.target.innerHTML = names.map( name =>
			`<div><button onclick=ZIP.getZipContents("${ name }",ZIP.zip)>${ name }</button></div>` ).join( "" );

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

			// if ( fileName.endsWith( ".3dm" ) ) { FRX.load( "r3DM", "3dm-handler.js" ); return; }

			// if ( fileName.endsWith( "xml" ) ) { FRX.load( "GBX", "gbx-handler.js" ); return; }

			// if ( fileName.endsWith( "gltf" ) || fileName.endsWith( "glb" ) ) { FRX.load( "GLTF", "gltf-handler.js" ); return; }

			// if ( fileName.endsWith( "hbjson" ) ) { FRX.load( "HBJ", "hbj-handler.js" ); return; }

			// if ( fileName.endsWith( "json" ) ) { FRX.load( "JSN", "jsn-three-handler.js" ); return; }

			// if ( fileName.endsWith( ".idf" ) || fileName.endsWith( ".osm" ) ) { FRX.load( "IDF", "idf-handler.js" ); return; }

			// if ( fileName.endsWith( "obj" ) ) { FRX.load( "OBJ", "obj-handler.js" ); return; }

			// if ( fileName.endsWith( "rad" ) ) { FRX.load( "RAD", "rad-handler.js" ); return; }

			// if ( fileName.endsWith( "stl" ) ) { FRX.load( "STL", "stl-handler.js" ); return; }

			// if ( fileName.endsWith( "vtk" ) ) { FRX.load( "VTK", "vtk-handler.js" ); return; }

		} )

		.catch( error => {
			console.error( "There has been a problem with your fetch operation:", error );
		} );

};



ZIP.unzip = function ( url ) {

	//console.log( "url", url );

	let zip;
	let fName;

	JSZip.loadAsync( url )
		.then( dataZip => {

			zip = dataZip;
			fName = Object.keys( zip.files )[ 0 ];
			return zip.file( fName ).async( "string" );

		} ).then( text => {

			FRX.content = text;
			FRX.zipFileName = fName;

			FRX.selectHandler( fName );
			//console.log( "text", text );

			// if ( fName.endsWith( ".3dm" ) ) { FRX.load( "r3DM", "3dm-handler.js" ); return; }

			// if ( fName.endsWith( "xml" ) ) { FRX.load( "GBX", "gbx-handler.js" ); return; }

			// if ( fName.endsWith( "gltf" ) || fileName.endsWith( "glb" ) ) { FRX.load( "GLTF", "gltf-handler.js" ); return; }

			// if ( fName.endsWith( "hbjson" ) ) { FRX.load( "HBJ", "hbj-handler.js" ); return; }

			// if ( fName.endsWith( "json" ) ) { FRX.load( "JSN", "jsn-three-handler.js" ); return; }

			// if ( fName.endsWith( ".idf" ) || fName.endsWith( ".osm" ) ) { FRX.load( "IDF", "idf-handler.js" ); return; }

			// if ( fName.endsWith( "obj" ) ) { FRX.load( "OBJ", "obj-handler.js" ); return; }

			// if ( fName.endsWith( "rad" ) ) { FRX.load( "RAD", "rad-handler.js" ); return; }

			// if ( fName.endsWith( "stl" ) ) { FRX.load( "STL", "stl-handler.js" ); return; }

			// if ( fName.endsWith( "vtk" ) ) { FRX.load( "VTK", "vtk-handler.js" ); return; }

		},

			( event ) => FRXdivLog += `<div>Error reading ${ fName }: ${ event.message }</div>`

		);


};


ZIP.handle();