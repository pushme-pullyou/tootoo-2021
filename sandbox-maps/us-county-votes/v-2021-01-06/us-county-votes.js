// copyright 2021 Theo Armour. MIT license.


function init () {

	const source = "https://github.com/theo-armour/2021/tree/main/sandbox/us-county-votes/";

	const version = document.head.querySelector( "[ name=date ]" ).content;

	const description = document.head.querySelector( "[ name=description ]" ).content;

	MNU.path = location.protocol === "https:" || !window.top ? "https://theo-armour.github.io/2021/" : "../../../";
	MNU.init();

	spnTitle.innerHTML = "US County Presidents Vote";

	spnVersion.innerHTML = version;

	divDescription.innerHTML = description;

	MNUdivPopUp.innerHTML = `
<div>
	<p>
		When you touch a stick,<br>its details will appear here
	</p>
	<p>
		Cyan spikes = county flipped Democratic<br>
		Pink spikes = county flipped Republican
	</p>
	<p>
		1|2|3 fingers to rotate|zoom|pan
	</p>
</div>`;

	aGithub.href = source;



	legendText = `
<div>
	US Presidential Elections
	2000-2016
	<div style=background-color:#0015BC;color:white;>Blue = Democrat</div>
	<div style=background-color:#DE0100;color:white;>Red = Republican</div>
	<div style=background-color:#008080;color:white;>Teal = Other</div>
	Taller sticks = more votes<br>
	Wider sticks = more voters<br>
	<div style=background-color:#88eeee;color:white;>Cyan spikes = counties flipped to Democrats</div>
	<div style=background-color:#eeaaaa;color:white;>Pink spikes = counties flipped to Republicans</div>
	<div>No 2020 3rd party data</div>
	Vertical data scales are exponential<br>
</div>`;

	THR.init();

	THR.camera.position.set( - 20, - 65, 50 );

	THR.addLights();

	THR.group = THR.getGroupNew();

	THR.animate();

	RAY.init();

	GJS.initGeoJson(); // gjs-geojson.js

	const urlGeoJson = MNU.path + "lib/assets/geojson/cb_2019_us_county_20m.geojson";

	GJS.requestFile( urlGeoJson, GJS.onLoadGeoJson );

	VOT.requestFile( "../us-county-votes.csv", VOT.getVotes );

	GLO.initGlobeWithBitmap();

	UFR.init(); // ufr-usa-fips-remix.js

	HRT.init();

	//console.log( "init", performance.now() - THR.timeStart );

};


const VOT = {};

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

	scene.remove( UFR.counties, VOT.flipSticks );

	UFR.counties = new THREE.Group;

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

			const total = Math.log( 1 + 0.0001 * countyVote[ 7 ] ) || 0;

			const voteDem = Math.log( 1 + 0.0002 * countyVote[ 4 ] ) || 0;
			const pointsDem = [ v2( 0, 0 ), v2( 0.1 * total, voteDem ), v2( 0, voteDem - 0.03 ) ];
			const geometryDem = new THREE.LatheBufferGeometry( pointsDem, 7 );
			const vertexDem = GJS.latLonToXYZ( 50, + fip[ 3 ], + fip[ 4 ] );
			geometryDem.rotateX( 0.5 * Math.PI );
			geometryDem.lookAt( vertexDem );
			geometryDem.translate( vertexDem.x, vertexDem.y, vertexDem.z );

			geometriesDem.push( geometryDem );
			VOT.indexDem.push( countyVote );


			const voteRep = Math.log( 1 + 0.0002 * countyVote[ 5 ] ) || 0;
			const pointsRep = [ v2( 0, 0 ), v2( 0.1 * total, voteRep ), v2( 0, voteRep - 0.03 ) ];
			const geometryRep = new THREE.LatheBufferGeometry( pointsRep, 7 );
			const vertexRep = GJS.latLonToXYZ( 50, + fip[ 3 ], + fip[ 4 ] );
			geometryRep.rotateX( 0.5 * Math.PI );
			geometryRep.lookAt( vertexRep );
			geometryRep.translate( vertexRep.x, vertexRep.y, vertexRep.z );

			geometriesRep.push( geometryRep );
			VOT.indexRep.push( countyVote );

			const voteOther = Math.log( 1 + 0.0002 * countyVote[ 6 ] ) || 0;

			if ( countyVote[ 6 ] > 0 ) {

				const pointsOther = [ v2( 0, 0 ), v2( 0.1 * total, voteOther ), v2( 0, voteOther - 0.03 ) ];
				const geometryOther = new THREE.LatheBufferGeometry( pointsOther, 7 );
				const vertexOther = GJS.latLonToXYZ( 50, + fip[ 3 ], + fip[ 4 ] );
				geometryOther.rotateX( 0.5 * Math.PI );
				geometryOther.lookAt( vertexOther );
				geometryOther.translate( vertexOther.x, vertexOther.y, vertexOther.z );

				geometriesOther.push( geometryOther );
			}
			VOT.indexOther.push( countyVote );

		}

	} );

	const bufferGeometryDem = THREE.BufferGeometryUtils.mergeBufferGeometries( geometriesDem );
	const materialDem = new THREE.MeshPhongMaterial( { color: 0x0015BC } );
	const meshDem = new THREE.Mesh( bufferGeometryDem, materialDem );
	meshDem.name = "democrat";
	//mesh.receiveShadow = true;
	//mesh.castShadow = true;
	UFR.counties.add( meshDem );

	const bufferGeometryRep = THREE.BufferGeometryUtils.mergeBufferGeometries( geometriesRep );
	const materialRep = new THREE.MeshPhongMaterial( { color: 0xDE0100 } );
	const meshRep = new THREE.Mesh( bufferGeometryRep, materialRep );
	meshRep.name = "republican";
	//meshRep.receiveShadow = true;
	//meshRep.castShadow = true;
	UFR.counties.add( meshRep );

	if ( geometriesOther.length ) {

		const bufferGeometryOther = THREE.BufferGeometryUtils.mergeBufferGeometries( geometriesOther );
		const materialOther = new THREE.MeshPhongMaterial( { color: 0x008080 } );
		const meshOther = new THREE.Mesh( bufferGeometryOther, materialOther );
		meshOther.name = "other";
		//meshOther.receiveShadow = true;
		//meshOther.castShadow = true;
		UFR.counties.add( meshOther );
	}

	RAY.intersectObjects = UFR.counties.children;

	//const bytes = THREE.BufferGeometryUtils.estimateBytesUsed( bufferGeometry );
	//console.log( "bytes", bytes );

	THR.scene.add( UFR.counties );

	//console.log( "init2", performance.now() - THR.timeStart );

	VOT.setStatsVote();

};



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



//////////

RAY.getHtm = function ( intersected ) {
	//console.log( "intersected", intersected.object.name );

	let item;
	let index = intersected.faceIndex;

	// try using find or something like that??
	for ( item = 0; item <= VOT.indexDem.length; item++ ) {

		const limit = item * 28;

		if ( index < limit ) { break; }

	}

	const countyVote = VOT.indexDem[ item - 1 ];
	//console.log( "countyVote", countyVote );

	const yearPrevious = ( -4 + ( + selYear.value ) ) + "";

	if ( yearPrevious ) {

		votesYearPrev = VOT.votesAll.find( vote => vote[ 0 ] === yearPrevious && vote[ 1 ] === countyVote[ 1 ] );

		//console.log( "votesYearPrev", votesYearPrev, yearPrevious );

	}

	const htm = `
<div>
	<a href="https://www.google.com/search?q=FIPS+${ countyVote[ 1 ] }" target="_blank"><img width="14" src="https://theo-armour.github.io/2020/lib/icons/icon-link-external.svg"> FIPS: ${ countyVote[ 1 ] }</a><br>
	County: ${ countyVote[ 3 ] } ~ ${ countyVote[ 2 ] }<br>
	Year: ${ countyVote[ 0 ] } <br>
	Total: ${ ( + countyVote[ 7 ] ).toLocaleString() }<br>
	Democrat: ${ ( + countyVote[ 4 ] ).toLocaleString() } <br>
	Republican: ${ ( + countyVote[ 5 ] ).toLocaleString() }<br>
	Other: ${ ( + countyVote[ 6 ] ).toLocaleString() }<br>
	<hr>
	Year: ${ yearPrevious } <br>
	Total: ${ ( + votesYearPrev[ 7 ] ).toLocaleString() }<br>
	Democrat: ${ ( + votesYearPrev[ 4 ] ).toLocaleString() } <br>
	Republican: ${ ( + votesYearPrev[ 5 ] ).toLocaleString() }<br>
	Other: ${ ( + votesYearPrev[ 6 ] ).toLocaleString() }<br>
</div>`;

	return htm;

};