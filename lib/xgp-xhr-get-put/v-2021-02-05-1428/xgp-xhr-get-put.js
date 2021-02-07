const XGP = {};

//url = "https://cdn.jsdelivr.net/gh/pushme-pullyou/tootoo-2020@master/README.md";
//url = "https://github.com/pushme-pullyou/tootoo-2020/blob/master/README.md"; // Not
//url = "https://pushme-pullyou.github.io/tootoo-2020/README.md";
//url = "https://theo-armour.github.io/qdata/README.md"; // must not have token
//url = "https://github.com/theo-armour/qdata/blob/master/README.md";

//url = "https://api.github.com/repos/theo-armour/qdata/git/trees/master?recursive=1";
//url = "https://api.github.com/repos/pushme-pullyou/tootoo14/contents/js-14-08/add-a-line-test.jsonl";
XGP.url = "https://api.github.com/repos/theo-armour/qdata/contents/LICENSE";

//XGP.url = "https://api.github.com/repos/pushme-pullyou/tootoo-2021/contents/LICENSE.md";

// https://github.com/theo-armour/qdata

XGP.init = function () {

	XGP.accessToken = localStorage.getItem( 'githubAccessToken' ) || "";

	//XGP.requestFile( XGP.url );

	htm = `
<p>
	Access token
	<input id=XGPinpGitHubApiKey onclick=this.select(); onblur=XGP.setGitHubAccessToken(); title="Obtain API Access Token"
	class=full-width >
</p>

<p>
	URL
	<input id=inpUrl onclick=this.select(); onblur=XGP.requestFile(XGP.url); title="Obtain API Access Token"
	class=full-width value=${ XGP.url }>
</p>

<p>
	<button onclick=XGP.getFile()>getFile</button>
	<button onclick=XGP.putFile()>putFile</button>
</p>

<p>
	<button onclick=XGP.getStorage()>getStorage</button>
	<button onclick=XGP.setStorage()>setStorage</button>
</p>

<p>
	<input type=file id=inpFile onchange=XGP.readFile(this);>
	<button onclick=XGP.saveFile()>saveFile</button>
</p>
`;

	XGPdivMenuDetails.innerHTML = htm;

	XGPinpGitHubApiKey.value = XGP.accessToken;

	//XGP.content = divContent.innerText = localStorage.getItem( "file-2021-02-05-text" ) || "";

	XGP.getFile();

};



XGP.setGitHubAccessToken = function () {

	//console.log( 'accessToken', GRVinpGitHubApiKey.value );

	localStorage.setItem( "githubAccessToken", XGPinpGitHubApiKey.value );

	//GRVT.accessToken = accessToken;

};



//////////

XGP.getStorage = function () {

	XGP.content = localStorage.getItem( "file-2021-02-05-text" ) || "";

	divContent.innerText = XGP.content;

};



XGP.setStorage = function() {

	XGP.content = divContent.innerText;

	localStorage.setItem( "file-2021-02-05-text", XGP.content );

};




//////////

XGP.getFile = function () {

	XGP.url = inpUrl.value;
	XGP.requestFile( XGP.url );

};



XGP.requestFile = function ( url = "https://example.com", callback = XGP.onLoad ) {

	const urlCORS = "https://cors-anywhere.herokuapp.com/";

	xhr = new XMLHttpRequest();
	//xhr.open( "GET", urlCORS + url, true );
	xhr.open( "GET", url, true );
	xhr.setRequestHeader( "Authorization", "token " + XGP.accessToken );
	xhr.responseType = "json";
	xhr.onerror = ( xhr ) => console.log( "error:", xhr );
	//xhr.onprogress = ( xhr ) => console.log( "bytes loaded:", xhr.loaded );
	xhr.onload = ( xhr ) => callback( xhr );
	xhr.send( null );

};



XGP.onLoad = function ( xhr ) {

	console.log( "response", xhr );

	XGP.sha = xhr.target.response.sha;
	console.log( "sha", XGP.sha );

	//XGP.content = decodeURI( atob( xhr.target.response.content ) );

	XGP.content = atob( xhr.target.response.content );

	divContent.innerText = XGP.content;

	divHtml.innerHTML = XGP.content;

	divMessage.innerText += `\nGet: ${ new Date().toISOString() } ${ Math.random() }`;

};



XGP.requestSha = function () {

	xhr = new XMLHttpRequest();
	xhr.open( "GET", XGP.url, true );
	xhr.setRequestHeader( "Authorization", "token " + XGP.accessToken );
	xhr.responseType = "json";
	xhr.onerror = ( xhr ) => console.log( "error:", xhr );
	//xhr.onprogress = ( xhr ) => console.log( "bytes loaded:", xhr.loaded );
	xhr.onload = (xhr ) => {
		console.log( "", xhr ); XGP.sha = xhr.target.response.sha; XGP.putFile();
	}
	xhr.send( null );

};


XGP.putFile = function () {

	//const urlApi = "https://api.github.com/repos/theo-armour/qdata/contents/try.md";

	if ( !XGP.sha ) { XGP.requestSha(); return; }

	//console.log( "", XGP );

	const content = divContent.innerText;

	//codedData = window.btoa( encodeURI( content ) ); // encode the string

	codedData = window.btoa( content );

	body = JSON.stringify( {
		"branch": "master",
		"content": codedData,
		"message": `add to file test.md`,
		"sha": XGP.sha

	} ),

	xhr = new XMLHttpRequest();
	//xhr.open( "GET", urlCORS + url, true );
	xhr.open( "PUT", XGP.url, true );
	xhr.setRequestHeader( "Authorization", "token " + XGP.accessToken );
	xhr.setRequestHeader( "Content-Type", "application/json;charset=UTF-8" );
	//xhr.responseType = "text";
	xhr.onerror = ( xhr ) => console.log( "error:", xhr );
	xhr.onprogress = ( xhr ) => console.log( "bytes loaded:", xhr.loaded );
	//xhr.onload = ( xhr ) => console.log( "xhr", xhr.target.response );
	xhr.send( body );

	divMessage.innerText += `\nPut: ${ new Date().toISOString() } ${ Math.random() }`;

};



//////////

XGP.readFile = function ( files ) {

	const reader = new FileReader();
	reader.onload = function ( event ) {

		XGP.content = divContent.innerText = reader.result;

		divMessage.innerText =
`name: ${ files.files[ 0 ].name }
size: ${ files.files[ 0 ].size.toLocaleString() } bytes
type:${ files.files[ 0 ].type }
`;

	};

	reader.readAsText( files.files[ 0 ] );

}



XGP.saveFile = function () {

	const date = new Date().toISOString().slice( 0, 10 )
	const blob = new Blob( [ divContent.innerText ] );
	let a = document.body.appendChild( document.createElement( 'a' ) );
	a.href = window.URL.createObjectURL( blob );
	a.download = `v-${ date }.txt`;
	a.click();
	a = null;

};



//////////

window.addEventListener( 'beforeunload', function ( event ) {

	if ( divContent.innerText !== XGP.content ) {

		// Cancel the event
		event.preventDefault();

		XGP.setStorage();

		// Chrome requires returnValue to be set
		event.returnValue = "";

	}

} );