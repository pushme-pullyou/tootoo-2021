// copyright 2021 Theo Armour. MIT license.
/* global THREE, COR*/
// jshint esversion: 6
// jshint loopfunc: true

OBJ = {};

OBJ.src = FRX.urlLoaders + "OBJLoader.js";

OBJ.scripts = [
	FRX.urlLoaders + "DDSLoader.js",
	FRX.urlLoaders + "MTLLoader.js",
	FRX.urlLoaders + "OBJLoader.js"
];

OBJ.loadedScripts = 0;


OBJ.path = "https://cdn.jsdelivr.net/gh/ladybug-tools/3d-models@gh-pages/";

//OBJ.path = "https://raw.githack.com/ladybug-tools/3d-models/gh-pages/quaternius/";

OBJ.fileName = "CommonTree_5";

OBJ.urlDefaultFile = "quaternius/ultimate-nature-pack/CactusFlowers_5";

OBJ.handle = function () {

	if ( FRX.file ) { console.log( "file", FRX.file.name ); OBJ.read(); return; }

	if ( FRX.url ) { console.log( "url", FRX.url.split( "/" ).pop() ); OBJ.onChange(); return; }

	if ( FRX.content ) { console.log( "zip", FRX.zipFileName ); OBJ.checkLoader(); return; }

};



OBJ.read = function () {

	FRX.loadLoaders( OBJ, OBJ.scripts, OBJ.readFile );

};



OBJ.readFile = function () {

	console.log( "FRX.file.name", FRX.file.name );
	OBJ.loadedScripts++;


	if ( OBJ.loadedScripts === OBJ.scripts.length ) {

		OBJ.manager = new THREE.LoadingManager();

		OBJ.manager.addHandler( /\.dds$/i, new THREE.DDSLoader() );

		OBJ.loadObj( FRX.file.name  );

	}


};



OBJ.onChange = function () {

	FRX.loadLoaders( OBJ, OBJ.src, OBJ.loadUrl );

};



OBJ.checkLoader = function () {

	FRX.loadLoaders( OBJ, OBJ.src, OBJ.parse );

};



OBJ.loadObj = function ( fName = OBJ.urlDefaultFile, path = OBJ.path, params = {} ) {
	console.log( 'fName', fName );

	//FO.getOpenNew();

	//THR.scene.add( THR.group );

	//console.log( 'path', path );
	//console.log( 'params', params );

	new THREE.MTLLoader( OBJ.manager )
		.setPath( path )
		.load( fName + ".mtl", function ( materials ) {

			materials.preload();

			new THREE.OBJLoader( OBJ.manager )
				.setMaterials( materials )
				.setPath( path )
				.load( fName + '.obj', function ( obj ) {

					const object = obj;
					object.name = fName + ".obj";

					console.log( "object", object );

					// OM.selected = [];

					// OM.selected.push( object );

					// OM.setDragControls( OM.selected );

					// // dragControls = new THREE.DragControls( OM.selected, THR.camera, THR.renderer.domElement );
					// // dragControls.transformGroup = true;
					// // dragControls.addEventListener( 'dragstart', function ( event ) { THR.controls.enabled = false; } );
					// // dragControls.addEventListener( 'dragend', function ( event ) { THR.controls.enabled = true; } );

					// object.userData.url = FO.url;

					//object.folder =
					object.position.set( + params.px || 0, +params.py || 0, +params.pz || 0 );
					object.rotation.set( + params.rx || 0, +params.ry || 0, +params.rz || 0 );
					object.scale.set( +params.sx || 1, +params.sy || 1, +params.sz || 1 );

					object.rotation.x = Math.PI / 2;
					//object.rotation.y = 7 * Math.random();

					//object.scale.set( 3, 3, 3 );
					object.children[ 0 ].receiveShadow = true;
					object.children[ 0 ].castShadow = true;

					//THR.group.add( object );

					COR.reset( object.children );

					//OM.setDragControls();

					//OM.setDragControls( THR.group.children );

					//OM.objects.push( object );

					//OMselObjects.innerHTML += `<option>${ fName }</option>`;


				} );

		} );

};



OBJ.loadUrl = function ( url = FRX.url ) {
	//console.log( "", OBJ.src );

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