MTL = {};

MTL.path = "../../../"
// San Francisco Bay
MTL.latitude = MTL.defaultLatitude = 37.796;
MTL.longitude = MTL.defaultLongitude = -122.398;
MTL.defaultZoom = 12;


MTL.rows = MTL.defaultRows = 6;
MTL.cols = MTL.defaultCols = 6;

MTL.pixelsPerTile = 256;
MTL.unitsPerTile = 50;  // controls size of Three.js PlaneBufferGeometry
MTL.zoomDelta = 1;

MTL.mapboxToken = 'pk.eyJ1IjoidGhlb2EiLCJhIjoiY2o1YXFra3V2MGIzbzJxb2lneDUzaWhtZyJ9.7bYFAQabMXiYmcqW8NLfwg';




MTL.init = function () {




	MTL.latitude = MTL.defaultLatitude;
	MTL.longitude = MTL.defaultLongitude;

	MTL.zoom = MTL.defaultZoom;
	MTL.overlayIndex = MTL.defaultOverlayIndex;
	MTL.heightScale = MTL.defaultHeightScale;

	MTL.columns = MTL.defaultCols;
	MTL.rows = MTL.defaultRows;

	MTL.deltaX = 0;
	MTL.deltaY = 0;
	MTL.tileBitmapsLoaded = 0;

	const htm = `
<details id=MTLdet open>

	<summary class="summary-primary gmd-1" title="View selected items">

		<span id=MTLsumTitle >Load image tiles</span>
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
		<input id=rngZoom type=range oninput=MTL.zoom=(+this.value);out.value=this.value;MTL.getTilesBitmaps()
			min=3 max=20 value=${ MTL.zoom }>
	</label>

	<label title="Slide me">
		rows: <output id=outRows>${ MTL.rows }</output>
		<input id=rngRows type=range oninput=MTL.rows=(+this.value);outRows.value=this.value;MTL.getTilesBitmaps()
			min=6 max=12 step=2 value=${ MTL.rows }>
	</label>

	<label title="Slide me">
		columns: <output id=outColumns>${ MTL.columns }</output>
		<input id=rngColumns type=range oninput=MTL.columns=(+this.value);outColumns.value=this.value;MTL.getTilesBitmaps()
			min=6 max=12 step=2 value=${ MTL.columns }>
	</label>

	<p>
		Go
		<button onclick="MTL.offsetX +=2;MTL.getTilesBitmaps();" title="Go west|left">&#8678;</button>
		<button onclick="MTL.offsetX -=2;MTL.getTilesBitmaps();" title="Go east|right">&#8680;</button>

		<button onclick="MTL.offsetY -=2;MTL.getTilesBitmaps();" title="Go north" |up>&#8679;</button>
		<button onclick="MTL.offsetY +=2;MTL.getTilesBitmaps();" title="Go south|down">&#8681;</button>
	</p>

	<details open>

		<summary>locations</summary>

		<p><a href='#"title":"","latitude":37.796,"longitude":-122.398,"zoom":11'>San Francisco Bay</a></p>

		<p><a href='#"title":"Golden Gate Bridge","latitude":37.8199,"longitude":-122.4783,"zoom":14'>
				Golden Gate Bridge</a></p>

		<p><a href='#"title":"California","latitude":36.7783,"longitude":-119.4179,"zoom":7,"scale":50,"rows":6,"columns":3'>
				California</a></p>

		<p><a href='#"title":"Burning Man","latitude":40.786944,"longitude":-119.204444,"zoom":12'>
				Burning Man</a></p>

		<p><a href='#"title":"Half%20Dome,%20California,%20USA","latitude":37.7459192,"longitude":-119.5331992,"zoom":14,"offsetUTC":-420'>
				Half Dome, Yosemite</a></p>

		<p><a href='#"title":"Grand%20Canyon,%20Arizona,%20USA","latitude":36.11276399999999,"longitude":-113.9960696,"zoom":11,"offsetUTC":-420'>
				The Grand Canyon</a></p>

		<p><a href='#"title":"Greenwich Observatory","latitude":51.4779,"longitude":-0.0015,"zoom":15'>
				Greenwich Observatory</a></p>

		<p><a href='#"title":"Skye,%20United%20Kingdom","latitude":57.2736277,"rows":5,"longitude":-6.2155023,"zoom":10,"offsetUTC":60'>
				Isles of Skye</a></p>

		<p><a href='#"title":"Tenzing Hillary Airport","latitude":27.6874,"longitude":86.7322,"zoom":12'>Tenzing
				Hillary Airport</a></p>

		<p>
			<a href='#"title":"Hong%20Kong","latitude":22.3193039,"longitude":114.1693611,"zoom":11,"offsetUTC":480'>
				Hong Kong</a></p>

		<p><a href='#"title":"Sidney Harbour","latitude":-33.8675,"longitude":151.207,"zoom":13,"scale":50,"offsetUTC":-600'>
				Sydney Harbour</a></p>

		<p><a href='#"title":"Queenstown,%20New%20Zealand","latitude":-45.0301511,"longitude":168.6616206,"zoom":13,"index":3,"offsetUTC":720'>
				Queenstown, New Zealand</a></p>

		<p><a href='#"title":"Moorea","latitude":-17.5388,"longitude":-149.8295,"zoom":13,"index":3'>Moorea</a></p>

		<p><a href=''>
			</a></p>

	</details>

	<br>

</details>`;

	MTLdivDetails.innerHTML = htm;

	window.addEventListener( "hashchange", MTL.onHashChange );

	MTL.offsetX = 0.5 * MTL.columns;
	MTL.offsetY = -0.5 * MTL.rows;

	MTL.getTilesBitmaps();

};


MTL.onHashChange = function () {

	txt = location.hash.replace( /%22/g, "" ).replace( /%20/g, " " );

	items = txt.split( "," ).MTL( item => item.split( ":"));

	//console.log( "items", items );

	MTL.longitude = + items.find( item => item[ 0 ] === "longitude" )[ 1 ];
	MTL.latitude = + items.find( item => item[ 0 ] === "latitude" )[ 1 ];

	MTL.deltaX = 0;
	MTL.deltaY = 0;

	MTL.offsetX = 0.5 * MTL.columns;
	MTL.offsetY = -0.5 * MTL.rows;

	MTL.tileBitmapsLoaded = 0;
	//console.log( "", MTL.latitude, MTL.longitude );

	//THR.scene.remove( THR.group )

	THR.group = THR.getGroupNew();

	MTL.getTilesBitmaps()

}



MTL.getUrlGoogle = ( x, y, zoom = 1 ) => `https://mt1.google.com/vt/x=${ MTL.tileBitmapCenterX + x }&y=${ MTL.tileBitmapCenterY + y }&z=${ zoom }`;

MTL.getUrlMapBox = ( x, y, zoom = 1 ) => `https://api.mapbox.com/v1/mapbox.satellite-v9/${ zoom }/${ MTL.tileHeightMapCenterX + x }/${ MTL.tileHeightMapCenterY + y }.png?access_token=${ MTL.mapboxToken }`;
// https://api.mapbox.com/v1/mapbox.satellite-v9/6/9/25.png?access_token=pk.eyJ1IjoidGhlb2EiLCJhIjoiY2o1YXFra3V2MGIzbzJxb2lneDUzaWhtZyJ9.7bYFAQabMXiYmcqW8NLfwg

MTL.getUrlMapBox = ( x, y, zoom = 1 ) => `https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/256/${ zoom }/${ MTL.tileHeightMapCenterX + x }/${ MTL.tileHeightMapCenterY + y }?access_token=pk.eyJ1IjoidGhlb2EiLCJhIjoiY2o1YXFra3V2MGIzbzJxb2lneDUzaWhtZyJ9.7bYFAQabMXiYmcqW8NLfwg`



MTL.getTilesBitmaps = function () {

	if ( !MTL.canvasBitmap ) { MTL.canvasBitmap = document.createElement( 'canvas' ); }

	MTL.canvasBitmap.width = MTL.pixelsPerTile * MTL.columns * MTL.zoomDelta;
	MTL.canvasBitmap.height = MTL.pixelsPerTile * MTL.rows * MTL.zoomDelta;
	MTL.canvasBitmap.style.cssText = "width:256px;";
	MTL.contextBitmap = MTL.canvasBitmap.getContext( "2d" );

	MTL.tileBitmapCenterX = MTL.lonToTile( MTL.longitude, MTL.zoom );
	MTL.tileBitmapCenterY = MTL.latToTile( MTL.latitude, MTL.zoom);

	MTLdivLog.innerHTML = "";

	for ( let y = 0; y < MTL.rows; y++ ) {

		for ( let x = 0; x < MTL.columns; x++ ) {

			url = MTL.getUrlGoogle( x - MTL.offsetX, y + MTL.offsetY , MTL.zoom  );

			MTL.requestFile( url, MTL.onCallbackBitmap, x, y )
			//MTLdivLog.innerHTML += `<img src=${ url } width=50 style="border: 1px solid red;" >`;
		}
		//MTLdivLog.innerHTML += `<br>`;

	}
	//console.log( "", ii );
	//MTL.getTilesHeightMaps()
};


MTL.getTilesHeightMaps = function () {

	MTL.tileHeightMapCenterX = MTL.lonToTile( MTL.longitude, MTL.zoom );
	MTL.tileHeightMapCenterY = MTL.latToTile( MTL.latitude, MTL.zoom );

	offsetX = Math.round( 0.5 * MTL.columns );
	offsetY = Math.floor( 0.5 * MTL.rows );

	divContentMain.innerHTML += "<br>";

	for ( let y = - MTL.rows; y <= MTL.rows; y++ ) {

		for ( let x = - MTL.columns; x <= MTL.columns; x++ ) {

			url = MTL.getUrlMapBox( x + MTL.deltaX, y + MTL.deltaY, MTL.zoom );
			divContentMain.innerHTML += `<img src=${ url } width=256 style="border: 1px solid red;" >`;
		}
		divContentMain.innerHTML += `<br>`;

	}

	divContentMain.innerHTML += `<br>`;
};



MTL.requestFile = function( url, callback, x, y ) {

	const xhr = new XMLHttpRequest();
	xhr.open( 'GET', url, true );
	xhr.responseType = "blob";
	xhr.onerror = ( xhr ) => console.log( 'error:', xhr );
	//xhr.onprogress = ( xhr ) => console.log( 'bytes loaded:', xhr.loaded );
	xhr.onload = ( xhr ) => callback( xhr, x, y );
	xhr.send( null );

}


MTL.onCallbackBitmap = function cb ( xhr, col, row ) {

	//console.log( "xhr", xhr );

	url = URL.createObjectURL( xhr.target.response );

	//console.log( "url", url );

	MTL.onLoadTileBitmap( url, col, row )

}



MTL.onLoadTileBitmap = function ( src, col, row ) {

	//console.log( "", row, col );

	const img = document.createElement( "img" );

	img.onload = function () {

		MTL.contextBitmap.drawImage( img, 0, 0, MTL.pixelsPerTile, MTL.pixelsPerTile, col * MTL.pixelsPerTile, row * MTL.pixelsPerTile, MTL.pixelsPerTile, MTL.pixelsPerTile );

		MTL.tileBitmapsLoaded ++;

		//console.log( "MTL.tileBitmapsLoaded", MTL.tileBitmapsLoaded );

		if ( MTL.tileBitmapsLoaded >= MTL.rows * MTL.columns ) {

			MTL.onLoadBitmaps( MTL.canvasBitmap );

		}

	};

	img.src = src;

};



MTL.onLoadBitmaps = function ( canvas ) {

	//MTLdivLog.appendChild( MTL.canvasBitmap )
	const texture = new THREE.Texture( canvas );
	texture.needsUpdate = true;

	//MTL.material = new THREE.MeshBasicMaterial( { map: texture, side: 2 } );
	MTL.material = new THREE.MeshPhongMaterial( { color: 0xffffff, map: texture, side: 2 } );

	MTL.getMesh();

};




MTL.getMesh = function () {

	MTL.geometry = new THREE.PlaneBufferGeometry( MTL.columns * MTL.unitsPerTile, MTL.rows * MTL.unitsPerTile );
	//material = new THREE.MeshBasicMaterial( { MTL: texture, side: 2 } );
	//material = new THREE.MeshNormalMaterial( { side: 2 } );

	if ( MTL.geometry && MTL.material ) {

		THR.group = THR.getGroupNew( THR.group );

		const mesh = new THREE.Mesh( MTL.geometry, MTL.material );
		mesh.castShadow = true;
		mesh.receiveShadow = true;
		THR.group.add( mesh );

		THR.zoomObjectBoundingSphere();

		//THR.radius = 141.4;

		// THR.lightDirectional.position.copy(
		//	THR.center.clone().add( new THREE.Vector3( -1.5 * THR.radius, -1.5 * THR.radius, 1.5 * THR.radius ) )
		//);

		THR.camera.position.copy(
			THR.center.clone().add( new THREE.Vector3( 0 * THR.radius, -0.8 * THR.radius, 0.8 * THR.radius ) )
		);

	}

};


////////// Cartography utilities

// https://wiki.openstreetmap.org/wiki/Slippy_map_tilenames#Resolution_and_Scale

MTL.lonToTile = ( longitude = 0, zoom = 16 ) => Math.floor( ( longitude + 180 ) / 360 * 2 ** zoom );


MTL.latToTile = ( latitude = 51.4934, zoom = 16 ) =>
	Math.floor( ( 1 - Math.log( Math.tan( latitude * Math.PI / 180 ) + 1 / Math.cos( latitude * Math.PI / 180 ) )
		/ Math.PI ) / 2 * 2 ** zoom );


MTL.tile2lon = ( x = 0, zoom = 11 ) => x / 2 ** zoom * 360 - 180;

MTL.tile2lat = ( y = 0, zoom = 11 ) => {

	const pi = Math.PI;
	const n = pi - 2 * pi * y / 2 ** zoom;
	return 180 / pi * Math.atan( 0.5 * ( Math.exp( n ) - Math.exp( -n ) ) );

};