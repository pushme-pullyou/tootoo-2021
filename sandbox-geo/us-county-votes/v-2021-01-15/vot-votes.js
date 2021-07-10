
const VOT = {};

const material = new THREE.MeshNormalMaterial( { side: 2 } );

function lat2y ( a ) { return 180 / Math.PI * Math.log( Math.tan( Math.PI / 4 + a * ( Math.PI / 180 ) / 2 ) ); }

VOT.requestFile = function ( url, callback ) {

	const xhr = new XMLHttpRequest();
	xhr.open( 'GET', url, true );
	xhr.onerror = ( xhr ) => console.log( 'error:', xhr );
	//xhr.onprogress = ( xhr ) => console.log( 'bytes loaded:', xhr.loaded );
	xhr.onload = ( xhr ) => callback( xhr.target.response );
	xhr.send( null );

};



VOT.getVotes = function ( string ) {
	//const startTime = performance.now();

	VOT.votesAll = string.split( /\n/ ).map( line => line.split( /,/ ) ).slice( 1, -1 );
	//console.log( "votesAll", votesAll );

	//console.log( "ms", performance.now() - startTime );
	VOT.drawVotes();

};



VOT.drawVotes = function () {

	const v2 = ( x, y ) => new THREE.Vector2( x, y );

	scene.remove( group, VOT.flipSticks );

	group = new THREE.Group;

	const geometriesDem = [];
	const geometriesRep = [];
	const geometriesOther = [];

	VOT.indexDem = [];
	VOT.indexRep = [];
	VOT.indexOther = [];

	VOT.votesYear = VOT.votesAll.filter( vote => vote[ 0 ] === selYear.value );
	//console.log( "VOT.votesYear", VOT.votesAll[ 1 ][ 0 ], selYear.value, VOT.votesYear );

	VOT.votesYear.forEach( countyVote => {

		const fip = UFR.fips.find( fip => countyVote[ 1 ] === fip[ 0 ].slice( -5 ) );

		if ( fip ) {
			//console.log( "countyVote", countyVote);

			VOT.getSymbol( countyVote[ 7 ], countyVote[ 4 ], fip, 0x0015BC, "democrat" );

			//geometriesDem.push( geometry );
			VOT.indexDem.push( countyVote );

			VOT.getSymbol( countyVote[ 7 ], countyVote[ 5 ], fip, 0xDE0100, "republican" );

			VOT.indexRep.push( countyVote );

			if ( countyVote[ 6 ] > 0 ) {

				VOT.getSymbol( countyVote[ 7 ], countyVote[ 6 ], fip, 0x008080, "other" );

			}
			VOT.indexOther.push( countyVote );

			// const voteRep = Math.log( 1 + 0.0002 * countyVote[ 5 ] ) || 0;
			// const pointsRep = [ v2( 0, 0 ), v2( 0.1 * total, voteRep ), v2( 0, voteRep - 0.03 ) ];
			// const geometryRep = new THREE.LatheBufferGeometry( pointsRep, 7 );
			// const vertexRep = GJS.latLonToXYZ( 50, + fip[ 3 ], + fip[ 4 ] );
			// geometryRep.rotateX( 0.5 * Math.PI );
			// geometryRep.lookAt( vertexRep );
			// geometryRep.translate( vertexRep.x, vertexRep.y, vertexRep.z );

			// geometriesRep.push( geometryRep );
			// VOT.indexRep.push( countyVote );

			// const voteOther = Math.log( 1 + 0.0002 * countyVote[ 6 ] ) || 0;

			// if ( countyVote[ 6 ] > 0 ) {

			// 	const pointsOther = [ v2( 0, 0 ), v2( 0.1 * total, voteOther ), v2( 0, voteOther - 0.03 ) ];
			// 	const geometryOther = new THREE.LatheBufferGeometry( pointsOther, 7 );
			// 	const vertexOther = GJS.latLonToXYZ( 50, + fip[ 3 ], + fip[ 4 ] );
			// 	geometryOther.rotateX( 0.5 * Math.PI );
			// 	geometryOther.lookAt( vertexOther );
			// 	geometryOther.translate( vertexOther.x, vertexOther.y, vertexOther.z );

			// 	geometriesOther.push( geometryOther );
			// }
			// VOT.indexOther.push( countyVote );

		}

	} );

	// const bufferGeometry = THREE.BufferGeometryUtils.mergeBufferGeometries( geometriesDem );
	// const materialDem = new THREE.MeshPhongMaterial( { color: 0x0015BC } );
	// const mesh = new THREE.Mesh( bufferGeometry, materialDem );
	// mesh.name = "democrat";

	//mesh.scale.set( 1000000, 1000000, 1000000 )
	//mesh.receiveShadow = true;
	//mesh.castShadow = true;
	//group.add( mesh );

	// const bufferGeometryRep = THREE.BufferGeometryUtils.mergeBufferGeometries( geometriesRep );
	// const materialRep = new THREE.MeshPhongMaterial( { color: 0xDE0100 } );
	// const meshRep = new THREE.Mesh( bufferGeometryRep, materialRep );
	// meshRep.name = "republican";
	// //meshRep.receiveShadow = true;
	// //meshRep.castShadow = true;
	// group.add( meshRep );

	// if ( geometriesOther.length ) {

	// 	const bufferGeometryOther = THREE.BufferGeometryUtils.mergeBufferGeometries( geometriesOther );
	// 	const materialOther = new THREE.MeshPhongMaterial( { color: 0x008080 } );
	// 	const meshOther = new THREE.Mesh( bufferGeometryOther, materialOther );
	// 	meshOther.name = "other";
	// 	//meshOther.receiveShadow = true;
	// 	//meshOther.castShadow = true;
	// 	group.add( meshOther );
	// }

	//RAY.intersectObjects = group.children;

	//const bytes = THREE.BufferGeometryUtils.estimateBytesUsed( bufferGeometry );
	//console.log( "bytes", bytes );

	scene.add( group );

	//console.log( "init2", performance.now() - THR.timeStart );

	RAY.intersectObjects = group.children;

	VOT.setStatsVote();

};


VOT.getSymbol = function ( voteTotal, voteParty, fip, color, name ) {

	const v2 = ( x, y ) => new THREE.Vector2( x, y );

	const total = Math.log( 1 + 0.0001 * voteTotal ) || 0;

	const votes = Math.log( 1 + 0.0002 * voteParty ) || 0;
	const points = [ v2( 0, 0 ), v2( 0.05 * total, votes ), v2( 0, votes - 0.03 ) ];
	const geometry = new THREE.LatheBufferGeometry( points, 7 );
	//const vertexDem = GJS.latLonToXYZ( 50, + fip[ 3 ], + fip[ 4 ] );
	geometry.rotateX( - 0.5 * Math.PI );
	geometry.translate( 0, 0, -0.5 * votes );
	geometry.scale( modelScale, modelScale, modelScale );

	const material = new THREE.MeshPhongMaterial( { color: color, side: 2 } );
	//const materialDem = new THREE.MeshNormalMaterial( { side: 2 } );
	const mesh = new THREE.Mesh( geometry, material );
	mesh.position.set( modelScale * fip[ 4 ], 0, modelScale * lat2y( fip[ 3 ] ) );
	mesh.lookAt( new THREE.Vector3( modelScale * -96, -5000000, modelScale * 38 ) );
	mesh.name = name;
	group.add( mesh );
}


VOT.setStatsVote = function () {

	VOT.flipSticks = new THREE.Group();

	const flipsDem = [];
	const flipsRep = [];
	const fipsCounted = [];
	const yearPrevious = ( -4 + ( + selYear.value ) );

	if ( yearPrevious > 1996 ) {

		const votesYearPrev = VOT.votesAll.filter( vote => ( + vote[ 0 ] ) === yearPrevious );
		//console.log( "votesYearPrev", votesYearPrev );

		VOT.votesYear.forEach( voteYear => {

			const fip = voteYear[ 1 ];

			if ( !fipsCounted.includes( fip ) ) {

				fipsCounted.push( fip );

				const vote = VOT.votesYear.find( vote => vote[ 1 ] === fip );
				//console.log( "vote", vote );

				const v1 = ( + vote[ 4 ] ) > ( + vote[ 5 ] );
				//console.log( "v1", v1 );

				const votePrev = votesYearPrev.find( vote => vote[ 1 ] === fip );
				//console.log( "votePrev", votePrev, fip );

				if ( votePrev ) {

					const v2 = ( + votePrev[ 4 ] ) > ( + votePrev[ 5 ] );
					//console.log( "v2", v2 );

					if ( v1 && !v2 ) {

						flipsDem.push( fip );
					}

					if ( !v1 && v2 ) {

						flipsRep.push( fip );
					}

				}
			}

		} );

		//console.log( "flipsDem", flipsDem );
		const geometry = new THREE.SphereBufferGeometry( 1 );
		let material = new THREE.MeshStandardMaterial( { color: 0x00aaff, emissive: 0x444444 } );

		flipsDem.forEach( fip => {

			const fipRec = UFR.fips.find( fipX => fip === fipX[ 0 ] ); //.slice( -5 ) );
			//console.log( "fipRec", fip, fipRec, );

			if ( fipRec ) {

				const vote = VOT.indexDem.find( item => fip === item[ 1 ] );
				//console.log( "vote", vote[ 9 ] );
				const total = vote[ 7 ];

				delta = Math.log( 1 + 0.0002 * total ) || 0;
				scl = 0.05 * Math.log( 1 + 0.0002 * total ) || 0;

				const mesh = new THREE.Mesh( geometry, material );
				const vert = GJS.latLonToXYZ( 50 + 1 * delta, + fipRec[ 3 ], + fipRec[ 4 ] );
				mesh.lookAt( vert );
				mesh.position.copy( vert );
				mesh.scale.set( scl, scl, 10 * scl );

				VOT.flipSticks.add( mesh );

			}

		} );


		material = new THREE.MeshStandardMaterial( { color: 0xDE0100, emissive: 0x888888 } );

		flipsRep.forEach( fip => {

			const fipRec = UFR.fips.find( fipX => fip === fipX[ 0 ] ); //.slice( -5 ) );
			//console.log( "fipRec", fip, fipRec, );

			if ( fipRec ) {

				const vote = VOT.indexRep.find( item => fip === item[ 1 ] );
				//console.log( "vote", vote[ 9 ] );
				const total = vote[ 7 ];

				delta = Math.log( 1 + 0.0002 * total ) || 0;
				scl = 0.05 * Math.log( 1 + 0.0002 * total ) || 0;

				const mesh = new THREE.Mesh( geometry, material );
				const vert = GJS.latLonToXYZ( 50 + 1 * delta, + fipRec[ 3 ], + fipRec[ 4 ] );
				mesh.lookAt( vert );
				mesh.position.copy( vert );
				mesh.scale.set( scl, scl, 10 * scl );
				VOT.flipSticks.add( mesh );

			}

		} );

		scene.add( VOT.flipSticks );
		//console.log( "flips", flips );

	} else {

		alert( "No data for previous year" );
	}

	const votes = VOT.indexDem.reduce( ( total, num ) => total + ( + num[ 7 ] ), 0 );
	const dems = VOT.indexDem.reduce( ( total, num ) => total + ( + num[ 4 ] ), 0 );
	const reps = VOT.indexRep.reduce( ( total, num ) => total + ( + num[ 5 ] ), 0 );
	const other = VOT.indexOther.reduce( ( total, num ) => total + ( + num[ 6 ] ), 0 );


	const demWin = VOT.indexDem.filter( ( vote, index ) => vote[ 4 ] > vote[ 5 ] );
	const repWin = VOT.indexRep.filter( ( vote, index ) => vote[ 5 ] > vote[ 4 ] );

	const htm = `
<span title="Federal Information Processing Standard" >FIPS code</span>: ${ UFR.fips.length.toLocaleString() }<br>
Counties: ${ VOT.indexDem.length.toLocaleString() }<br>
Votes: ${ votes.toLocaleString() }<br>
Democrats: ${ dems.toLocaleString() }<br>
Dem Win: ${ demWin.length.toLocaleString() }<br>
Republicans: ${ reps.toLocaleString() }<br>
Rep Win: ${ repWin.length.toLocaleString() }<br>
Other: ${ other.toLocaleString() }<br>
FlipDems: ${ flipsDem.length }<br>
FlipReps: ${ flipsRep.length }<br>
`;

	divMessage.innerHTML = htm;

	//console.log( "setStatsVotes", performance.now() - THR.timeStart );

};