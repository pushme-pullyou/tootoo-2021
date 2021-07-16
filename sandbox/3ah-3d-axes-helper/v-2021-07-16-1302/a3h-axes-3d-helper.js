const A3H = {

};


A3H.init = function () {


	A3Haxes.style.cssText = "bottom: 1rem; position: absolute; right:1rem;";

	const axes = new THREE.Group();
	axes.animating = false;
	axes.controls = null;

	A3Haxes.addEventListener( 'mouseup', function ( event ) {
		console.log( "event", event );

		event.stopPropagation();

		axes.handleClick( event );


	} );


	THR.renderer.domElement.addEventListener( 'mouseup', function ( event ) {
		console.log( "event", event );

		//event.stopPropagation();

		axes.handleClick( event );


	} );


	A3Haxes.addEventListener( 'mousedown', function ( event ) {

		event.stopPropagation();

	} );

	const color1 = new THREE.Color( '#ff3653' );
	const color2 = new THREE.Color( '#8adb00' );
	const color3 = new THREE.Color( '#2c8fff' );

	const interactiveObjects = [];
	const raycaster = new THREE.Raycaster();
	const mouse = new THREE.Vector2();
	const dummy = new THREE.Object3D();

	axesCamera = new THREE.OrthographicCamera( - 2, 2, 2, - 2, 0, 4 );
	axesCamera.position.set( 0, 0, 2 );
	axesCamera.up.set( 0, 0, 1 );

	axesScene = new THREE.Scene();
	axesScene.background = new THREE.Color( 0xcce0ff );
	axesScene.add( axesCamera );

	axesRenderer = new THREE.WebGLRenderer( { antialias: true, alpha: false } );
	//axesRenderer.setPixelRatio( window.devicePixelRatio );
	axesRenderer.setSize( 200, 200 );

	A3Haxes.appendChild( axesRenderer.domElement );

	axesScene.add( axes );

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

	interactiveObjects.push( posXAxisHelper );
	interactiveObjects.push( posYAxisHelper );
	interactiveObjects.push( posZAxisHelper );
	interactiveObjects.push( negXAxisHelper );
	interactiveObjects.push( negYAxisHelper );
	interactiveObjects.push( negZAxisHelper );

	const point = new THREE.Vector3();
	const dim = 200;
	const turnRate = 2 * Math.PI; // turn rate in angles per second



	axes.render = function () {

		axes.quaternion.copy( THR.camera.quaternion ).invert();
		axes.updateMatrixWorld();

		point.set( 0, 0, 1 );
		point.applyQuaternion( THR.camera.quaternion );

		console.log( "point", point );

		if ( point.x >= 0 ) {

			posXAxisHelper.material.opacity = 1;
			negXAxisHelper.material.opacity = 0.5;

		} else {

			posXAxisHelper.material.opacity = 0.5;
			negXAxisHelper.material.opacity = 1;

		}

		if ( point.y >= 0 ) {

			posYAxisHelper.material.opacity = 1;
			negYAxisHelper.material.opacity = 0.5;

		} else {

			posYAxisHelper.material.opacity = 0.5;
			negYAxisHelper.material.opacity = 1;

		}

		if ( point.z >= 0 ) {

			posZAxisHelper.material.opacity = 1;
			negZAxisHelper.material.opacity = 0.5;

		} else {

			posZAxisHelper.material.opacity = 0.5;
			negZAxisHelper.material.opacity = 1;

		}

			//
		//const x = A3Haxes.offsetWidth - dim;

		//axesRenderer.clearDepth();
		//axesRenderer.setViewport( x, 0, dim, dim );
		// axesRenderer.render( axes, camera );
		axesRenderer.render( axesScene, axesCamera );

	};

	const targetPosition = new THREE.Vector3();
	const targetQuaternion = new THREE.Quaternion();

	const q1 = new THREE.Quaternion();
	const q2 = new THREE.Quaternion();
	let radius = 0;


	axes.handleClick = function ( event ) {

		//if ( axes.animating === true ) return false;

		const rect = A3Haxes.getBoundingClientRect();
		//console.log( "rect", rect );
		const offsetX = rect.left + ( A3Haxes.offsetWidth - dim );
		const offsetY = rect.top + ( A3Haxes.offsetHeight - dim );
		console.log( "offsetX", offsetX );
		console.log( "event.clientX", event.clientX );
		mouse.x = ( ( event.clientX - offsetX ) / ( rect.width ) ) * 2 - 1 ;
		mouse.y = - ( ( event.clientY - offsetY ) / ( rect.bottom - offsetY ) ) * 2 + 1;
		console.log( "mouse", mouse.x, mouse.y );

		raycaster.setFromCamera( mouse, axesCamera );

		const intersects = raycaster.intersectObjects( interactiveObjects );

		console.log( "intersects", intersects );

		//update( 0.1 );

		axes.render();

		if ( intersects.length > 0 ) {

			const intersection = intersects[ 0 ];
			const object = intersection.object;

			console.log( "object", object.userData.type );

			//prepareAnimationData( object, THR.controls.target );

			axes.animating = true;

			return true;

		} else {

			return false;

		}


	};


	function update( delta ) {

		const step = delta * turnRate;
		const focusPoint = THR.controls.target;

		// animate position by doing a slerp and then scaling the position on the unit sphere

		q1.rotateTowards( q2, step );
		THR.camera.position.set( 0, 0, 1 ).applyQuaternion( q1 ).multiplyScalar( radius ).add( focusPoint );

		// animate orientation


		THR.camera.quaternion.rotateTowards( targetQuaternion, step );

		if ( q1.angleTo( q2 ) === 0 ) {

			axes.animating = false;

		}



	};

	function prepareAnimationData ( object, focusPoint ) {

		switch ( object.userData.type ) {

			case 'posX':
				targetPosition.set( 1, 0, 0 );
				targetQuaternion.setFromEuler( new THREE.Euler( 0, Math.PI * 0.5, 0 ) );
				break;

			case 'posY':
				targetPosition.set( 0, 1, 0 );
				targetQuaternion.setFromEuler( new THREE.Euler( - Math.PI * 0.5, 0, 0 ) );
				break;

			case 'posZ':
				targetPosition.set( 0, 0, 1 );
				targetQuaternion.setFromEuler( new THREE.Euler() );
				break;

			case 'negX':
				targetPosition.set( - 1, 0, 0 );
				targetQuaternion.setFromEuler( new THREE.Euler( 0, - Math.PI * 0.5, 0 ) );
				break;

			case 'negY':
				targetPosition.set( 0, - 1, 0 );
				targetQuaternion.setFromEuler( new THREE.Euler( Math.PI * 0.5, 0, 0 ) );
				break;

			case 'negZ':
				targetPosition.set( 0, 0, - 1 );
				targetQuaternion.setFromEuler( new THREE.Euler( 0, Math.PI, 0 ) );
				break;

			default:
				console.error( 'ViewHelper: Invalid axis.' );

		}

		//

		radius = THR.camera.position.distanceTo( focusPoint );
		targetPosition.multiplyScalar( radius ).add( focusPoint );

		dummy.position.copy( focusPoint );

		dummy.lookAt( THR.camera.position );
		q1.copy( dummy.quaternion );

		dummy.lookAt( targetPosition );
		q2.copy( dummy.quaternion );

	}

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


	axes.render( axesRenderer );
}
