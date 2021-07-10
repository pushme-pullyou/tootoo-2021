
const JFC = {};


JFC.url = "https://pushme-pullyou.github.io/tootoo-2021/data/jhu-csse/us-county-state-latlon-pop.csv";


JFC.requestFile = function ( url = JFC.url, callback = JFC.onLoadCsv, onParse = JFC.onParseCsv  ) {

	// urlDefaultFile = "https://cdn.jsdelivr.net/gh/pushme-pullyou/tootoo-2020@master/README.md";
	const urlCORS = ""; //https://cors-anywhere.herokuapp.com/";

	xhr = new XMLHttpRequest();
	xhr.open( "GET", urlCORS + url, true );
	xhr.responseType = "text";
	xhr.onerror = ( xhr ) => console.log( "error:", xhr );
	//xhr.onprogress = ( xhr ) => console.log( "bytes loaded:", xhr.loaded );
	xhr.onload = ( xhr ) => callback( xhr.target.response, onParse );
	xhr.send( null );

};



JFC.onLoadCsv = function ( response, onParse ) {

	//console.log( "response", response );

	lines = response.split( /\n/ ).map( line => line.split( "," ) );

	JFC.json = lines;

	onParse();


};

JFC.onParseCsv = function () {
	
	console.log( "", 33 );

	console.log( "JFC.json", JFC.json );

	divMainContent.textContent = JFC.json;

}