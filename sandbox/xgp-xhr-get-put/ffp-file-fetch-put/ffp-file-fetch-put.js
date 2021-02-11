// copyright pushMe-pullYou authors. MIT license.


let FFP = {};



FFP.getMenu = function () {

	FFP.personalAccessToken = localStorage.getItem( "FFPpersonalAccessToken" );

	FFP.url = localStorage.getItem( "FFPurl" );

	const htm =
	`
		<details open>

			<summary>File save parameters</summary>

			<p>Save file to GitHub</p>

			<p>Personal access token: <br> <input id=FFPinpPAT class=FFPinput
				onchange=FFP.setLocalStorage(this,"FFPpersonalAccessToken"); value=${ FFP.personalAccessToken}></p>

			<p>URL: <br> <input id=FFPinpUrl class=FFPinput onchange=FFP.setLocalStorage(this,"FFPurl");
				value=${ FFP.url} ></p>

			<p>
				<button id=but onclick=FFP.fetchJsonLines(); >FFP.fetchJsonLines</button>

				<button id=but onclick=FFP.putJsonLines(FFP.fileContent,FFP.fileSha); >FFP.putJsonLines</button>
			</p>

		</details>
	`;

	return htm;

};


FFP.setLocalStorage = function( input, string ) {

	const item = input.value;
	localStorage.setItem( `${ string }`, item );

};



FFP.fetchJsonLines = function() {

	const request = new Request( FFP.url );

	FFP.fileName = FFP.url.split( "/" ).pop();

	fetch( request ).then( response => response.json() )
	.then( ( data ) => {

		console.log( "data", data );
		//divContents.innerText += ( JSON.stringify( data ) );
		//console.log( 'dc', data.content );

		decodedData = window.atob( data.content ).toString( "UTF8" );

		FFP.jsonLines = decodedData.split( "\n" )
		.filter( line => line => JSON.parse( line ) )
		.map( line => JSON.parse( line ) );

		//textArea.value = FFP.jsonLines.map( line => JSON.stringify( line ) ).join( "\n" );

		FFP.fileContent = decodedData;
		FFP.fileSha = data.sha;

		const eventFFPJsonParse = new Event( 'FFPonJsonParse' );

		// document.body.addEventListener( 'FFPonJsonParse', () => {
		//	console.log( 'FFP.jsonLines loaded', FFP.fileName )
		//	ZZZ.onLoadParse( FFP.jsonLines )
		// }, false );

		document.body.dispatchEvent( eventFFPJsonParse );

	} );

};


FFP.putJsonLines = function () {

	const string = BOP.jsonLines.map( jsonl => JSON.stringify( jsonl ) ).join( "\n" );

	const request = new Request( FFP.url );

	//arrayOfLines = content.match(/[^\r\n]+/g);

	//uuid = FFP.getUuidv4();

	//content +=`{ "index": "${ arrayOfLines.length + 1 }", "uuid": "${ uuid }", "date": "${ ( new Date() ).toISOString() }" }\r\n`;

	codedData = window.btoa( string );

	console.log( 'codedData', codedData );

	fetch( request, {
		"branch": "master",
		"committer": {
			"name": "Theo Armour",
			"email": "t.armour@gmail.com"
		},
		method: "PUT",
		headers: { "Authorization": "token " + FFP.personalAccessToken },
		body: JSON.stringify( {
			"content": codedData,
			"message": "add to file",
			"sha": FFP.fileSha
		} )

	} )
	.then( response => response.json() )
	.then( data => {

		//divContents.innerText += ( JSON.stringify( data ) );
		//console.log( "", data );

	} )
	.catch(  err => console.warn( 'Something went wrong.', err ) );

	// 	"branch": "master",
	// "committer": {
	// 	"name": "Theo Armour",
	// 	"email": "t.armour@gmail.com"
	// },

};



FFP.getUuidv4 = function() {

	return ( [ 1e7 ] + -1e3 + -4e3 + -8e3 + -1e11 ).replace( /[018]/g, c =>
		( c ^ crypto.getRandomValues( new Uint8Array( 1 )  )[ 0 ] & 15 >> c / 4 ).toString( 16 )
	);

};


