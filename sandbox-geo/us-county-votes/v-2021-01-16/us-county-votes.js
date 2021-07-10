
let group;



function init () {

	selYear.focus();

	// camera = new THREE.PerspectiveCamera( 28, window.innerWidth / window.innerHeight, 0.000000000001, Infinity );
	// scene = new THREE.Scene();

	const light = new THREE.AmbientLight( 0x404040 ); // soft white light
	scene.add( light )

	const directionalLight = new THREE.DirectionalLight( 0xffffff );
	directionalLight.position.set( 0, 0, 100 ).normalize();
	scene.add( directionalLight );

	const directionalLight2 = new THREE.DirectionalLight( 0xffffff );
	directionalLight2.position.set( 0, 0, -100 ).normalize();
	scene.add( directionalLight2 );

	const directionalLight3 = new THREE.DirectionalLight( 0xffffff );
	directionalLight3.position.set( 0, -100, 0 ).normalize();
	scene.add( directionalLight3 );

	group = new THREE.Group();
	group.name = "votes";
	scene.add( group );

	VOT.requestFile( "../us-county-votes.csv", VOT.getVotes );

	UFR.init(); // ufr-usa-fips-remix.js


	//RAY.init( group );

	RAY.intersectObjects = group.children;

	RAY.raycaster = new THREE.Raycaster();
	RAY.mouse = new THREE.Vector2();

	// element = document.body.querySelector( "#map" );
	// console.log( "element", element );
	// ele = document.body.querySelectorAll( "canvas.mapboxgl-canvas" );

	// RAY.addMouseMove( element );

}
