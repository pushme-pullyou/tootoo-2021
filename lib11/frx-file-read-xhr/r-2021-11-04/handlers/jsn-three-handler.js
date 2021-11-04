// copyright 2021 Theo Armour. MIT license.
/* global THREE, COR*/
// jshint esversion: 6
// jshint loopfunc: true

JSN = {};

JSN.src = `https://cdn.jsdelivr.net/gh/mrdoob/three.js@${ FRX.releaseThree }/src/loaders/ObjectLoader.js`;

JSN.handle = function () {

	if ( FRX.file ) { console.log( "file", FRX.file.name ); JSN.read(); return; }

	if ( FRX.url ) { console.log( "url", FRX.url.split( "/" ).pop() ); JSN.onChange(); return; }

	if ( FRX.content ) { console.log( "zip", FRX.zipFileName ); JSN.checkLoader(); return; }

};



JSN.read = function () {

	JSN.readFile()

};




JSN.readFile = function () {

	const reader = new FileReader();
	reader.onload = ( event ) => JSN.parseJson( JSON.parse( event.target.result ) );
	reader.readAsText( FRX.file );

};



JSN.onChange = function ( url ) {

	JSN.requestFile();

};



JSN.checkLoader = function () {

	JSN.parseJson( FRX.content )

};



JSN.requestFile = function ( url = FRX.url ) {

	const xhr = new XMLHttpRequest();
	xhr.open( "get", url, true );
	xhr.onload = ( xhr ) => JSN.parseJson( JSON.parse( xhr.target.response ) );
	xhr.send( null );

}


JSN.parseJson = function ( json ) {

	JSN.json = json;
	//console.log( "json", JSN.json );

	const loader = new THREE.ObjectLoader();
	const object = loader.parse( JSN.json );

	if ( object.isScene ) {

		THR.scene = object;

	} else {

		THR.scene.add( object );

	}

};



JSN.handle();