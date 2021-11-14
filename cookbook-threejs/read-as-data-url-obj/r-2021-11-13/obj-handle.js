

const OBJ = {};

OBJ.scripts = [
	"https://cdn.jsdelivr.net/gh/mrdoob/three.js@r134/examples/js/loaders/MTLLoader.js",
	"https://cdn.jsdelivr.net/gh/mrdoob/three.js@r134/examples/js/loaders/OBJLoader.js",

];

OBJ.loadedScripts = 0;

OBJ.init = function () {

	OBJdivMenu = divMenu.appendChild( document.createElement( 'div' ) );

	OBJdivMenu.innerHTML = `
<details open>
<summary style=font-size:150%;font-weight:bold; >OBJ menu<summary>
<p>

<input type=file id=OBJinpFiles onchange="OBJ.loadLoaders()"  multiple>
</p>

</details>
`;

};



OBJ.loadLoaders = function ( obj = OBJ, scripts = OBJ.scripts, onLoad = OBJ.onLoadScript ) {


	if ( !obj?.loaded ) {

		//console.log( "scripts", scripts );

		if ( scripts.length === 0 ) {

			obj.loaded = true;
			onLoad();

		} else {

			for ( script of scripts ) {

				obj.loaded = true;
				const load = document.body.appendChild( document.createElement( 'script' ) );
				load.onload = onLoad;
				load.src = script;

			}

			return;

		}

	}

	onLoad();

};



OBJ.onLoadScript = function () {

	OBJ.loadedScripts++;

	if ( OBJ.loadedScripts === OBJ.scripts.length ) {

		OBJ.readFiles();

	}

};


OBJ.readFiles = function () {

	//console.log( "", 34 );

	for ( let file of OBJinpFiles.files ) {

		if ( !file.name.toLowerCase().endsWith( "obj" ) ) { continue; }

		console.log( "file", file );

		const reader = new FileReader();
		reader.onload = () => OBJ.loadData( file.name, reader.result );
		reader.readAsText( file );

	};

};

OBJ.loadData = function ( name, txt ) {

	//console.log( "txt", txt );

	root = name.slice( 0, -3 );

	fileMaterial = Array.from( OBJinpFiles.files ).find( file => root + "mtl" );

	const reader = new FileReader();
	reader.onload = () => {

		material = reader.result;
		loaderMtl = new THREE.MTLLoader();
		mtl = loaderMtl.parse( material, "./" );

		loader = new THREE.OBJLoader()
		.setPath( './' )
		.setMaterials( mtl );
		obj = loader.parse( txt );

		scene.add( obj );

	}
	reader.readAsText( fileMaterial );







		//FO.getOpenNew();

		//THR.scene.add( THR.group );

		//console.log( 'path', path );
		//console.log( 'params', params );

		// new THREE.MTLLoader( OBJ.manager )
		// 	.setPath( path )
		// 	.load( fName + ".mtl", function ( materials ) {

		// 		materials.preload();

		// 		new THREE.OBJLoader( OBJ.manager )
		// 			.setMaterials( materials )
		// 			.setPath( path )
		// 			.load( fName + '.obj', function ( obj ) {

		// 				const object = obj;
		// 				object.name = fName + ".obj";

		// 				console.log( "object", object );

		// 				// OM.selected = [];

		// 				// OM.selected.push( object );

		// 				// OM.setDragControls( OM.selected );

		// 				// // dragControls = new THREE.DragControls( OM.selected, THR.camera, THR.renderer.domElement );
		// 				// // dragControls.transformGroup = true;
		// 				// // dragControls.addEventListener( 'dragstart', function ( event ) { THR.controls.enabled = false; } );
		// 				// // dragControls.addEventListener( 'dragend', function ( event ) { THR.controls.enabled = true; } );

		// 				// object.userData.url = FO.url;

		// 				//object.folder =
		// 				object.position.set( + params.px || 0, +params.py || 0, +params.pz || 0 );
		// 				object.rotation.set( + params.rx || 0, +params.ry || 0, +params.rz || 0 );
		// 				object.scale.set( +params.sx || 1, +params.sy || 1, +params.sz || 1 );

		// 				object.rotation.x = Math.PI / 2;
		// 				//object.rotation.y = 7 * Math.random();

		// 				//object.scale.set( 3, 3, 3 );
		// 				object.children[ 0 ].receiveShadow = true;
		// 				object.children[ 0 ].castShadow = true;

		// 				//THR.group.add( object );

		// 				COR.reset( object.children );

		// 				//OM.setDragControls();

		// 				//OM.setDragControls( THR.group.children );

		// 				//OM.objects.push( object );

		// 				//OMselObjects.innerHTML += `<option>${ fName }</option>`;


		// 			} );

		// 	} );

}