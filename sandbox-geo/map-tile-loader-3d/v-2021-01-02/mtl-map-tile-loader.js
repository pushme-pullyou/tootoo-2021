// copyright 2021 Theo Armour. MIT license.
/* globals THREE, MTL*/
/* jshint esversion: 6 */

const MTL = {};

MTL.path = "../../../";

// San Francisco Bay
MTL.latitude = MTL.defaultLatitude = 37.796;
MTL.longitude = MTL.defaultLongitude = -122.398;
MTL.zoom = MTL.defaultZoom = 12;

MTL.rows = MTL.defaultRows = 6;
MTL.columns = MTL.defaultColumns = 6;

MTL.overlayIndex = MTL.defaultOverlayIndex;
MTL.heightScale = MTL.defaultHeightScale = 50;

MTL.pixelsPerTile = 256;
MTL.unitsPerTile = 50;  // controls size of Three.js PlaneBufferGeometry
MTL.zoomDelta = 1;

MTL.metersPerPixelPerZoom = [ 156412, 78206, 39103, 19551, 9776, 4888, 2444, 1222, 610.984, 305.492, 152.746, 76.373, 38.187, 19.093, 9.547, 4.773, 2.387, 1.193, 0.596, 0.298 ];
MTL.metersPerPixel = MTL.metersPerPixelPerZoom[ MTL.zoom ];

// following was by trial and error. An algorithm would be nice
MTL.scale = [ 0.00003, 0.00005, 0.0001, 0.0001, 0.0002, 0.0003, 0.0005, 0.003, 0.009, 0.001, 0.005, 0.02 ];
MTL.scaleTerrain = MTL.scale[ MTL.zoom - 7 ] * MTL.heightScale;

MTL.getUrlGoogle = ( x, y, zoom = 1 ) => `https://mt1.google.com/vt/x=${ MTL.tileBitmapCenterX + x }&y=${ MTL.tileBitmapCenterY + y }&z=${ zoom }`;

MTL.mapboxToken = 'pk.eyJ1IjoidGhlb2EiLCJhIjoiY2o1YXFra3V2MGIzbzJxb2lneDUzaWhtZyJ9.7bYFAQabMXiYmcqW8NLfwg';
//MTL.getUrlMapBox = ( x, y, zoom = 1 ) => `https://api.mapbox.com/v1/mapbox.satellite-v9/${ zoom }/${ MTL.tileHeightMapCenterX + x }/${ MTL.tileHeightMapCenterY + y }.png?access_token=${ MTL.mapboxToken }`;
// https://api.mapbox.com/v1/mapbox.satellite-v9/6/9/25.png?access_token=pk.eyJ1IjoidGhlb2EiLCJhIjoiY2o1YXFra3V2MGIzbzJxb2lneDUzaWhtZyJ9.7bYFAQabMXiYmcqW8NLfwg

MTL.getUrlMapBox = ( x, y, zoom ) => `https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/256/${ zoom }/${ MTL.tileHeightMapCenterX + x }/${ MTL.tileHeightMapCenterY + y }?access_token=pk.eyJ1IjoidGhlb2EiLCJhIjoiY2o1YXFra3V2MGIzbzJxb2lneDUzaWhtZyJ9.7bYFAQabMXiYmcqW8NLfwg`;



MTL.init = function () {

	const htm = `
<details id=MTLdet open>

	<summary class="summary-primary gmd-1" title="View selected items">

		<span id=MTLsumTitle >Load maps</span>
		<span class="info">
			<img class=infoImg src="${ MTL.path }lib/assets/icons/noun_Information_585560.svg">
			<div id="divMTL" class="infoTooltip gmd-5">
				Load image tiles
			</div>
		</span>

	</summary>

	<div class=divNavResize>

	<label title="Slide me">
		zoom: <output id=out>${ MTL.zoom }</output>
		<input id=rngZoom type=range oninput=MTL.zoom=(+this.value);out.value=this.value;MTL.updateMapGroup()
			min=3 max=20 value=${ MTL.zoom }>
	</label>

	<label title="Slide me">
		rows: <output id=outRows>${ MTL.rows }</output>
		<input id=rngRows type=range oninput=MTL.rows=(+this.value);outRows.value=this.value;MTL.updateMapGroup()
			min=6 max=12 step=2 value=${ MTL.rows }>
	</label>

	<label title="Slide me">
		columns: <output id=outColumns>${ MTL.columns }</output>
		<input id=rngColumns type=range oninput=MTL.columns=(+this.value);outColumns.value=this.value;MTL.updateMapGroup()
			min=6 max=12 step=2 value=${ MTL.columns }>
	</label>

	<p>
		Go
		<button onclick="MTL.offsetX +=2;MTL.updateMapGroup();" title="Go west|left">&#8678;</button>
		<button onclick="MTL.offsetX -=2;MTL.updateMapGroup();" title="Go east|right">&#8680;</button>

		<button onclick="MTL.offsetY -=2;MTL.updateMapGroup();" title="Go north" |up>&#8679;</button>
		<button onclick="MTL.offsetY +=2;MTL.updateMapGroup();" title="Go south|down">&#8681;</button>
	</p>

	<details open>

		<summary>locations</summary>

		<p><a href='#"title":"San Francisco Bay","latitude":37.796,"longitude":-122.398,"zoom":11'>San Francisco Bay</a></p>

		<p><a href='#"title":"Golden Gate Bridge","latitude":37.8199,"longitude":-122.4783,"zoom":14'>
				Golden Gate Bridge</a></p>

		<p><a href='#"title":"California","latitude":36.7783,"longitude":-119.4179,"zoom":7,"scale":50,"rows":6,"columns":3'>
				California</a></p>

		<p><a href='#"title":"Burning Man","latitude":40.786944,"longitude":-119.204444,"zoom":12'>
				Burning Man</a></p>

		<p><a href='#"title":"Half Dome - California USA","latitude":37.7459192,"longitude":-119.5331992,"zoom":14,"offsetUTC":-420'>
				Half Dome, Yosemite</a></p>

		<p><a href='#"title":"Grand Canyon - Arizona USA","latitude":36.11276399999999,"longitude":-113.9960696,"zoom":11,"offsetUTC":-420'>
				The Grand Canyon</a></p>

		<p><a href='#"title":"Greenwich Observatory","latitude":51.4779,"longitude":-0.0015,"zoom":15'>
				Greenwich Observatory</a></p>

		<p><a href='#"title":"Skye - United Kingdom","latitude":57.2736277,"rows":5,"longitude":-6.2155023,"zoom":10,"offsetUTC":60'>
				Isles of Skye</a></p>

		<p><a href='#"title":"Tenzing Hillary Airport","latitude":27.6874,"longitude":86.7322,"zoom":12'>Tenzing
				Hillary Airport</a></p>

		<p><a href='#"title":"Hong Kong","latitude":22.3193039,"longitude":114.1693611,"zoom":11,"offsetUTC":480'>
				Hong Kong</a></p>

		<p><a href='#"title":"Sidney Harbour","latitude":-33.8675,"longitude":151.207,"zoom":13,"scale":50,"offsetUTC":-600'>
				Sydney Harbour</a></p>

		<p><a href='#"title":"Queenstown - New Zealand","latitude":-45.0301511,"longitude":168.6616206,"zoom":13,"index":3,"offsetUTC":720'>
				Queenstown, New Zealand</a></p>

		<p><a href='#"title":"Moorea","latitude":-17.5388,"longitude":-149.8295,"zoom":13,"index":3'>Moorea</a></p>

		<p><a href=''>
			</a></p>

	</details>

	<br>

</details>`;

	MTLdivDetails.innerHTML = htm;

	window.addEventListener( "hashchange", MTL.onHashChange );

	MTL.reset();

};



MTL.onHashChange = function () {

	const items = location.hash.split( "," ).map( item => item.split( ":" ) );
	console.log( "items", items );

	MTL.longitude = + items.find( item => item[ 0 ].includes( "longitude" ) )[ 1 ];
	MTL.latitude = + items.find( item => item[ 0 ].includes( "latitude" ) )[ 1 ];

	MTL.reset();

};


MTL.reset = function () {

	MTLdivLog, innerHTML = "";
	MTL.offsetX = 0.5 * MTL.columns;
	MTL.offsetY = -0.5 * MTL.rows;

	MTL.updateMapGroup();

};


MTL.updateMapGroup = function () {

	MTL.timeStart = performance.now();

	MTL.getTilesBitmaps();

	MTL.getTilesHeightMaps();

};



MTL.getTilesBitmaps = function () {

	if ( !MTL.canvasBitmap ) { MTL.canvasBitmap = document.createElement( 'canvas' ); }

	MTL.canvasBitmap.width = MTL.pixelsPerTile * MTL.columns * MTL.zoomDelta;
	MTL.canvasBitmap.height = MTL.pixelsPerTile * MTL.rows * MTL.zoomDelta;
	MTL.canvasBitmap.style.cssText = "width:256px;";
	MTL.contextBitmap = MTL.canvasBitmap.getContext( "2d" );
	//MTL.contextBitmap.clearRect( 0, 0, MTL.canvasBitmap.width, MTL.canvasBitmap.height );

	MTL.tileBitmapCenterX = MTL.lonToTile( MTL.longitude, MTL.zoom );
	MTL.tileBitmapCenterY = MTL.latToTile( MTL.latitude, MTL.zoom );
	MTL.tileBitmapsLoaded = 0;

	for ( let y = 0; y < MTL.rows; y++ ) {

		for ( let x = 0; x < MTL.columns; x++ ) {

			const url = MTL.getUrlGoogle( x - MTL.offsetX, y + MTL.offsetY, MTL.zoom );
			MTL.requestFile( url, MTL.onCallbackBitmap, x, y );

		}

	}

};



MTL.onCallbackBitmap = function ( xhr, col, row ) {
	//console.log( "xhr", xhr );

	const url = URL.createObjectURL( xhr.target.response );
	const img = document.createElement( "img" );

	img.onload = function () {

		MTL.contextBitmap.drawImage( img, 0, 0, MTL.pixelsPerTile, MTL.pixelsPerTile, col * MTL.pixelsPerTile,
			row * MTL.pixelsPerTile, MTL.pixelsPerTile, MTL.pixelsPerTile );

		MTL.tileBitmapsLoaded++; // console.log( "MTL.tileBitmapsLoaded", MTL.tileBitmapsLoaded );

		if ( MTL.tileBitmapsLoaded >= MTL.rows * MTL.columns ) {

			MTL.onLoadBitmaps( MTL.canvasBitmap );

		}

	};

	img.src = url;

};



MTL.onLoadBitmaps = function ( canvas ) {

	//MTLdivLog.appendChild( MTL.canvasBitmap );

	if ( MTL.texture ) MTL.texture.dispose();
	MTL.texture = new THREE.Texture( canvas );
	MTL.texture.needsUpdate = true;
	MTL.material = new THREE.MeshPhongMaterial( { color: 0xffffff, map: MTL.texture, side: 2 } );
	//MTL.material = new THREE.MeshBasicMaterial( { map: texture, side: 2 } );

	console.log( "bitmap", performance.now() - MTL.timeStart );
	MTL.getMesh();

};



//////////

MTL.getTilesHeightMaps = function () {

	if ( !MTL.canvasHeightMap ) { MTL.canvasHeightMap = document.createElement( 'canvas' ); }

	MTL.canvasHeightMap.width = MTL.pixelsPerTile * MTL.columns * MTL.zoomDelta;
	MTL.canvasHeightMap.height = MTL.pixelsPerTile * MTL.rows * MTL.zoomDelta;
	MTL.canvasHeightMap.style.cssText = "width:256px;border:1px solid red;";
	MTL.contextHeightMap = MTL.canvasHeightMap.getContext( "2d" );
	//MTL.contextHeightMap.clearRect( 0, 0, MTL.canvasHeightMap.width, MTL.canvasHeightMap.height );

	MTL.tileHeightMapCenterX = MTL.lonToTile( MTL.longitude, MTL.zoom );
	MTL.tileHeightMapCenterY = MTL.latToTile( MTL.latitude, MTL.zoom );

	MTL.tileHeightMapsLoaded = 0;

	for ( let y = 0; y < MTL.rows; y++ ) {

		for ( let x = 0; x < MTL.columns; x++ ) {

			//url = `https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/256/${ MTL.zoom }/${ MTL.tileHeightMapCenterX + x }/${ MTL.tileHeightMapCenterY + y }?access_token=pk.eyJ1IjoidGhlb2EiLCJhIjoiY2o1YXFra3V2MGIzbzJxb2lneDUzaWhtZyJ9.7bYFAQabMXiYmcqW8NLfwg`
			const url = `https://api.mapbox.com/v4/mapbox.terrain-rgb/${ MTL.zoom }/${ MTL.tileHeightMapCenterX + x - MTL.offsetX }/${ MTL.tileHeightMapCenterY + y + MTL.offsetY }.pngraw?access_token=${ MTL.mapboxToken }`;

			//console.log( "url", url );
			MTL.fetchTileHeightMap( url, x, y );

		}

	}

};


MTL.fetchTileHeightMap = function ( url = "", col = 0, row = 0 ) {

	fetch( url ).then( ( response ) => {
		if ( response.ok ) {
			return response.blob();
		} else {
			console.log( "oops", 23 );
			MTL.tileHeightMapsLoaded++;
			MTLdivLog.innerHTML = '<p><mark>There was no available height map for for one or more tiles.</mark></p>';

		}
	} )
		.then( blob => MTL.onLoadTileHeightMap( URL.createObjectURL( blob ), col, row ) )
		.catch( ( error ) => {
			console.log( error );
		} );

};


MTL.onLoadTileHeightMap = function ( src, col = 0, row = 0 ) {

	const img = document.createElement( "img" );
	const size = 256;

	img.onload = function () {

		MTL.contextHeightMap.drawImage( img, 0, 0, size, size, col * size, row * size, size, size );

		MTL.tileHeightMapsLoaded++;

		if ( MTL.tileHeightMapsLoaded >= MTL.rows * MTL.columns ) {

			console.log( "height map 0", performance.now() - MTL.timeStart );

			MTL.onLoadHeightMaps( MTL.contextHeightMap );

		}

	};

	img.src = src;

};



MTL.onLoadHeightMaps = function ( context ) {

	//MTLdivLog.appendChild( MTL.canvasHeightMap );

	if ( MTL.geometry ) MTL.geometry.dispose();

	MTL.geometry = new THREE.PlaneBufferGeometry( MTL.columns * MTL.unitsPerTile, MTL.rows * MTL.unitsPerTile,
		MTL.columns * MTL.pixelsPerTile - 1, MTL.rows * MTL.pixelsPerTile - 1 );

	const vertices = MTL.geometry.attributes.position.array;
	const data = context.getImageData( 0, 0, MTL.columns * MTL.pixelsPerTile, MTL.rows * MTL.pixelsPerTile ).data;

	for ( let i = 2, j = 0; i < vertices.length; i += 3, j += 1 ) {

		vertices[ i ] = MTL.scaleTerrain * ( 0.1 * ( data[ j++ ] * 65536 + data[ j++ ] * 256 + data[ j++ ] ) - 10000 );

	}

	MTL.geometry.computeFaceNormals();
	MTL.geometry.computeVertexNormals();

	console.log( "height map", performance.now() - MTL.timeStart );

	MTL.getMesh();

};


//////////

MTL.getMesh = function () {

	THR.scene.remove( THR.group );

	if ( MTL.geometry && MTL.material ) {

		THR.group = new THREE.Group();
		THR.group.name = `map ${ MTL.latitude.toFixed( 3 ) } ${ MTL.longitude.toFixed( 3 ) }`;

		//console.log( "MTL.geometry", MTL.geometry );
		const mesh = new THREE.Mesh( MTL.geometry, MTL.material );

		mesh.castShadow = true;
		mesh.receiveShadow = true;

		THR.group.add( mesh );

		mesh.geometry.computeBoundingSphere( new THREE.Sphere() );

		const radius = mesh.geometry.boundingSphere.radius;
		console.log( "radius", radius );

		THR.camera.position.copy(
			THR.center.clone().add( new THREE.Vector3( 0 * radius, -0.8 * radius, 0.8 * radius ) )
		);

		if ( THR.lightDirectional ) {
			THR.lightDirectional.position.copy(
				THR.center.clone().add( new THREE.Vector3( -1.5 * radius, -1.5 * radius, 1.5 * radius ) )
			);

			THR.lightDirectional.shadow.camera.scale.set( 0.01 * radius, 0.01 * radius, 0.01 * radius );

			THR.lightDirectional.target = THR.axesHelper;

		}
		THR.scene.add( THR.group );

		console.log( "get mesh", performance.now() - MTL.timeStart );

	}

};


////////// utilities

MTL.requestFile = function ( url, callback, col, row ) {

	const xhr = new XMLHttpRequest();
	xhr.open( 'GET', url, true );
	xhr.responseType = "blob";
	xhr.onerror = ( xhr ) => console.log( 'error:', xhr );
	//xhr.onprogress = ( xhr ) => console.log( 'bytes loaded:', xhr.loaded );
	xhr.onload = ( xhr ) => callback( xhr, col, row );
	xhr.send( null );

};




// https://wiki.openstreetmap.org/wiki/Slippy_map_tilenames#Resolution_and_Scale

MTL.lonToTile = ( longitude = 0, zoom = 16 ) => Math.floor( ( longitude + 180 ) / 360 * 2 ** zoom );

MTL.latToTile = ( latitude = 51.4934, zoom = 16 ) =>
	Math.floor( ( 1 - Math.log( Math.tan( latitude * Math.PI / 180 ) + 1 / Math.cos( latitude * Math.PI / 180 ) ) / Math.PI ) / 2 * 2 ** zoom );


MTL.tile2lon = ( x = 0, zoom = 11 ) => x / 2 ** zoom * 360 - 180;

MTL.tile2lat = ( y = 0, zoom = 11 ) => {

	const pi = Math.PI;
	const n = pi - 2 * pi * y / 2 ** zoom;
	return 180 / pi * Math.atan( 0.5 * ( Math.exp( n ) - Math.exp( -n ) ) );

};