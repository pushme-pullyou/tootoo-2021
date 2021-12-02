// copyright 2021 Theo Armour. MIT license.
/* global THREE, COR*/
// jshint esversion: 6
// jshint loopfunc: true

VTK = {};

VTK.src = FRX.urlLoaders + "VTKLoader.js";


VTK.handle = function () {

	if ( FRX.file ) { console.log( "file", FRX.file.name ); VTK.read(); return; }

	if ( FRX.url ) { console.log( "url", FRX.url.split( "/" ).pop() ); VTK.onChange(); return; }

	if ( FRX.content ) { console.log( "zip", FRX.zipFileName ); VTK.checkLoader(); return; }

};



VTK.read = function () {

	FRX.loadLoaders( VTK, VTK.src, VTK.readFile );
};



VTK.readFile = function () {

	const reader = new FileReader();
	reader.onload = () => VTK.loadUrl( reader.result );
	reader.readAsDataURL( FRX.file );

};



VTK.onChange = function () {

	FRX.loadLoaders( VTK, VTK.src, VTK.loadUrl() );

};



VTK.checkLoader = function () {

	FRX.loadLoaders( VTK, VTK.src, VTK.parse );

};



VTK.loadUrl = function ( url = FRX.url) {

	const loader = new THREE.VTKLoader();

	loader.load( url, function ( geometry ) {

		geometry.center();
		geometry.computeVertexNormals();

		const material = new THREE.MeshLambertMaterial( { color: 0xffffff } );
		const mesh = new THREE.Mesh( geometry, material );
		mesh.scale.multiplyScalar( 50 );
		scene.add( mesh );

		COR.reset( [ mesh ] );

		THRR.getHtm = THRR.getHtmDefault;

	} );

};



VTK.parse = function ( content = VTK.content ) {

	const loader = new THREE.VTKLoader();

	loader.load( url, function ( geometry ) {

		geometry.center();
		geometry.computeVertexNormals();

		const material = new THREE.MeshLambertMaterial( { color: 0xffffff } );
		const mesh = new THREE.Mesh( geometry, material );
		mesh.scale.multiplyScalar( 50 );
		scene.add( mesh );

		COR.reset( [ mesh ] );

		THRR.getHtm = THRR.getHtmDefault;

	} );

};



VTK.handle();