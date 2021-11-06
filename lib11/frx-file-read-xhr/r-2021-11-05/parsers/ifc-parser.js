// copyright 2021 Theo Armour. MIT license.
/* global THREE, COR */
// jshint esversion: 6
// jshint loopfunc: true


var v = function ( x, y, z ) { return new THREE.Vector3( x, y, z ); };

IFC.parse = function ( content ) {

	//console.log( "", event.target.result );

	//console.log( "content", content );

	// divMainContent.innerHTML =
	// 	`<iframe src="${ decodeURI( FRX.url ) }" height=${ window.innerHeight } style="border:none;width:100%;" ></iframe>`;

	// 	divMainContent.innerHTML = `
	// <div style="border:0px solid red; margin: 0 auto; padding: 0 1rem; max-width: 40rem;" >
	// ${ decodeURI( FRX.url ) }
	// </div>`;


	// IFC.project = new THREE.Object3D();
	// scene.add( IFC.project );

	IFC.terms = {};
	IFC.termsProject = [ // just some guesses
		"IFCAPPLICATION", "IFCBOOLEANRESULT",
		"IFCBUILDING",
		"IFCCARTESIANTRANSFORMATIONOPERATOR3D", "IFCCLASSIFICATION",
		"IFCCONVERSIONBASEDUNIT",
		"IFCDIMENSIONALEXPONENTS",
		"IFCGEOMETRICREPRESENTATIONCONTEXT",
		"IFCMATERIALLIST", "IFCMEASUREWITHUNIT",
		"IFCOWNERHISTORY",
		"IFCPERSON", "IFCPERSONANDORGANIZATION", "IFCPOSTALADDRESS", "IFCPROJECT",
		"IFCRELAGGREGATES", "IFCRELCONTAINEDINSPATIALSTRUCTURE",
		"IFCSITE",
		"IFCUNITASSIGNMENT"
	];

	IFC.hashes = {};

	IFC.lines = content.split( /\r\n|\n/ ).map( line => line.replace( / /g, "" ) );

	//console.log( lines[ 8 ] );
	//console.log( IFC.lines.length );

	for ( var i = 0; i < IFC.lines.length; i++ ) {

		const line = IFC.lines[ i ];

		if ( !line.includes( '=IFC' ) ) { continue; }

		const term = line.slice( line.indexOf( '=IFC' ) + 2, line.indexOf( '(' ) );

		//console.log( "term", term );


		if ( !IFC.terms[ term ] ) {

			IFC.terms[ term ] = { "term": term, "stats": 0, "lines": [] };

		}

		IFC.terms[ term ].stats++;
		IFC.terms[ term ].lines.push( i );

		hash = line.slice( 0, line.indexOf( '=' ) );
		//hash = hash.replace( / /g, '' );
		IFC.hashes[ hash ] = { "hash": hash, "line": i };

	}

	IFC.termKeys = Object.keys( IFC.terms );

	console.log( "IFC.termKeys", IFC.termKeys );

	getMetaData();

	getPolygons();

};



function getMetaData () {

	IFC.projectText = '';

	for ( var i = 0; i < IFC.termKeys.length; i++ ) {

		term = IFC.terms[ IFC.termKeys[ i ] ];

		if ( IFC.termsProject.includes( term.term ) ) {

			line = IFC.lines[ term.lines[ 0 ] ];

			IFC.projectText +=

				term.term +
				line.slice( line.indexOf( '(' ) + 1, line.lastIndexOf( ')' ) );

		}

	}

	console.log( "IFC.projectText", IFC.projectText );
	//menuProjectInfo.innerHTML = IFC.projectText;

}



function getPolygons () {

	var line, hashes, hash;

	IFC.polyloops = {};
	IFC.polylines = {};
	IFC.coordinates = {};

	for ( var i = 0; i < IFC.lines.length; i++ ) {

		line = IFC.lines[ i ];

		term = line.slice( line.indexOf( '= IFC' ) + 2, line.indexOf( '(' ) );

		if ( term === 'IFCSLAB' ) {

			IFC.classes.IFCSLAB( i );

		} else if ( line.includes( 'IFCWALLTYPE' ) && fileName === 'Wall.IFC' ) {

			IFC.classes.IFCWALLTYPE( i );


		} else if ( line.includes( 'IFCPOLYLOOP' ) ) {

			hashes = line.slice( line.indexOf( '(' ) + 2, line.lastIndexOf( ')' ) - 2 );
			hashes = hashes.replace( / /g, '' ).split( ',' );

			IFC.polyloops[ i ] = { "line": i, "hashes": hashes };

		} else if ( line.includes( 'IFCPOLYLINE' ) ) {

			//console.log( 'line', line  );

			hashes = line.slice( line.lastIndexOf( '(' ) + 1, line.indexOf( ')' ) );
			hashes = hashes.replace( / /g, '' ).split( ',' );

			IFC.polylines[ i ] = { "line": i, "hashes": hashes };

		} else if ( line.includes( 'IFCCARTESIANPOINT' ) ) {

			hash = line.slice( 0, line.indexOf( '=' ) );
			hash = hash.replace( / /g, '' );
			coords = line.slice( line.indexOf( '(' ) + 2, line.lastIndexOf( ')' ) - 2 );
			coords = coords.replace( / /g, '' ).split( ',' ).map( parseFloat );
			IFC.coordinates[ hash ] = {
				"line": i, "hash": hash,
				"coordinates": coords
			};

		}

	}

	drawPolyloops();
	drawPolylines();

}


function drawPolyloops () {

	var polyloops, polyloop, pts;
	var geometry, material, line;

	polyloops = Object.keys( IFC.polyloops );

	for ( var i = 0; i < polyloops.length; i++ ) {

		polyloop = IFC.polyloops[ polyloops[ i ] ];
		pts = [];

		for ( var j = 0; j < polyloop.hashes.length - 1; j++ ) {

			pt = IFC.coordinates[ polyloop.hashes[ j ] ].coordinates;
			pts.push( v( pt[ 0 ], pt[ 2 ], pt[ 1 ] ) );

		}

		const geometry = new THREE.BufferGeometry().setFromPoints( pts );
		material = new THREE.LineBasicMaterial( { color: 0x000000 } );
		line = new THREE.Line( geometry, material );
		line.scale.set( 0.01, 0.01, 0.01 );
		THR.scene.add( line );

	}

}

function drawPolylines () {

	var polylines, polyline, pts;
	var geometry, material, line;
	var v = function ( x, y, z ) { return new THREE.Vector3( x, y, z ); };

	polylines = Object.keys( IFC.polylines );

	for ( var i = 0; i < polylines.length; i++ ) {

		polyline = IFC.polylines[ polylines[ i ] ];
		pts = [];

		for ( var j = 0; j < polyline.hashes.length; j++ ) {

			pt = IFC.coordinates[ polyline.hashes[ j ] ].coordinates;
			pts.push( v( pt[ 0 ], 0, pt[ 1 ] ) );

		}

		const geometry = new THREE.BufferGeometry().setFromPoints( pts );
		material = new THREE.LineBasicMaterial( { color: 0x000000 } );
		line = new THREE.Line( geometry, material );
		line.scale.set( 0.01, 0.01, 0.01 );
		THR.scene.add( line );

	}

}

