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


`;


	//XGPdivMenuDetails.innerHTML = htm;

	inpGitHubApiKey.value = XGP.accessToken;

	//XGP.content = textareaMain.value = localStorage.getItem( "file-2021-02-05-text" ) || "";


	window.addEventListener( "hashchange", XGP.onHashChange );

	XGP.onHashChange();

};



XGP.setGitHubAccessToken = function () {

	//console.log( 'accessToken', GRVinpGitHubApiKey.value );

	localStorage.setItem( "githubAccessToken", XGPinpGitHubApiKey.value );

	//GRVT.accessToken = accessToken;

};


XGP.onHashChange = function (){

	XGP.url = location.hash ? location.hash.slice( 1 ) : XGP.url;

	inpUrl.value = XGP.url;

	XGP.getFile();
};

//////////

XGP.getFile = function () {

	//XGP.url = inpUrl.value;
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

	//console.log( "response", xhr );

	XGP.sha = xhr.target.response.sha;
	//console.log( "sha", XGP.sha );

	XGP.content = atob( xhr.target.response.content );

	textareaMain.value = XGP.content;

	divMessage.innerText = `Get:${ new Date().toLocaleString() } bytes:${ XGP.content.length } sha:${ XGP.sha }`;

};



XGP.requestSha = function () {

	xhr = new XMLHttpRequest();
	xhr.open( "GET", XGP.url, true );
	xhr.setRequestHeader( "Authorization", "token " + XGP.accessToken );
	xhr.responseType = "json";
	xhr.onerror = ( xhr ) => console.log( "error:", xhr );
	//xhr.onprogress = ( xhr ) => console.log( "bytes loaded:", xhr.loaded );
	xhr.onload = ( xhr ) => {
		//console.log( "", xhr );
		XGP.sha = xhr.target.response.sha; XGP.putFile();
	};
	xhr.send( null );

};


XGP.putFile = function () {

	//const urlApi = "https://api.github.com/repos/theo-armour/qdata/contents/try.md";

	if ( !XGP.sha ) { XGP.requestSha(); return; }

	//console.log( "", XGP );

	XGP.content = textareaMain.value;

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

	divMessage.innerText =
		`Put: ${ new Date().toLocaleString() } bytes:${ XGP.content.length } sha:${ XGP.sha }`;

};



//////////

XGP.getStorage = function () {

	XGP.content = localStorage.getItem( "file-2021-02-05-text" ) || "";

	textareaMain.value = XGP.content;

};



XGP.setStorage = function () {

	XGP.content = textareaMain.value;

	localStorage.setItem( "file-2021-02-05-text", XGP.content );

};


//////////

XGP.readFile = function ( files ) {

	const reader = new FileReader();
	reader.onload = function ( event ) {

		XGP.content = textareaMain.value = reader.result;

		divMessage.innerText =
			`name: ${ files.files[ 0 ].name }
size: ${ files.files[ 0 ].size.toLocaleString() } bytes
type:${ files.files[ 0 ].type }
`;

	};

	reader.readAsText( files.files[ 0 ] );

};



XGP.saveFile = function () {

	const date = new Date().toISOString().slice( 0, 10 );
	const blob = new Blob( [ textareaMain.value ] );
	let a = document.body.appendChild( document.createElement( 'a' ) );
	a.href = window.URL.createObjectURL( blob );
	a.download = `v-${ date }.txt`;
	a.click();
	a = null;

	XGP.content = textareaMain.value;

};



//////////

window.addEventListener( 'beforeunload', function ( event ) {

	if ( textareaMain.value === XGP.content ) {
		return;
	}

	// Cancel the event
	event.preventDefault();

	XGP.setStorage();

	// Chrome requires returnValue to be set
	event.returnValue = "";


} );