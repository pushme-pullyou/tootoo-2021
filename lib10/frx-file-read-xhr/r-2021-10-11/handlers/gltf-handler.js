// copyright 2021 Theo Armour. MIT license.
/* global THREE, THR, THRU, COR */
// jshint esversion: 6
// jshint loopfunc: true

GLTF = {};

GLTF.handle = function () {

	//console.log( "FRX.content", FRX.content.slice( 0, 100 ) );
	console.log( "FRX.files ", FRX.file.name );
	console.log( "FRX.url", FRX.url.split( "/" ).pop() );

	if ( FRX.content ) { GLTF.parse( FRX.content ); return; }

	if ( FRX.file ) { GLTF.read(); return; }

	if ( FRX.url ) { GLTF.onChange( FRX.url ); return; }

};



GLTF.onChange = function ( url ) {

	if ( GLTF.loader === undefined ) {

		GLTF.loader = document.body.appendChild( document.createElement( 'script' ) );
		GLTF.loader.onload = () => GLTF.loadDataUrl( FRX.url );
		GLTF.loader.src = `https://cdn.jsdelivr.net/gh/mrdoob/three.js@${ FRX.releaseThree }/examples/js/loaders/GLTFLoader.js`;

	} else {

		GLTF.loadDataUrl( FRX.url );

	}
};


GLTF.read = function ( inpFiles ) {

	if ( GLTF.gltfLoader === undefined ) {

		GLTF.gltfLoader = document.body.appendChild( document.createElement( 'script' ) );
		GLTF.gltfLoader.onload = () => GLTF.readFile();
		GLTF.gltfLoader.src = "https://cdn.jsdelivr.net/gh/mrdoob/three.js@r131/examples/js/loaders/GLTFLoader.js";

	} else {

		GLTF.readFile();

	}

};



GLTF.readFile = function () {

	const reader = new FileReader();
	reader.onload = () => GLTF.loadDataUrl( reader.result );
	reader.readAsDataURL( FRX.file );

};



GLTF.loadDataUrl = function ( url = GLTF.defaultFile ) {

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

GLTF.parse = function() {

	alert( "GLTF files are highly compressed. Unzipping them is not a high priority. Yet." )

}

GLTF.handle();