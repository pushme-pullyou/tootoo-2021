// copyright 2021 Theo Armour. MIT license.
/* global THREE, THR, THRU, COR */
// jshint esversion: 6
// jshint loopfunc: true

GLTF = {};

GLTF.src = FRX.urlLoaders + "GLTFLoader.js";

GLTF.handle = function () {

	if ( FRX.file ) { console.log( "file ", FRX.file.name ); GLTF.checkLoader(); return; }

	if ( FRX.url ) { console.log( "url", FRX.url.split( "/" ).pop() ); GLTF.onChange(); return; }

	if ( FRX.content ) { console.log( "zip", FRX.zipFileName ); GLTF.onUnZip( FRX.content ); return; }

};



GLTF.checkLoader = function () {

	FRX.loadLoaders( GLTF, GLTF.src, GLTF.readFile );

};



GLTF.readFile = function () {

	const reader = new FileReader();
	reader.onload = () => GLTF.loadDataUrl( reader.result );
	reader.readAsDataURL( FRX.file );

};



GLTF.onChange = function () {

	FRX.loadLoaders( GLTF, GLTF.src, GLTF.loadDataUrl );

};



GLTF.onUnZip = function () {

	alert( "GLTF files are highly compressed. Unzipping them is not a high priority. Yet." );

};



GLTF.loadDataUrl = function ( url = FRX.url ) {

	const loader = new THREE.GLTFLoader();

	const dracoLoader = new THREE.DRACOLoader();
	dracoLoader.setDecoderPath( './' );
	loader.setDRACOLoader( dracoLoader );

	loader.load(
		url,
		( gl ) => {

			gltf = gl;
			//console.log( "gltf", gltf );

			const bbox = new THREE.Box3().setFromObject( gltf.scene.children[ 0 ] );

			if ( bbox.max.x !== Infinity ) {
				const sphere = bbox.getBoundingSphere( new THREE.Sphere() );

				THR.center = sphere.center;
				THR.radius = sphere.radius;
				THR.bottom = bbox.min.z;
			}

			if ( THR.radius < 1 ) {

				gltf.scene.children[ 0 ].scale.set( 10 / THR.radius, 10 / THR.radius, 10 / THR.radius );

			}

			COR.reset( gltf.scene.children );

			THRR.getHtm = THRR.getHtmDefault;

		},

		( xhr ) => {

			console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

		},

		( error ) => {

			console.log( 'An error happened', error );

		}
	);

};



GLTF.handle();