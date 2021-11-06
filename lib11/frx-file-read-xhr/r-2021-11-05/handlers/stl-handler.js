// copyright 2021 Theo Armour. MIT license.
/* global THREE, COR*/
// jshint esversion: 6
// jshint loopfunc: true


STL = {};

STL.src = FRX.urlLoaders + "STLLoader.js";

STL.handle = function () {

	if ( FRX.file ) { console.log( "file", FRX.file.name ); STL.read(); return; }

	if ( FRX.url ) { console.log( "url", FRX.url.split( "/" ).pop() ); STL.onChange(); return; }

	if ( FRX.content ) { console.log( "zip", FRX.zipFileName ); STL.checkLoader(); return; }

};



STL.read = function () {

	FRX.loadLoaders( STL, STL.src, STL.readFile );

};


STL.readFile = function ( inpFiles ) {

	const reader = new FileReader();
	reader.onload = () => STL.loadUrl( reader.result );
	reader.readAsDataURL( FRX.file );

};


STL.onChange = function () {

	FRX.loadLoaders( STL, STL.src, STL.loadUrl );

};


STL.checkLoader = function () {

	FRX.loadLoaders( STL, STL.src, STL.parse );

};



STL.loadUrl = function ( url = FRX.url) {

	const loader = new THREE.STLLoader();
	loader.load(

		url,

		( geometry ) => {

			//geometry.rotateX( -0.5 * Math.PI );
			//geometry.computeFaceNormals();
			geometry.computeVertexNormals();
			geometry.scale( 0.5, 0.5, 0.5 );
			geometry.center();

			// if ( geometry.hasColors ) {

			const material = new THREE.MeshStandardMaterial( { color: 0xcc8888 } );

			// } else {

			//material = new THREE.MeshNormalMaterial( { side: 2 } );

			//}

			mesh = new THREE.Mesh( geometry, material );
			mesh.castShadow = mesh.receiveShadow = true;

			COR.reset( [ mesh ] );

			THRR.getHtm = THRR.getHtmDefault;

		},

		( xhr ) => console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' ),

		( error ) => console.log( 'An error happened', error )

	);

};



STL.parse = function () {

	const loader = new THREE.STLLoader();

	console.log( "FRX.content ", FRX.content.slice( 0, 200 ) );

	loader.parse( FRX.content );

	//console.log( "geometry", geometry );

	// COR.reset( object.children );

	// THRR.getHtm = THRR.getHtmDefault;

}



STL.handle();