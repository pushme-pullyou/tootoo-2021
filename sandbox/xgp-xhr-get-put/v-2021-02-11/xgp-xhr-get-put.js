const XGP = {};

//url = "https://cdn.jsdelivr.net/gh/pushme-pullyou/tootoo-2020@master/README.md";
//url = "https://github.com/pushme-pullyou/tootoo-2020/blob/master/README.md"; // Not
//url = "https://pushme-pullyou.github.io/tootoo-2020/README.md";
//url = "https://theo-armour.github.io/qdata/README.md"; // must not have token
//url = "https://github.com/theo-armour/qdata/blob/master/README.md";

//url = "https://api.github.com/repos/theo-armour/qdata/git/trees/master?recursive=1";
//url = "https://api.github.com/repos/pushme-pullyou/tootoo14/contents/js-14-08/add-a-line-test.jsonl";
XGP.url = "https://api.github.com/repos/theo-armour/qdata/contents/try.md";

// https://github.com/theo-armour/qdata

XGP.init = function () {

	XGP.accessToken = localStorage.getItem( 'githubAccessToken' ) || "";

	//XGP.requestFile( XGP.url );

	htm = `
<details>
<summary id=XGPsumDetails class="summary-primary gmd-1">Edit Files</summary>
<p>
	Access token<br>
	<input id=XGPinpAccessToken onclick=this.select(); onblur=XGP.setGitHubAccessToken(); title="Obtain GitHub API Access Token"
	class=full-width >
</p>

<p>
	<button onclick=XGP.getFileFromGitHub()>getFileFromGitHub</button>
	<button onclick=XGP.putFileToGitHub()>putFile</button>
</p>

<p>
	URL
	<input id=XGPinpUrl onclick=this.select(); onblur=XGP.requestFile(XGP.url); title="Obtain API Access Token"
	class=full-width value=${ XGP.url }>
</p>

<p>
	<button onclick=XGP.getStorage()>getStorage</button>
	<button onclick=XGP.setStorage()>setStorage</button>
</p>

<p>
	<input type=file id=inpFile onchange=XGP.readFile(this);>
	<button onclick=XGP.saveFile()>saveFile</button>
</p>
<div id=divMessage></div>
</details>
`;

	XGPdivMenuDetails.innerHTML = htm;

	XGPinpAccessToken.value = XGP.accessToken;

	//XGP.content = divContentMain.value = localStorage.getItem( "file-2021-02-05-text" ) || "";

	//XGP.getFile();

};



XGP.setGitHubAccessToken = function () {

	localStorage.setItem( "githubAccessToken", XGPinpAccessToken.value );

};



//////////

XGP.getFileFromGitHub = function() {

	path = location.hash ? location.hash.slice( 1 ) : COR.defaultFile;

	XGP.url = `https://api.github.com/repos/${ COR.user }/${ COR.repo }/contents/${ path }`;

	divContentMain.innerHTML = "<textarea id='textareaMain'style=height:100vh;width:100%; ></textarea>";

	XGPinpUrl.value = XGP.url;

	const xhr = new XMLHttpRequest();
	xhr.open( "GET", XGP.url, true );
	xhr.setRequestHeader( "Authorization", "token " + XGPinpAccessToken.value );
	xhr.responseType = "json";
	xhr.onerror = ( xhr ) => console.log( "error:", xhr );
	//xhr.onprogress = ( xhr ) => console.log( "bytes loaded:", xhr.loaded );
	xhr.onload = XGP.onLoad;
	xhr.send( null );

};



XGP.onLoad = function( xhr ) {

	//console.log( "response", xhr );

	XGP.sha = xhr.target.response.sha;

	const content = atob( xhr.target.response.content );

	textareaMain.value = content;

	divMessage.innerText = `Get:${ new Date().toLocaleString() } bytes:${ content.length } sha:${ XGP.sha }`;

};



XGP.putFileToGitHub = function () {

	XGP.requestSha();

	// if ( !XGP.sha ) { XGP.requestSha(); return; }

	// XGP.putFile();

}

XGP.requestSha = function() {

	const xhr = new XMLHttpRequest();
	xhr.open( "GET", XGP.url, true );
	xhr.setRequestHeader( "Authorization", "token " + XGP.accessToken );
	xhr.responseType = "json";
	xhr.onerror = ( xhr ) => console.log( "error:", xhr );
	//xhr.onprogress = ( xhr ) => console.log( "bytes loaded:", xhr.loaded );
	xhr.onload = ( xhr ) => {
		//console.log( "", xhr );
		XGP.sha = xhr.target.response.sha;
		XGP.putFile();
	};
	xhr.send( null );

};


XGP.putFile = function () {

	const content = textareaMain.value;

	const codedData = window.btoa( content ); // encode the string

	const body = JSON.stringify( {
		"branch": "master",
		"content": codedData,
		"message": `add to file`,
		"sha": XGP.sha

	} );

	xhr = new XMLHttpRequest();
	xhr.open( "PUT", XGP.url, true );
	xhr.setRequestHeader( "Authorization", "token " + XGP.accessToken );
	xhr.setRequestHeader( "Content-Type", "application/json" );
	xhr.onerror = ( xhr ) => console.log( "error:", xhr );
	xhr.onprogress = ( xhr ) => console.log( "bytes loaded:", xhr.loaded );
	xhr.send( body );

	divMessage.innerText = `Put: ${ new Date().toLocaleString() } bytes:${ content.length } sha:${ XGP.sha }`;

};


XGP.vvvrequestSha = function () {

	xhr = new XMLHttpRequest();
	xhr.open( "GET", XGP.url, true );
	xhr.setRequestHeader( "Authorization", "token " + XGP.accessToken );
	xhr.responseType = "json";
	xhr.onerror = ( xhr ) => console.log( "error:", xhr );
	//xhr.onprogress = ( xhr ) => console.log( "bytes loaded:", xhr.loaded );
	xhr.onload = ( xhr ) => {
		console.log( "", xhr ); XGP.sha = xhr.target.response.sha; XGP.putFile();
	};
	xhr.send( null );

};


XGP.nnnputFile = function () {

	//const urlApi = "https://api.github.com/repos/theo-armour/qdata/contents/try.md";

	if ( !XGP.sha ) { XGP.requestSha(); return; }

	//console.log( "", XGP );

	XGP.content = divContentMain.value;

	codedData = window.btoa( XGP.content ); // encode the string

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

XGP.getStorage = function () {

	XGP.content = localStorage.getItem( "file-2021-02-05-text" ) || "";

	divContentMain.value = XGP.content;

};



XGP.setStorage = function() {

	XGP.content = divContentMain.value;

	localStorage.setItem( "file-2021-02-05-text", XGP.content );

};





//////////

XGP.readFile = function ( files ) {

	const reader = new FileReader();
	reader.onload = function ( event ) {

		XGP.content = divContentMain.value = reader.result;

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
	const blob = new Blob( [ divContentMain.value ] );
	let a = document.body.appendChild( document.createElement( 'a' ) );
	a.href = window.URL.createObjectURL( blob );
	a.download = `v-${ date }.txt`;
	a.click();
	a = null;

	XGP.content = divContentMain.value;

};



//////////

window.addEventListener( 'beforeunload', function ( event ) {

	if ( divContentMain.value === XGP.content ) {
		return;
	}

		// Cancel the event
		event.preventDefault();

		XGP.setStorage();

		// Chrome requires returnValue to be set
		event.returnValue = "";


} );