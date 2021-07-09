
const JFC = {};

JFC.url = "https://theo-armour.github.io/maps-2021/data/soil-carbon-coalition/indemnities1979_2017.csv"


JFC.requestFile = function ( url = JFC.url, callback = JFC.onLoad ) {

	// urlDefaultFile = "https://cdn.jsdelivr.net/gh/pushme-pullyou/tootoo-2020@master/README.md";
	const urlCORS = ""; //https://cors-anywhere.herokuapp.com/";

	xhr = new XMLHttpRequest();
	xhr.open( "GET", urlCORS + url, true );
	xhr.responseType = "text";
	xhr.onerror = ( xhr ) => console.log( "error:", xhr );
	//xhr.onprogress = ( xhr ) => console.log( "bytes loaded:", xhr.loaded );
	xhr.onload = ( xhr ) => callback( xhr.target.response );
	xhr.send( null );

};



JFC.onLoad = function ( response ) {

	//console.log( "response", response );

	lines = response.split( /\n/ ).map( line => line.split( "," ) );

	console.log( "lines", lines );

};