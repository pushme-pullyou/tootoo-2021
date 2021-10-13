// copyright 2021 Theo Armour. MIT license.
/* global THREE, COR*/
// jshint esversion: 6
// jshint loopfunc: true

OBJ = {};

OBJ.src = FRX.urlLoaders + "OBJLoader.js";

OBJ.handle = function () {

	if ( FRX.file ) { console.log( "file", FRX.file.name ); OBJ.read(); return; }

	if ( FRX.url ) { console.log( "url", FRX.url.split( "/" ).pop() ); OBJ.onChange(); return; }

	if ( FRX.content ) { console.log( "zip", FRX.zipFileName ); OBJ.checkLoader(); return; }

};



OBJ.read = function () {

	FRX.loadLoader( OBJ.loader, OBJ.src, OBJ.readFile );

};



OBJ.readFile = function () {

	const reader = new FileReader();
	reader.onload = ( event ) => OBJ.loadUrl( event.target.result );
	reader.readAsDataURL( FRX.file );

};



OBJ.onChange = function () {

	FRX.loadLoader( OBJ.loader, OBJ.src, OBJ.loadUrl );

};



OBJ.loadUrl = function ( url = FRX.url ) {
	console.log( "", OBJ.src );

	const loader = new THREE.OBJLoader();

	loader.load(
		url,

		function ( object ) {

			OBJ.onLoadObj( object );

		},

		function ( xhr ) {

			//console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

		},

		function ( error ) {

			console.log( "error: ", error );

		}
	);

};


OBJ.checkLoader = function () {

	FRX.loadLoader( OBJ.loader, OBJ.src, OBJ.parse );

};



OBJ.parse = function () {

	const loader = new THREE.OBJLoader();

	OBJ.onLoadObj( loader.parse( FRX.content ) );

};



OBJ.onLoadObj = function ( group ) {
	//console.log( "object", group );

	const meshes = group.children;

	meshes.forEach( mesh => {

		mesh.rotation.x = Math.PI / 2;

		const box = new THREE.Box3().setFromObject( group );
		const scale = 200 / box.min.distanceTo( box.max );

		mesh.scale.set( scale, scale, scale );

	} );

	COR.reset( meshes );

	THRR.getHtm = THRR.getHtmDefault;

};


OBJ.handle();