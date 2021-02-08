

function getSDGData () {

	const api = "https://en.wikipedia.org/w/api.php?";

	const query = "action=parse&format=json&page=";

	const article = "List_of_Sustainable_Development_Goal_targets_and_indicators";

	//const article = "Template:COVID-19_pandemic_data";

	requestFile( api + query + article, onLoadSDG );

}



function requestFile ( url = "https://example.com", callback = onLoad ) {

	//console.log( "url", url );

	// urlDefaultFile = "https://cdn.jsdelivr.net/gh/pushme-pullyou/tootoo-2020@master/README.md";
	const urlCORS = "https://cors-anywhere.herokuapp.com/";

	xhr = new XMLHttpRequest();
	xhr.open( "GET", urlCORS + url, true );
	//xhr.responseType = "json";
	xhr.onerror = ( xhr ) => console.log( "error:", xhr );
	//xhr.onprogress = ( xhr ) => console.log( "bytes loaded:", xhr.loaded );
	xhr.onload = ( xhr ) => callback( xhr );
	xhr.send( null );

}



function onLoadSDG ( xhr ) {

	//console.log( "response", response.parse.text );

	//console.log( '', xhr.target.response );

	const response = xhr.target.response;

	const json = JSON.parse( response );
	//console.log( 'json', json );

	text = json.parse.text[ "*" ];
	//console.log( 'text', text );

	//divContent.innerHTML =

	text = text.replace( /\[(.*?)\]/g, "" );

	const parser = new DOMParser();
	const html = parser.parseFromString( text, "text/html" );

	const tables = html.querySelectorAll( ".wikitable" );
	//console.log( tables[ 0 ] );

	trs = tables[ 0 ].querySelectorAll( "tr" );
	//console.log( 'rows', rows );

	rows = Array.from( trs ).map( row => Array.from( row.children ) ); //.map( child => { child.innerText.replace( /\n/g, "") ).join( "") ).join( "\n")

	//console.log( "", rows );

	text = rows.map( row => {

		if ( row[ 0 ].innerText.startsWith( "\nGoal" ) ) {
			return `</details><details><summary class=sum1 >${ row[ 0 ].innerText }</summary>`;
		}

		if ( row.length === 3 ) {
			//console.log( "", row.map( item => item.innerText ) );
			return `<h2>Target</h2><div>${ row[ 0 ].innerText }</div>
						<b>Indicators</b><div>${ row[ 1 ].innerText } ${ row[ 2 ].innerText }</div>
						`;
		}

		return `<div>${ row[ 0 ].innerText } ${ row[ 1 ].innerText }</div>`;

	} ).join( "" );


	divContent.innerHTML = text + "</details>";

	//let vals = Array.from( trs ).slice( ).map( tr => tr.innerText ) //.trim().replace( /\[(.*?)\]/g, "" ).split( "\n" ) ).sort();
	//console.log( 'vals', vals );

	// rows = Array.from( trs ).slice().map( tr => tr.children.forEach( child => child.innerText ) ) //.trim().replace( /\[(.*?)\]/g, "" ).split( "\n" ) ).sort();
	// console.log( 'rows', rows );

	//divContent.innerHTML =

}
