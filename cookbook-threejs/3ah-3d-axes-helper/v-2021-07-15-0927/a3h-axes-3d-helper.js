console.log( "", 23 );


const A3H = {

	group,
	axesHelper,
	lightDirectional,
	cameraHelper,
	renderer,
	camera,
	controls,
	scene
};



A3H.init = function () {


	if ( !window.A3HdivPopUp ) {

		let renderer, camera, controls, scene;

		camera = new THREE.OrthographicCamera( - 2, 2, 2, - 2, 0, 4 );
		camera.position.set( 0, 0, 2 );

		scene = new THREE.Scene();
		scene.background = new THREE.Color( 0xcce0ff );
		scene.add( camera );

		renderer = new THREE.WebGLRenderer( { alpha: true, antialias: true } );
		//renderer.setPixelRatio( w );
		renderer.setSize( 100, 100);

		renderer.outputEncoding = THREE.sRGBEncoding;


		A3HdivPopUp = document.body.appendChild( document.createElement( 'div' ) );
		A3HdivPopUp.hidden = false;
		A3HdivPopUp.id = "A3HdivPopUp";

		A3HdivPopUp.style.backgroundColor = "#fff";
		A3HdivPopUp.style.border = "1px solid #8a8";
		A3HdivPopUp.style.borderRadius = "0.5rem";
		A3HdivPopUp.style.padding = "0.5rem";
		A3HdivPopUp.style.position = "absolute";

		A3HdivPopUp.style.bottom = "1rem";
		A3HdivPopUp.style.right = "1rem";
		A3HdivPopUp.style.height = "10rem";
		A3HdivPopUp.style.width = "10rem";

		A3HdivPopUp.appendChild( renderer.domElement );

		// controls = new THREE.OrbitControls( camera, renderer.domElement );
		// controls.minDistance = 1;
		// controls.maxDistance = 500;
		// controls.autoRotate = true;
		// controls.enableDamping = true;
		// controls.dampingFactor = 0.08;
		// controls.enablePan = true;
		// controls.autoRotateSpeed = 5;





		// A3HdivPopUp.classList.add( "infoTooltip" );
		// A3HdivPopUp.style.display = "block";


		const color1 = new THREE.Color( '#ff3653' );
		const color2 = new THREE.Color( '#8adb00' );
		const color3 = new THREE.Color( '#2c8fff' );


		const geometry = new THREE.BoxGeometry( 0.8, 0.05, 0.05 ).translate( 0.4, 0, 0 );

		const xAxis = new THREE.Mesh( geometry, getAxisMaterial( color1 ) );
		const yAxis = new THREE.Mesh( geometry, getAxisMaterial( color2 ) );
		const zAxis = new THREE.Mesh( geometry, getAxisMaterial( color3 ) );

		yAxis.rotation.z = Math.PI / 2;
		zAxis.rotation.y = - Math.PI / 2;

		axes.add( xAxis );
		axes.add( zAxis );
		axes.add( yAxis );

		const posXAxisHelper = new THREE.Sprite( getSpriteMaterial( color1, 'X' ) );
		posXAxisHelper.userData.type = 'posX';
		const posYAxisHelper = new THREE.Sprite( getSpriteMaterial( color2, 'Y' ) );
		posYAxisHelper.userData.type = 'posY';
		const posZAxisHelper = new THREE.Sprite( getSpriteMaterial( color3, 'Z' ) );
		posZAxisHelper.userData.type = 'posZ';
		const negXAxisHelper = new THREE.Sprite( getSpriteMaterial( color1 ) );
		negXAxisHelper.userData.type = 'negX';
		const negYAxisHelper = new THREE.Sprite( getSpriteMaterial( color2 ) );
		negYAxisHelper.userData.type = 'negY';
		const negZAxisHelper = new THREE.Sprite( getSpriteMaterial( color3 ) );
		negZAxisHelper.userData.type = 'negZ';

		posXAxisHelper.position.x = 1;
		posYAxisHelper.position.y = 1;
		posZAxisHelper.position.z = 1;
		negXAxisHelper.position.x = - 1;
		negXAxisHelper.scale.setScalar( 0.8 );
		negYAxisHelper.position.y = - 1;
		negYAxisHelper.scale.setScalar( 0.8 );
		negZAxisHelper.position.z = - 1;
		negZAxisHelper.scale.setScalar( 0.8 );

		axes.add( posXAxisHelper );
		axes.add( posYAxisHelper );
		axes.add( posZAxisHelper );
		axes.add( negXAxisHelper );
		axes.add( negYAxisHelper );
		axes.add( negZAxisHelper );

		A3H.camera = camera;
		A3H.controls = controls;
		A3H.renderer = renderer;
		A3H.scene = scene;

		renderer.clearDepth();
		renderer.setViewport( x, 0, dim, dim );
		renderer.render( this, camera );

		function getAxisMaterial ( color ) {

			return new THREE.MeshBasicMaterial( { color: color, toneMapped: false } );

		}

		function getSpriteMaterial ( color, text = null ) {

			const canvas = document.createElement( 'canvas' );
			canvas.width = 64;
			canvas.height = 64;

			const context = canvas.getContext( '2d' );
			context.beginPath();
			context.arc( 32, 32, 16, 0, 2 * Math.PI );
			context.closePath();
			context.fillStyle = color.getStyle();
			context.fill();

			if ( text !== null ) {

				context.font = '24px Arial';
				context.textAlign = 'center';
				context.fillStyle = '#000000';
				context.fillText( text, 32, 41 );

			}

			const texture = new THREE.CanvasTexture( canvas );

			return new THREE.SpriteMaterial( { map: texture, toneMapped: false } );

		}



	}


}
