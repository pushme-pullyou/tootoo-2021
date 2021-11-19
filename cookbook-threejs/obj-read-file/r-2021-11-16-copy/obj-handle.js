

const OBJ = {};

OBJ.scriptToLoad = 0;

OBJ.loaded = false;

OBJ.object = undefined;

OBJ.scripts = [
	"https://cdn.jsdelivr.net/gh/mrdoob/three.js@r134/examples/js/loaders/DDSLoader.js",
	"https://cdn.jsdelivr.net/gh/mrdoob/three.js@r134/examples/js/loaders/OBJLoader.js",
	"https://cdn.jsdelivr.net/gh/mrdoob/three.js@r134/examples/js/loaders/MTLLoader.js"
];



OBJ.init = function ( obj = {} ) {

	OBJ.target = obj.target || document.body;

	OBJdivMenu = OBJ.target.appendChild( document.createElement( 'div' ) );

	OBJdivMenu.innerHTML = `
<details open>
	<summary style=font-size:150%;font-weight:bold; >OBJ menu</summary>
	<p>
	<p>
		See <a href="https://en.wikipedia.org/wiki/Wavefront_.obj_file" target="_blank">Wikipedia OBJ</a>
	</p>
	path to files
	<input id=OBJinpPath class=full-width onchange=localStorage.setItem("OBJpath",this.value); >
	</p>
	<p>
		<input type=file id=OBJinpFiles onchange="OBJ.loadLoaders()"  multiple>
	</p>
</details>
`;

	OBJinpPath.value = localStorage.getItem( "OBJpath" );
	
	OBJ.loadLoaders();

};




OBJ.loadLoaders = function () {

	if ( OBJ.loaded ) { OBJ.readFiles(); return; }

	const script = OBJ.scripts[ OBJ.scriptToLoad ];
	const load = document.body.appendChild( document.createElement( "script" ) );
	load.onload = OBJ.onLoadScript;
	load.src = script;

};



OBJ.onLoadScript = function () {

	OBJ.scriptToLoad++;

	OBJ.scriptToLoad < OBJ.scripts.length ? OBJ.loadLoaders() : OBJ.readFiles();

};




OBJ.readFiles = function () {

	OBJ.loaded = true;

	const objFiles = Array.from( OBJinpFiles.files ).filter( file => file.name.toLowerCase().endsWith( "obj" ) );

	for ( let file of objFiles ) {

		const nameMtl = file.name.toLowerCase().replace( ".obj", ".mtl" );

		const fileMaterial = Array.from( OBJinpFiles.files ).find( file => file.name.toLowerCase() === nameMtl );

		fileMaterial ? OBJ.loadMtl( file, fileMaterial ) : OBJ.loadObj( file );

	};

};



OBJ.loadMtl = function ( file, fileMaterials ) {

	//const manager = new THREE.LoadingManager();
	//manager.addHandler( /\.dds$/i, new THREE.DDSLoader() );

	const loaderMaterials = new THREE.MTLLoader(); // ( manager )

	const reader = new FileReader();

	reader.onload = () => {

		const materials = loaderMaterials.parse( reader.result, OBJinpPath.value );

		OBJ.loadObj( file, materials );

	};

	reader.readAsText( fileMaterials );

};



OBJ.loadObj = function ( file, material ) {

	const loader = new THREE.OBJLoader();
	if ( material ) { loader.setMaterials( material ); }

	const reader = new FileReader();

	reader.onload = () => {

		if ( chkNewFile.checked ) { scene.remove( OBJ.object ); }

		OBJ.object = loader.parse( reader.result );

		OBJ.object.rotation.x = 1.5708;

		const scale = 50 / new THREE.Box3().setFromObject( OBJ.object ).max.z; //.getBoundingSphere( new THREE.Sphere()).radius;
		OBJ.object.scale.set( scale, scale, scale );

		if ( !chkNewFile.checked ) {
			OBJ.object.position.set( 100 * Math.random() - 50, 100 * Math.random() - 50, 0 );
		}

		scene.add( OBJ.object );

	};

	reader.readAsText( file );

};