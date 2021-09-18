// copyright 2021 Theo Armour. MIT license.
/* global HBJ, THREE, THR, THRR, COR, FRX  */
// jshint esversion: 11
// jshint loopfunc: true


HBJ.colors = {

	AirBoundary: "blue",
	Aperture: "orange",
	Door: "orange",
	Floor: "brown",
	RoofCeiling: "maroon",
	Shade: "yellow",
	Wall: "teal",

};


HBJ.Face3DTypes = [ "AirBoundary", "Aperture", "Door", "Floor", "RoofCeiling", "Shade", "Wall" ];



HBJ.parse = function ( json ) {

	HBJ.json = json;
	console.log( "HBJ.json", HBJ.json );

	HBJ.meshes = [];
	HBJ.geometries = [];

	HBJ.processOrphanShades();

	HBJ.processRooms();

	for ( let type of HBJ.Face3DTypes ) {

		const geometry = HBJ.geometries.filter( geo => geo.name === type );

		if ( geometry.length ) {

			HBJ.pushMeshes( geometry, HBJ.colors[ type ], type );

		}
	}

	if ( HBJ.meshes.length ) {

		COR.reset( HBJ.meshes );

	} else {

		alert( `${ FRX.filName }: has no visible geometry ` );
	}


	THRR.getHtm = HBJ.getHtm;  // Set up raycasting

	HBJ.init();

};



HBJ.init = function () {

	htm = `
<details id=HBJdet open >
<summary class="summary-primary gmd-1" title="Open files on your device: ">Honeybee JSON Models </summary>

<p>
<button onclick=HBJ.getSensorGrids() >get sensor grids</button>
</p>


</details>`;

whatever.innerHTML = htm;

}


HBJ.getSensorGrids = function () {

	console.log( "grids", HBJ.json.properties.radiance.sensor_grids );

	grids = HBJ.json.properties.radiance.sensor_grids;
	for ( item of grids ) {

		for ( sensor of item.sensors ) {

			console.log( "position", sensor.pos );

			p = sensor.pos

			const geometry = new THREE.BoxGeometry( 0.1, 0.1,0.1);
			const material = new THREE.MeshNormalMaterial();
			const mesh = new THREE.Mesh( geometry, material );
			mesh.position.set( p[ 0 ], p[ 1 ], p[ 2 ])
			THR.scene.add( mesh );

		}




	}

};



HBJ.processOrphanShades = function () {

	HBJ.orphans = [ "orphaned_apertures", "orphaned_doors", "orphaned_faces", "orphaned_shades" ]
		.filter( orphan => HBJ.json[ orphan ] && HBJ.json[ orphan ].length > 0 )
		.forEach( orphan => {
			HBJ.json[ orphan ].forEach( shade => HBJ.geometries.push( HBJ.addShape3d( shade, "Shade" ) ) );
		} );

};



HBJ.processRooms = function () {

	const roomFaces = HBJ.json.rooms?.flatMap( room => room.faces ) || [];
	roomFaces.forEach( face => HBJ.geometries.push( HBJ.addShape3d( face, face.face_type ) ) );

	roomFaces.flatMap( face => face.outdoor_shades ).filter( Boolean )
		.forEach( shade => HBJ.geometries.push( HBJ.addShape3d( shade, "Shade" ) ) );

	roomFaces.flatMap( face => face.indoor_shades ).filter( Boolean )
		.forEach( shade => HBJ.geometries.push( HBJ.addShape3d( shade, "Shade" ) ) );

	const roomFacesApertures = HBJ.json.rooms?.flatMap( room => room.faces.flatMap( face =>
		face.apertures ).filter( Boolean ) ) || [];
	roomFacesApertures.forEach( aper => HBJ.geometries.push( HBJ.addShape3d( aper, "Aperture", true ) ) );

	roomFacesApertures?.flatMap( aperture => aperture.outdoor_shades ).filter( Boolean )
		.forEach( shade => HBJ.geometries.push( HBJ.addShape3d( shade, "Shade" ) ) );

	roomFacesApertures?.flatMap( aperture => aperture.indoor_shades ).filter( Boolean )
		.forEach( shade => HBJ.geometries.push( HBJ.addShape3d( shade, "Shade" ) ) );

};



HBJ.pushMeshes = function ( geometries, color, name ) {

	const bufferGeometry = THREE.BufferGeometryUtils.mergeBufferGeometries( geometries );
	const mesh = new THREE.Mesh( bufferGeometry, new THREE.MeshPhongMaterial( { color: color, side: 2, specular: 0xffffff, transparent: true } ) );
	mesh.name = name;
	HBJ.meshes.push( mesh );

};




HBJ.addShape3d = function ( obj, type, offset ) {

	const shapeGeometry = HBJ.getShape( obj.geometry.boundary, offset );
	shapeGeometry.userData.face = obj;
	shapeGeometry.name = type;

	return shapeGeometry;

};



HBJ.getShape = function ( points, offset ) {

	const vertices = points.map( pts => new THREE.Vector3().fromArray( pts ) );
	const geometry = new THREE.BufferGeometry().setFromPoints( vertices );

	geometry.computeVertexNormals();

	const normal = new THREE.Vector3().fromBufferAttribute( geometry.attributes.normal, 0 );

	const normalZ = new THREE.Vector3( 0, 0, 1 ); // base normal of xy-plane

	const quaternion = new THREE.Quaternion().setFromUnitVectors( normal, normalZ );

	const vertices2D = vertices.slice().map( v => v.applyQuaternion( quaternion ) );

	const area = HBJ.getArea( vertices2D );
	//console.log( "are", area );

	if ( area < 0 ) {  // a < 0: vertices are clockwise, need CCW

		vertices2D.reverse();
		//console.log( "reversed", HBJ.getArea( vertices2D ) );
	}

	const shape = new THREE.Shape( vertices2D );
	const shapeGeometry = new THREE.ShapeGeometry( shape );
	shapeGeometry.attributes.position = geometry.attributes.position;
	shapeGeometry.userData.area = area;

	if ( offset ) {

		const trans = normal.multiplyScalar( 0.1 );
		shapeGeometry.translate( trans.x, trans.y, trans.z );

	}

	return shapeGeometry;

};



HBJ.getArea = function ( contour ) {

	const n = contour.length;
	let a = 0.0;

	for ( let p = n - 1, q = 0; q < n; p = q++ ) {

		a += contour[ p ].x * contour[ q ].y - contour[ q ].x * contour[ p ].y;

	}

	return a * 0.5;

};



HBJ.getHtm = function ( intersected ) {

	console.log( "intersected", intersected );
	//THRR.timeStart = performance.now();
	//scene.updateMatrixWorld();
	const mesh = intersected.object;
	//console.log( "mesh", mesh );

	const meshPosition = mesh.geometry.attributes.position;
	const face = intersected.face;
	const vertexA = new THREE.Vector3().fromBufferAttribute( meshPosition, face.a );
	const vertexB = new THREE.Vector3().fromBufferAttribute( meshPosition, face.b );
	const vertexC = new THREE.Vector3().fromBufferAttribute( meshPosition, face.c );

	let index = 0;
	let items = mesh.geometry.userData.mergedUserData;


	//console.log( "items", items );

	for ( let i = 0; i < items.length; i++ ) {

		const item = items[ i ];
		//console.log( "item", item );

		const boundary = item.face.geometry.boundary;
		//console.log( "boundary", boundary );

		for ( let j = 0; j < boundary.length; j++ ) {

			const joined = boundary.map( point => point[ 0 ].toFixed( 4 ) );

			if ( joined.includes( vertexA.x.toFixed( 4 ) ) &&
				joined.includes( vertexB.x.toFixed( 4 ) ) &&
				joined.includes( vertexC.x.toFixed( 4 ) )

			) {

				const points = boundary.map( item => new THREE.Vector3().fromArray( item ) );

				THRR.line.geometry.dispose();
				mesh.remove( THRR.line );

				THRR.geometryLine = new THREE.BufferGeometry().setFromPoints( points );

				THRR.materialLine = new THREE.LineBasicMaterial( { color: "magenta", transparent: false } );

				THRR.line = new THREE.LineLoop( THRR.geometryLine, THRR.materialLine );
				THRR.line.name = "THR.linePopUp";

				mesh.add( THRR.line );

				//area = HBJ.getArea( points );
				//console.log( "bingo!", i, boundary, "\n", vertexA, vertexB );
				index = i;

				break;

			}

		}

	}


	let item;
	//console.log( "ms:", ( performance.now() - THRR.timeStart ).toLocaleString() );

	if ( items[ index ] ) {

		item = items[ index ];
		//console.log( "item", item );

		return `id: ${ index }<br>
type: ${ item.face.face_type || "Shade"}<br>
area: ${ item.area.toLocaleString() }<br>
identifier: <button onclick=HBJ.findName(this.innerText)>${ item.face.identifier }</button><br>
boundary: ${ item.face.boundary_condition?.type }<br>`;

	} else {

		return "Not found. Try again";
	}

};




HBJ.findName = function ( string ) {

	JTVdet.open = true;

	setTimeout( () => { JTIdet.open = true; }, 500 );

	setTimeout( () => {

		JTFinpSearch.value = string;

		var event = new Event( 'input', {
			bubbles: true,
			cancelable: true,
		} );

		JTFinpSearch.dispatchEvent( event );

		JTVdet.scrollIntoView();

	}, 300 );














}