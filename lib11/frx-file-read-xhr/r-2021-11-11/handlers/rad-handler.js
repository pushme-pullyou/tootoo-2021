// Copyright 2021 Theo Armour. MIT License
/* global THREE * /
/* jshint esversion: 6 */
// jshint loopfunc: true


RAD = {};


RAD.src = FRX.pathUtilities + "parsers/rad-parser.js";

RAD.loaded = false;

RAD.handle = function () {

	if ( FRX.file ) { console.log( "file", FRX.file.name ); RAD.read(); return; }

	if ( FRX.url ) { console.log( "url", FRX.url.split( "/" ).pop() ); RAD.onChange(); return; }

	if ( FRX.content ) { console.log( "zip", FRX.zipFileName ); RAD.checkLoader(); return; }

};

// RAD.handle = function () {

// 	console.log( "FRX.content", FRX.content.slice( 0, 100 ) );
// 	console.log( "FRX.files ", FRX.file.name );
// 	console.log( "FRX.url", FRX.url.split( "/" ).pop() );

// 	if ( FRX.file ) { RAD.read(); return; }

// 	if ( FRX.url ) { RAD.onChange( FRX.url ); return; }

// 	if ( FRX.content ) { RAD.addDataFile( FRX.content ); return; }

// };


RAD.read = function () {

	FRX.loadLoaders( RAD, RAD.src, RAD.readFile );

};



RAD.bbreadFile = function () {

	const reader = new FileReader();
	reader.onload = () => RAD.parse( reader.result );
	reader.readAsText( FRX.file );

};


RAD.readFile = function () {

	result = "";
	RAD.count = 0;

	for ( let file of FRX.files ) {

		const reader = new FileReader();

		reader.onload = ( event ) => {

			result += event.target.result;

			RAD.count++;

			if ( RAD.count === FRX.files.length ) {

				RAD.addDataFile( result );

				//console.log( "result", result );

			}

			//console.log( "RAD.count", RAD.count );

		};

		reader.readAsText( file );

	}

};


RAD.onChange = function () {

	const xhr = new XMLHttpRequest();
	xhr.open( 'GET', FRX.url, true );
	xhr.onerror = ( xhr ) => console.log( 'error:', xhr );
	//xhr.onprogress = ( xhr ) => console.log( 'bytes loaded:', xhr.loaded );
	xhr.onload = ( xhr ) => RAD.addDataFile( xhr.target.response );
	xhr.send( null );

};


RAD.checkLoader = function () {

	FRX.loadLoaders( RAD, RAD.src, RAD.handleZip );

};


RAD.handleZip = function () {

	FRX.content += FRX.content;

	if ( index = ZIP.fileNames.length ) {

		RAD.addDataFile();

	}
	index++

}

// called by RAD.callbackRequestFile &&

RAD.addDataFile = function ( text = FRX.content ) {

	if ( text.isTrusted ) { text = FRX.content } // parameter was an event therefore assume and take ZIP content
	//console.log( "text", text );

	RAD.json = { 'surfaces': [], 'materials': [], 'other': [] };

	RAD.materialType = THR.scene.getObjectByName( 'THR.lightAmbient' ) ?
		THREE.MeshPhongMaterial
		:
		THREE.MeshBasicMaterial
		;

	RAD.divPopUpData = document.getElementById( 'divPopUpData' );

	const json = RAD.radToJson( text );

	//console.log( "json", json );

	json.forEach( result => RAD.json[ result[ 0 ] ].push( result[ 1 ] ) ); // not easy to understand

	RAD.setThreeJsWindowUpdate( RAD.json );

	return json;

};



RAD.handle();
