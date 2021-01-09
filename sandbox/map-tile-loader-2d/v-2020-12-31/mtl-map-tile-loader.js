MTL = {};


// San Francisco Bay
MTL.latitude = MTL.defaultLatitude = 37.796;
MTL.longitude = MTL.defaultLongitude = -122.398;
MTL.defaultZoom = 16;


MTL.rows = MTL.defaultRows = 2;
MTL.cols = MTL.defaultCols = 2;

MTL.pixelsPerTile = 256;
MTL.unitsPerTile = 50;  // controls size of Three.js PlaneBufferGeometry





MTL.init = function () {

	MTL.latitude = MTL.defaultLatitude;
	MTL.longitude = MTL.defaultLongitude;

	MTL.zoom = 6; //MTL.defaultZoom;
	MTL.overlayIndex = MTL.defaultOverlayIndex;
	MTL.heightScale = MTL.defaultHeightScale;

	MTL.cols = MTL.defaultCols;
	MTL.rows = MTL.defaultRows;


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

	<details>

		<summary>locations</summary>

		<p><a href='#"title":"","latitude":37.796,"longitude":-122.398,"zoom":11'>San Francisco Bay</a></p>

		<p><a href='#"title":"Golden Gate Bridge","latitude":37.8199,"longitude":-122.4783,"zoom":14'>
				Golden Gate Bridge</a></p>

		<p><a
				href='#"title":"California","latitude":36.7783,"longitude":-119.4179,"zoom":7,"scale":50,"rows":6,"columns":3'>
				California</a></p>

		<p><a href='#"title":"Burning Man","latitude":40.786944,"longitude":-119.204444,"zoom":12'>
				Burning Man</a></p>

		<p><a
				href='#"title":"Half%20Dome,%20California,%20USA","latitude":37.7459192,"longitude":-119.5331992,"zoom":14,"offsetUTC":-420'>
				Half Dome, Yosemite</a></p>

		<p><a
				href='#"title":"Grand%20Canyon,%20Arizona,%20USA","latitude":36.11276399999999,"longitude":-113.9960696,"zoom":11,"offsetUTC":-420'>
				The Grand Canyon</a></p>

		<p><a href='#"title":"Greenwich Observatory","latitude":51.4779,"longitude":-0.0015,"zoom":15'>
				Greenwich Observatory</a></p>

		<p><a
				href='#"title":"Skye,%20United%20Kingdom","latitude":57.2736277,"rows":5,"longitude":-6.2155023,"zoom":10,"offsetUTC":60'>
				Isles of Skye</a></p>

		<p><a href='#"title":"Tenzing Hillary Airport","latitude":27.6874,"longitude":86.7322,"zoom":12'>Tenzing
				Hillary Airport</a></p>

		<p>
			<a href='#"title":"Hong%20Kong","latitude":22.3193039,"longitude":114.1693611,"zoom":11,"offsetUTC":480'>
				Hong Kong</a></p>

		<p><a
				href='#"title":"Sidney Harbour","latitude":-33.8675,"longitude":151.207,"zoom":13,"scale":50,"offsetUTC":-600'>
				Sydney Harbour</a></p>

		<p><a
				href='#"title":"Queenstown,%20New%20Zealand","latitude":-45.0301511,"longitude":168.6616206,"zoom":13,"index":3,"offsetUTC":720'>
				Queenstown, New Zealand</a></p>

		<p><a href='#"title":"Moorea","latitude":-17.5388,"longitude":-149.8295,"zoom":13,"index":3'>Moorea</a></p>

		<p><a href=''>
			</a></p>

	</details>

	<br>

</details>`;

	MTLdivDetails.innerHTML = htm;

	MTL.getTilesBitmaps2();

};

MTL.getUrlGoogle = ( x, y, zoom = 1 ) => `https://mt1.google.com/vt/x=${ MTL.tileBitmapCenterX + x }&y=${ MTL.tileBitmapCenterY + y }&z=${ zoom }`;

MTL.getTilesBitmaps2 = function () {

	MTL.tileBitmapCenterX = MTL.lonToTile( MTL.longitude, MTL.zoom );
	MTL.tileBitmapCenterY = MTL.latToTile( MTL.latitude, MTL.zoom );

	offsetY = Math.floor( 0.5 * MTL.rows );
	offsetX = Math.floor( 0.5 * MTL.cols );

	for ( let y = - offsetY; y < offsetY; y++ ) {

		for ( let x = - offsetX; x < offsetX; x++ ) {

			url = MTL.getUrlGoogle( x, y, MTL.zoom );
			main.innerHTML += `<img src=${ url } width=100 style="border: 1px solid red;" >`;
		}
		main.innerHTML += `<br>`;

	}

};





MTL.getTilesBitmaps = function () {

	if ( !MTL.canvasBitmap ) { divContentMain.appendChild( MTL.canvasBitmap = document.createElement( 'canvas' ) ); }

	MTL.zoomDelta = 2;

	MTL.canvasBitmap.width = MTL.pixelsPerTile * MTL.cols * MTL.zoomDelta;
	MTL.canvasBitmap.height = MTL.pixelsPerTile * MTL.rows * MTL.zoomDelta;
	MTL.canvasBitmap.style.cssText = "width:256px;border: 1px solid red;";
	MTL.contextBitmap = MTL.canvasBitmap.getContext( "2d" );

	MTL.tileBitmapsLoaded = 0;
	MTL.tileHeightMapsLoaded = 0;

	MTL.tileCenterX = MTL.lonToTile( MTL.longitude, MTL.zoom );
	MTL.tileCenterY = MTL.latToTile( MTL.latitude, MTL.zoom );

	MTL.tileStartX = MTL.tileCenterX - Math.floor( MTL.cols / 2 );
	MTL.tileStartY = MTL.tileCenterY - Math.floor( MTL.rows / 2 );

	const centerLatMax = MTL.tile2lat( MTL.tileCenterY, MTL.zoom );
	const centerLatMin = MTL.tile2lat( MTL.tileCenterY + 1, MTL.zoom );

	const centerLonMax = MTL.tile2lon( MTL.tileCenterX, MTL.zoom );
	const centerLonMin = MTL.tile2lon( MTL.tileCenterX + 1, MTL.zoom );

	const latDelta = Math.abs( centerLatMax - centerLatMin );
	const lonDelta = Math.abs( centerLonMax - centerLonMin );

	const latOffsetTarget = Math.abs( centerLatMax - MTL.latitude );
	const lonOffsetTarget = Math.abs( centerLonMax - MTL.longitude );

	const latDiff = latOffsetTarget / latDelta;
	const lonDiff = lonOffsetTarget / lonDelta;

	let tileOffsetX, tileOffsetY;

	tileOffsetY = 0;
	tileOffsetX = 0;

	//MTL.getUrlGoogle = ( x, y, zoom = 1 ) => `${ MTL.mapOverlays[ MTL.overlayIndex ][ 1 ] }${ MTL.tileBitmapStartX + x }&y=${ MTL.tileBitmapStartY + y }&z=${ zoom }`;


	MTL.tileBitmapCenterX = MTL.lonToTile( MTL.longitude, MTL.zoom );
	MTL.tileBitmapCenterY = MTL.latToTile( MTL.latitude, MTL.zoom );

	//MTL.tileBitmapStartX = MTL.tileBitmapCenterX - Math.floor( MTL.zoomDelta * MTL.cols / 2 );
	//MTL.tileBitmapStartY = MTL.tileBitmapCenterY - Math.floor( MTL.zoomDelta * MTL.rows / 2 );

	MTL.getUrlGoogle = ( x, y, zoom = 1 ) => `https://mt1.google.com/vt/x=${ MTL.tileBitmapCenterX + x }&y=${ MTL.tileBitmapCenterY + y }&z=${ zoom }`;

	url = MTL.getUrlGoogle( 0, 0, MTL.zoom );

	divContentMain.innerHTML = `<img src=${ url } >`;

	console.log( "url", url );
	MTL.stats = `
	<p>
		centerLatMax: ${ centerLatMax }<br>
		centerLatMin: ${ centerLatMin }<br>
		<br>
		centerLonMax: ${ centerLonMax }<br>
		centerLonMin: ${ centerLonMin }<br>
	</p>

	<p>
		latDelta: ${ latDelta }<br>
		lonDelta: ${ lonDelta }<br>
	</p>

	<p>
		latDiff: ${ latDiff }<br>
		lonDiff: ${ lonDiff }<br>
	</p>
	<p>
		tileOffsetY: ${ tileOffsetY }<br>
		tileOffsetX: ${ tileOffsetX }<br>
	</p>
	<p>
		latOffsetTarget: ${ latOffsetTarget }<br>
		lonOffsetTarget: ${ lonOffsetTarget }<br>
	</p>
	`;

	MTLdivMessage.innerHTML = MTL.stats;

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