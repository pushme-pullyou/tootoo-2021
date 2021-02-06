// copyright 2021 Theo Armour. MIT license.

// https://mc.bbbike.org/mc/ map compare

const SBS = {};

SBS.getUrlGoogleMaps = ( x, y, zoom ) => `https://mt1.google.com/vt/lyrs=m&x=${ x }&y=${ y }&z=${ zoom }`;
SBS.getUrlGoogleTerrain = ( x, y, zoom ) => `https://mt1.google.com/vt/lyrs=t&x=${ x }&y=${ y }&z=${ zoom }`;
SBS.getUrlGoogleSatellite = ( x, y, zoom ) => `https://mt1.google.com/vt/lyrs=s&x=${ x }&y=${ y }&z=${ zoom }`;
SBS.getUrlGoogleHybrid = ( x, y, zoom ) => `https://mt1.google.com/vt/lyrs=y&x=${ x }&y=${ y }&z=${ zoom }`;
SBS.getUrlGoogleHybrid = ( x, y, zoom ) => `https://mt1.google.com/vt/lyrs=y&x=${ x }&y=${ y }&z=${ zoom }`;

SBS.getUrlOsm = ( x, y, zoom ) => `https://tile.openstreetmap.org/${ zoom }/${ x }/${ y }.png`;
SBS.getUrlOsmHot = ( x, y, zoom ) => `https://c.tile.openstreetmap.fr/hot/${ zoom }/${ x }/${ y }.png`;
SBS.getUrlCycle = ( x, y, zoom ) => `http://tile.opencyclemap.org/cycle/${ zoom }/${ x }/${ y }.png`;
SBS.getUrlTopo = ( x, y, zoom ) => `https://tile.opentopomap.org/${ zoom }/${ x }/${ y }.png`;

SBS.MQtoken = "pk.eyJ1IjoibWFwcXVlc3QiLCJhIjoiY2Q2N2RlMmNhY2NiZTR" + "kMzlmZjJmZDk0NWU0ZGJ" + "lNTMifQ.mPRiEubbajc6a5y9ISgydg";

SBS.getUrlMQSatellite = ( x, y, zoom ) => `https://a.tiles.mapbox.com/v4/mapquest.satellitenolabels/${ zoom }/${ x }/${ y }@2x.png?access_token=${ SBS.MQtoken }`;


SBS.getUrlStamen = ( x, y, zoom ) => `http://tile.stamen.com/terrain-background/${ zoom }/${ x }/${ y }.png`;
// remember x and y reversed
SBS.getUrlEsri = ( x, y, zoom ) => `https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/${ zoom }/${ y }/${ x }.jpg`;
SBS.getUrlEsriSat = ( x, y, zoom ) => `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${ zoom }/${ y }/${ x }.jpg`;

SBS.mapOverlays = [

	[ "Google Maps", SBS.getUrlGoogleMaps, "maps" ],
	[ "Google Maps Satellite", SBS.getUrlGoogleSatellite, "satellite" ],
	[ "Google Maps Hybrid", SBS.getUrlGoogleHybrid, "hybrid" ],
	[ "Open Street Map", SBS.getUrlOsm, "osm" ],
	[ "Open Street Map Humanitarian", SBS.getUrlOsmHot, "osm" ],
	[ "Open Cycle Map", SBS.getUrlCycle, "cycle" ],
	[ "Open Topo", SBS.getUrlTopo, "cycle" ],
	//["MapQuest OSM", "https://otile3.mqcdn.com/tiles/1.0.0/osm/"],
	//["MapQuest Satellite", "https://otile3.mqcdn.com/tiles/1.0.0/sat/"],
	//[ "MapQuest Satellite", SBS.getUrlMQSatellite, "stamen" ],
	[ "Stamen terrain background", SBS.getUrlStamen, "stamen" ],
	[ "Esri", SBS.getUrlEsri, "esri" ],
	[ "Esri Satellite", SBS.getUrlEsriSat, "esri" ],
	//[ "Google Maps Terrain",SBS.getUrlGoogleTerrain ]
	//[ "Open Street Map topo", "http://tile.opentopomap.org/" ],

];


SBS.init = function () {

	const options = SBS.mapOverlays.map( option => `<option>${ option[ 0 ] }`).join( "" )

	const htm = `
	<p>
	Select a type of map to view
	<select oninput=MTL.getTilesBitmaps(SBS.mapOverlays[this.selectedIndex][1]); class=select-resize size=10>${ options }</select>
	</p>`;

	SBSdivSelect.innerHTML = htm;

}


