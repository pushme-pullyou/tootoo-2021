const XGP = {};

//url = "https://cdn.jsdelivr.net/gh/pushme-pullyou/tootoo-2020@master/README.md";
//url = "https://github.com/pushme-pullyou/tootoo-2020/blob/master/README.md"; // Not
//url = "https://pushme-pullyou.github.io/tootoo-2020/README.md";
//url = "https://theo-armour.github.io/qdata/README.md"; // must not have token
//url = "https://github.com/theo-armour/qdata/blob/master/README.md";

//url = "https://api.github.com/repos/theo-armour/qdata/git/trees/master?recursive=1";
//url = "https://api.github.com/repos/pushme-pullyou/tootoo14/contents/js-14-08/add-a-line-test.jsonl";
url = "https://api.github.com/repos/theo-armour/qdata/contents/try.md";


XGP.init = function () {

	XGP.accessToken = localStorage.getItem( 'githubAccessToken' ) || "";


	htm = `
<p>
	Access token
	<input id=XGPinpGitHubApiKey onclick=this.select(); onblur=XGP.setGitHubAccessToken(); title="Obtain API Access Token"
	class=full-width >
</p>

<p>
	URL
	<input id=Url onclick=this.select(); onblur=XGP.requestFile(url); title="Obtain API Access Token"
	class=full-width value=${ url }>
</p>

<p><button onclick=XGP.putFile()>putFile</button></p>
`;

	XGPdivMenuDetails.innerHTML = htm;

	XGPinpGitHubApiKey.value = XGP.accessToken;

	XGP.requestFile( url );

};


XGP.setGitHubAccessToken = function() {

	//console.log( 'accessToken', GRVinpGitHubApiKey.value );

	localStorage.setItem( "githubAccessToken", XGPinpGitHubApiKey.value );

	//GRVT.accessToken = accessToken;

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

	XGP.content = atob( xhr.target.response.content );
	divContent.innerText = XGP.content;

};


XGP.putFile = function() {

	//const urlApi = "https://api.github.com/repos/theo-armour/qdata/contents/try.md";

	const content = XGP.content + `\n${ new Date().toISOString() } ${ Math.random() }`; //divContent.innerText;

	codedData = window.btoa( content ); // encode the string

	body = JSON.stringify( {
		"branch": "master",
		"content": codedData,
		"message": `add to file test.md`,
		"sha": XGP.sha

	} ),

		xhr = new XMLHttpRequest();
	//xhr.open( "GET", urlCORS + url, true );
	xhr.open( "PUT", url, true );
	xhr.setRequestHeader( "Authorization", "token " + XGP.accessToken );

	xhr.setRequestHeader( "Content-Type", "application/json;charset=UTF-8" );
	//xhr.responseType = "text";
	xhr.onerror = ( xhr ) => console.log( "error:", xhr );
	xhr.onprogress = ( xhr ) => console.log( "bytes loaded:", xhr.loaded );
	xhr.onload = ( xhr ) => console.log( "xhr", xhr.target.response );
	xhr.send( body );

}
