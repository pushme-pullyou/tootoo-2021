// copyright 2021 Theo Armour. MIT license.
/* global THREE, THR, THRR, COR  */
// jshint esversion: 11
// jshint loopfunc: true


const HBJ = {};

HBJ.colors = {

	Wall: "teal",
	Floor: "brown",
	RoofCeiling: "red",
	AirBoundary: "blue",

	Aperture: "orange",
	Door: "orange",
	Shade: "yellow"

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

		if ( geometry.length ) { HBJ.pushMeshes( geometry, HBJ.colors[ type ] ); }
	}

	COR.reset( HBJ.meshes );

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
	roomFacesApertures.forEach( aper => HBJ.geometries.push( HBJ.addShape3d( aper, "Aperture" ) ) );

	roomFacesApertures?.flatMap( aperture => aperture.outdoor_shades ).filter( Boolean )
		.forEach( shade => HBJ.geometries.push( HBJ.addShape3d( shade, "Shade" ) ) );

	roomFacesApertures?.flatMap( aperture => aperture.indoor_shades ).filter( Boolean )
		.forEach( shade => HBJ.geometries.push( HBJ.addShape3d( shade, "Shade" ) ) );

};



HBJ.pushMeshes = function ( geometries, color ) {

	const bufferGeometry = THREE.BufferGeometryUtils.mergeBufferGeometries( geometries );
	const mesh = new THREE.Mesh( bufferGeometry, new THREE.MeshPhongMaterial( { color: color, side: 2, specular: 0xffffff, } ) );
	mesh.name = geometries.name;
	HBJ.meshes.push( mesh );

};




HBJ.addShape3d = function ( obj, type ) {

	const shapeGeometry = HBJ.getShape( obj.geometry.boundary );
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

	//console.log( "intersected", intersected );
	THRR.timeStart = performance.now();
	//scene.updateMatrixWorld();
	const mesh = intersected.object;
	//mesh.updateMatrix();
	//console.log( "mesh", mesh );

	const meshPosition = mesh.geometry.attributes.position;
	const face = intersected.face;
	const vertexA = new THREE.Vector3().fromBufferAttribute( meshPosition, face.a );
	//console.log( "vertex", vertexA );
	const vertexB = new THREE.Vector3().fromBufferAttribute( meshPosition, face.b );
	const vertexC = new THREE.Vector3().fromBufferAttribute( meshPosition, face.c );


	// THRR.geometryLine = new THREE.BufferGeometry().setFromPoints( [ vertexA, vertexB, vertexC] );
	// //geometry.setAttribute( 'position', new THREE.BufferAttribute( new Float32Array( 3 * 3 ), 3 ) );

	// THRR.materialLine = new THREE.LineBasicMaterial( { color: 0xffffff, transparent: true } );

	// THR.scene.remove( THRR.line );
	// THRR.line = new THREE.LineLoop( THRR.geometryLine, THRR.materialLine );
	// THR.scene.add( THRR.line );

	//mesh.children.forEach( ( mesh, index ) => {

	console.log( "mesh", mesh );
	//const faces = mesh.userData.geometry;

	let index = 0;
	let area = 0;
	let items;

	let geo = mesh.userData.geometry;

	if ( geo?.length ) {

		items = geo.map( geo => geo.userData );

	} else {

		items = mesh.geometry.userData.mergedUserData;

	}

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
				THR.group.remove( THRR.line );

				THRR.geometryLine = new THREE.BufferGeometry().setFromPoints( points );

				THRR.materialLine = new THREE.LineBasicMaterial( { color: "magenta", transparent: false } );

				THRR.line = new THREE.LineLoop( THRR.geometryLine, THRR.materialLine );
				THRR.line.name = "THR.linePopUp";

				THR.group.add( THRR.line );

				area = HBJ.getArea( points );

				console.log( "bingo!", i, boundary, "\n", vertexA, vertexB );
				index = i;

				break;

			}

		}

	}


	let item;

	//console.log( "ms:", ( performance.now() - THRR.timeStart ).toLocaleString() );

	if ( items[ index ] ) {

		item = items[ index ];
		console.log( "item", item );

		return `id: ${ index }<br>
type: ${ mesh.name }<br>
area: ${ item.area.toLocaleString() }<br>
name: ${ item.face.identifier }<br>
boundary: ${ item.face.boundary_condition?.type }<br>`;

	} else {

		return "Not found. Try again";
	}

};

