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

		</details>
	`;

	return htm;

};


FFP.setLocalStorage = function( input, string ) {

	const item = input.value;
	localStorage.setItem( `${ string }`, item );

};


FFP.fetchALine = function() {

	const request = new Request( FFP.url )

	fetch( request ).then( ( response ) => {

		if ( response.ok ) {

			return response.json();

		} else {

			return Promise.reject( response );

		}

	} ).then( ( data ) => {

		console.log( "data", data );

		//divContents.innerText += (JSON.stringify( data ) );

		console.log( 'dc', data.content );

		decodedData = window.atob( data.content ); // decode the string

		//textArea.value = decodedData;

		arrayOfJsonLines = decodedData.match( /[^\r\n]+/g ).map( line => JSON.parse( line ) );

		textArea.value = arrayOfJsonLines.map( line => JSON.stringify( line ) ).join( "\n" );

		logFileContent = decodedData;
		logFileSha = data.sha


	} ).catch( ( err ) => {

		console.warn( 'Something went wrong.', err );

	} );

};


FFP.addaLine = function ( content = "", sha ) {

	const strings = BOP.jsonLines.map( jsonl => JSON.stringify( jsonl ) ).join( "\n" );

	const request = new Request( url );

	arrayOfLines = content.match(/[^\r\n]+/g);

	uuid = FFP.getUuidv4();

	content +=`{ "index": "${ arrayOfLines.length + 1 }", "uuid": "${ uuid }", "date": "${ ( new Date() ).toISOString() }" }\r\n`;

	codedData = window.btoa( content ); // decode the string

	fetch( request, {
		method: "PUT",
		headers: { "Authorization": "token " + FFP.personalAccessToken },
		body: JSON.stringify( {
			"content": codedData,
			"message": "add to file",
			"sha": logFileSha
		} ),

	} )
	.then( response => response.json() )
	.then( data => {

		divContents.innerText += (JSON.stringify( data ) );

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
