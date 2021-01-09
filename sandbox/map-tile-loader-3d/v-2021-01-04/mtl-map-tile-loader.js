// copyright 2021 Theo Armour. MIT license.
/* globals THREE, MTL*/
/* jshint esversion: 6 */

const MTL = {};

MTL.path = "../../../";

// San Francisco Bay
MTL.latitude = MTL.defaultLatitude = 37.796;
MTL.longitude = MTL.defaultLongitude = -122.398;


// Hong Kong
// MTL.latitude = MTL.defaultLatitude = 22.3193039;
// MTL.longitude = MTL.defaultLongitude = 114.1693611;
// MTL.zoom = 11;

MTL.zoom = MTL.defaultZoom = 14;
MTL.delta = 2;

MTL.rows = MTL.rowsDefault = 3;
MTL.columns = MTL.columnsDefault = 3;

MTL.overlayIndex = MTL.defaultOverlayIndex;
MTL.heightScale = MTL.defaultHeightScale = 50;

MTL.pixelsPerTile = 256;
MTL.unitsPerTile = 50;  // controls size of Three.js PlaneBufferGeometry

MTL.metersPerPixelPerZoom = [ 156412, 78206, 39103, 19551, 9776, 4888, 2444, 1222, 610.984, 305.492, 152.746, 76.373, 38.187, 19.093, 9.547, 4.773, 2.387, 1.193, 0.596, 0.298 ];
MTL.metersPerPixel = MTL.metersPerPixelPerZoom[ MTL.zoom ];

// following was by trial and error. An algorithm would be nice
MTL.scale = [ 0.00003, 0.00005, 0.0001, 0.0001, 0.0002, 0.0003, 0.0004,  0.0004, 0.002, 0.002, 0.003, 0.02 ];
MTL.scaleTerrain = MTL.scale[ MTL.zoom - 7 ] * MTL.heightScale;

MTL.mapboxToken = 'pk.eyJ1IjoidGhlb2EiLCJhIjoiY2o1YXFra3V2MGIzbzJxb2lneDUzaWhtZyJ9.7bYFAQabMXiYmcqW8NLfwg';
//MTL.getUrlMapBox = ( x, y, zoom = 1 ) => `https://api.mapbox.com/v1/mapbox.satellite-v9/${ zoom }/${ MTL.tileHeightMapCenterX + x }/${ MTL.tileHeightMapCenterY + y }.png?access_token=${ MTL.mapboxToken }`;
//https://api.mapbox.com/v1/mapbox.satellite-v9/6/9/25.png?access_token=pk.eyJ1IjoidGhlb2EiLCJhIjoiY2o1YXFra3V2MGIzbzJxb2lneDUzaWhtZyJ9.7bYFAQabMXiYmcqW8NLfwg

//MTL.getUrlMapBox = ( x, y, zoom ) => `https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/256/${ zoom }/${ x }/${ y }?access_token=pk.eyJ1IjoidGhlb2EiLCJhIjoiY2o1YXFra3V2MGIzbzJxb2lneDUzaWhtZyJ9.7bYFAQabMXiYmcqW8NLfwg`;



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

	<div id=LOCdivDetails ></div>

	<p>
		Go
		<button onclick="MTL.offsetBitmapX -=${ MTL.delta };MTL.offsetHeightMapX -=1;MTL.updateMapGroup();" title="Go west|left">&#8678;</button>
		<button onclick="MTL.offsetBitmapX +=${ MTL.delta };MTL.offsetHeightMapX +=1;MTL.updateMapGroup();" title="Go east|right">&#8680;</button>

		<button onclick="MTL.offsetBitmapY -=${ MTL.delta };MTL.offsetHeightMapY -=1;MTL.updateMapGroup();" title="Go north" |up>&#8679;</button>
		<button onclick="MTL.offsetBitmapY +=${ MTL.delta };MTL.offsetHeightMapY +=1;MTL.updateMapGroup();" title="Go south|down">&#8681;</button>
	</p>

	<label title="Slide me">
		zoom: <output id=outZoom >${ MTL.zoom }</output>
		<input id=rngZoom type=range oninput=MTL.updateMapGroup()
			min=3 max=20 step=1 value=${ MTL.zoom }>
	</label>

	<label title="Slide me">
		rows: <output id=outRows>${ MTL.rows }</output>
		<input id=rngRows type=range oninput=MTL.updateMapGroup()
			min=3 max=6 step=1 value=${ MTL.rows }>
	</label>

	<label title="Slide me">
		columns: <output id=outColumns >${ MTL.columns }</output>
		<input id=rngColumns type=range onchange=MTL.updateMapGroup()
			min=3 max=6 step=1 value=${ MTL.columns }>
	</label>

	<label title="Slide me">
		heights: <output id=outHeight >${ MTL.heightScale }</output>
		<input id=rngHeight type=range onchange=MTL.updateMapGroup()
			min=1 max=200 step=1 value=${ MTL.heightScale }>
	</label>

	<br>

	<div id=SBSdivSelect >ccc</div>

	<div id=MTLdivLog></div>


</details>`;

	MTLdivDetails.innerHTML = htm;

	window.addEventListener( "hashchange", MTL.onHashChange );

	LOC.init();

	SBS.init();

	MTL.reset();

};



MTL.onHashChange = function () {

	const items = location.hash.split( "," ).map( item => item.split( ":" ) );
	console.log( "items", items );

	MTL.longitude = + items.find( item => item[ 0 ].includes( "longitude" ) )[ 1 ];
	MTL.latitude = + items.find( item => item[ 0 ].includes( "latitude" ) )[ 1 ];

	const rows = items.find( item => item[ 0 ].includes( "rows" ) );
	MTL.rows = rows ? ( + rows[ 1 ] ) : MTL.rowsDefault;
	//console.log( "rows", MTL.rows );

	const columns = items.find( item => item[ 0 ].includes( "columns" ) );
	MTL.columns = columns ? ( + columns[ 1 ] ) : MTL.columnsDefault;

	const zoom = items.find( item => item[ 0 ].includes( "zoom" ) );
	MTL.zoom = zoom ? ( + zoom[ 1 ] ) : MTL.zoomDefault;
	//console.log( "zoom", MTL.zoom );

	const scale = items.find( item => item[ 0 ].includes( "scale" ) );
	MTL.heightScale = scale ? ( + scale[ 1 ] ) : MTL.heightScaleDefault;

	outZoom.value = rngZoom.value = MTL.zoom;
	outRows.value = rngRows.value = MTL.rows;
	outColumns.value = rngColumns.value = MTL.columns;
	outHeight.value = rngHeight.value = MTL.heightScale;

	MTL.reset();

};


MTL.reset = function () {

	MTL.offsetHeightMapX = 0;
	MTL.offsetHeightMapY = 0;

	MTL.offsetBitmapX = 0;
	MTL.offsetBitmapY = 0;

	MTL.updateMapGroup();

};



MTL.updateMapGroup = function () {

	MTL.timeStart = performance.now();

	MTLdivLog.innerHTML = "";

	outZoom.value = MTL.zoom = + rngZoom.value;
	outRows.value = MTL.rows = + rngRows.value;
	outColumns.value = MTL.columns = + rngColumns.value;
	outHeight.value = MTL.heightScale = + rngHeight.value;

	MTL.scaleTerrain = MTL.scale[ MTL.zoom - 7 ] * MTL.heightScale;

	MTL.tileHeightMapCenterX = MTL.lonToTile( MTL.longitude, MTL.zoom );
	MTL.tileHeightMapCenterY = MTL.latToTile( MTL.latitude, MTL.zoom );

	MTL.tileTopLeftLongitude = MTL.tile2lon( MTL.tileHeightMapCenterX - Math.floor( 0.5 * MTL.columns ), MTL.zoom );
	MTL.tileTopLeftLatitude = MTL.tile2lat( MTL.tileHeightMapCenterY - Math.floor( 0.5 * MTL.rows ), MTL.zoom );

	//MTL.material = new THREE.MeshNormalMaterial( { side: 2 } );
	MTL.getTilesHeightMaps();

	// MTL.geometry = new THREE.PlaneBufferGeometry( MTL.columns * MTL.unitsPerTile, MTL.rows * MTL.unitsPerTile,
	// MTL.columns * MTL.pixelsPerTile - 1, MTL.rows * MTL.pixelsPerTile - 1 );
	MTL.getTilesBitmaps();

};



////////// Height Maps

MTL.getTilesHeightMaps = function () {

	if ( !MTL.canvasHeightMap ) { MTL.canvasHeightMap = document.createElement( 'canvas' ); }

	MTL.rowsHeightMap = MTL.rows;
	MTL.columnsHeightMap = MTL.columns;
	MTL.zoomHeightMap = MTL.zoom;

	MTL.canvasHeightMap.width = MTL.pixelsPerTile * MTL.columnsHeightMap;
	MTL.canvasHeightMap.height = MTL.pixelsPerTile * MTL.rowsHeightMap;
	MTL.canvasHeightMap.style.cssText = "width:100%;border:1px solid red;";
	MTL.contextHeightMap = MTL.canvasHeightMap.getContext( "2d" );
	//MTL.contextHeightMap.clearRect( 0, 0, MTL.canvasHeightMap.width, MTL.canvasHeightMap.height );

	MTL.heightMapTopLeftX = MTL.lonToTile( MTL.tileTopLeftLongitude, MTL.zoomHeightMap );
	MTL.heightMapTopLeftY = MTL.latToTile( MTL.tileTopLeftLatitude, MTL.zoomHeightMap );

	MTL.tileHeightMapsLoaded = 0;

	for ( let y = 0; y < MTL.rowsHeightMap; y++ ) {

		for ( let x = 0; x < MTL.columnsHeightMap; x++ ) {

			//url = `https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/256/${ MTL.zoomHeightMap }/${ MTL.tileHeightMapCenterX + x }/${ MTL.tileHeightMapCenterY + y }?access_token=pk.eyJ1IjoidGhlb2EiLCJhIjoiY2o1YXFra3V2MGIzbzJxb2lneDUzaWhtZyJ9.7bYFAQabMXiYmcqW8NLfwg`
			const url = `https://api.mapbox.com/v4/mapbox.terrain-rgb/${ ( MTL.zoomHeightMap ) }/${ x + MTL.heightMapTopLeftX + MTL.offsetHeightMapX }/${ y + MTL.heightMapTopLeftY + MTL.offsetHeightMapY }.pngraw?access_token=${ MTL.mapboxToken }`;
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
		//console.log( "col row", col, row );

		MTL.contextHeightMap.drawImage( img, 0, 0, size, size, col * size, row * size, size, size );

		MTL.tileHeightMapsLoaded++;

		if ( MTL.tileHeightMapsLoaded >= MTL.rowsHeightMap * MTL.columnsHeightMap ) {

			//console.log( "height maps loaded", performance.now() - MTL.timeStart );

			MTL.onLoadHeightMaps( MTL.contextHeightMap );

		}

	};

	img.src = src;

};



MTL.onLoadHeightMaps = function ( context ) {

	//MTLdivLog.appendChild( MTL.canvasHeightMap );

	if ( MTL.geometry ) MTL.geometry.dispose();

	MTL.geometry = new THREE.PlaneBufferGeometry( MTL.columnsHeightMap * MTL.unitsPerTile, MTL.rowsHeightMap * MTL.unitsPerTile,
		MTL.columnsHeightMap * MTL.pixelsPerTile - 1, MTL.rowsHeightMap * MTL.pixelsPerTile - 1 );

	const vertices = MTL.geometry.attributes.position.array;
	const data = context.getImageData( 0, 0, MTL.columnsHeightMap * MTL.pixelsPerTile,
		MTL.rowsHeightMap * MTL.pixelsPerTile ).data;

	for ( let i = 2, j = 0; i < vertices.length; i += 3, j += 1 ) {

		vertices[ i ] = MTL.scaleTerrain * ( 0.1 * ( data[ j++ ] * 65536 + data[ j++ ] * 256 + data[ j++ ] ) - 10000 );

	}

	MTL.geometry.computeFaceNormals();
	MTL.geometry.computeVertexNormals();

	//console.log( "height map", performance.now() - MTL.timeStart );

	MTL.getMesh();

};



//////////

MTL.getUrlGoogle = ( x, y, zoom = 1 ) => `https://mt1.google.com/vt/x=${ x }&y=${ y }&z=${ zoom }`;


MTL.getTilesBitmaps = function () {

	if ( !MTL.canvasBitmap ) { MTL.canvasBitmap = document.createElement( 'canvas' ); }

	MTL.delta = 2;
	MTL.columnsBitmap = 2 * MTL.columns;
	MTL.rowsBitmap = 2 * MTL.rows;
	MTL.zoomBitmap = 1 + MTL.zoom;

	MTL.canvasBitmap.width = MTL.pixelsPerTile * MTL.columnsBitmap;
	MTL.canvasBitmap.height = MTL.pixelsPerTile * MTL.rowsBitmap;
	MTL.canvasBitmap.style.cssText = "width:256px;";
	MTL.contextBitmap = MTL.canvasBitmap.getContext( "2d" );
	//MTL.contextBitmap.clearRect( 0, 0, MTL.canvasBitmap.width, MTL.canvasBitmap.height );

	MTL.bitmapTopLeftX = MTL.lonToTile( MTL.tileTopLeftLongitude, MTL.zoomBitmap );
	MTL.bitmapTopLeftY = MTL.latToTile( MTL.tileTopLeftLatitude, MTL.zoomBitmap );

	MTL.tileBitmapsLoaded = 0;

	for ( let y = 0; y < MTL.rowsBitmap; y++ ) {

		for ( let x = 0; x < MTL.columnsBitmap; x++ ) {

			const url = MTL.getUrlGoogle( x + MTL.bitmapTopLeftX + MTL.offsetBitmapX, y + MTL.bitmapTopLeftY + + MTL.offsetBitmapY, MTL.zoomBitmap );
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

		if ( MTL.tileBitmapsLoaded >= MTL.rowsBitmap * MTL.columnsBitmap ) {

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

MTL.getMesh = function () {

	THR.scene.remove( THR.group );

	//console.log( "MTL.geometry", MTL.geometry );

	if ( MTL.geometry && MTL.material ) {

		THR.group = new THREE.Group();
		THR.group.name = `map ${ MTL.latitude.toFixed( 3 ) } ${ MTL.longitude.toFixed( 3 ) }`;

		MTL.mesh = new THREE.Mesh( MTL.geometry, MTL.material );

		MTL.mesh.castShadow = true;
		MTL.mesh.receiveShadow = true;

		THR.group.add( MTL.mesh );

		MTL.mesh.geometry.computeBoundingSphere( new THREE.Sphere() );

		const radius = MTL.mesh.geometry.boundingSphere.radius;
		//console.log( "radius", radius );

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