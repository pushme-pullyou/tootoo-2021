// copyright 2021 Theo Armour. MIT license.


const GTB = {
	user: "pushme-pullyou",
	repo: "tootoo-2021",
	branch: "main",
	file: "test-cases/text-to-hack.html",
	divTextBox: "GTBdivTextBox",
	idMessage:"GTBdivMessage",
	idContent: "GTBdivContent"

};

GTB.init = ( params = {} ) => {

	console.log( "params", params );

	GTB.divTextBox = params.divTextBox || GTB.divTextBox;
	GTB.file = params.file || GTB.file;


	const htm = `
<div>
	<button onclick=GTB.putFileToGitHub() title="Press Alt-S">putToGitHub</button>
	<label>token
	<input id=GTBinpAccessToken onclick=this.select(); onblur=GTB.setGitHubAccessToken();
	title="Obtain GitHub API Access Token">
	</label>
	<div id=${ GTB.idMessage } style=display:inline; ></div>
</div>
<div id=${ GTB.idContent } style="border: 1px #888 solid;overflow:auto;padding: 0.5em;resize:both;" contentEditable ></div>
	`;

	window[ GTB.divTextBox ].innerHTML = htm;

	GTB.accessToken = localStorage.getItem( 'githubAccessToken' ) || "";
	GTBinpAccessToken.value = GTB.accessToken;

	GTB.url = `https://api.github.com/repos/${ GTB.user }/${ GTB.repo }/contents/${ GTB.file }`;


	window.addEventListener( "beforeunload", GTB.checkForChange );
	window.addEventListener( 'keyup', GTB.onKeyUp, false ); // Save file Alt--S
	//window.addEventListener( 'hashchange', GTB.onHashChange, false );

	GTB.requestFile();

};



GTB.setGitHubAccessToken = function () {

	localStorage.setItem( "githubAccessToken", GTBinpAccessToken.value );

};



GTB.checkForChange = function ( event ) {

	if ( textareaMain.value === GTB.content ) { return; }

	event.preventDefault();

	event.returnValue = "";

};



GTB.requestFile = function ( event ) {

	const xhr = new XMLHttpRequest();
	xhr.open( "GET", GTB.url, true );
	xhr.setRequestHeader( "Authorization", "token " + GTB.accessToken );
	xhr.responseType = "json";
	xhr.onerror = ( xhr ) => console.log( "error:", xhr );
	//xhr.onprogress = ( xhr ) => console.log( "bytes loaded:", xhr.loaded );
	xhr.onload = GTB.onLoad;
	xhr.send( null );

};



GTB.onLoad = function ( xhr ) {
	//console.log( "response", xhr );

	GTB.sha = xhr.target.response.sha;

	const content = xhr.target.response.content;

	console.log( "response", xhr.target.response );

	GTBdivContent.innerHTML = atob( content ); //`<textarea id=textareaMain style="" ></textarea>`;

	//textareaMain.value = content;

	GTB.content = content;

	GTBdivMessage.innerText = `Get:${ new Date().toLocaleString() } bytes:${ content.length }`;
	// sha: ${ GTB.sha; }`;

};


/////////


GTB.putFileToGitHub = function () {

	if ( GTB.url === "" ) { alert( "No URL" ); return; }

	const xhr = new XMLHttpRequest();
	xhr.open( "GET", GTB.url, true );
	xhr.setRequestHeader( "Authorization", "token " + GTB.accessToken );
	xhr.responseType = "json";
	xhr.onerror = ( xhr ) => console.log( "error:", xhr );
	//xhr.onprogress = ( xhr ) => console.log( "bytes loaded:", xhr.loaded );
	xhr.onload = ( xhr ) => {
		console.log( "xhr", xhr );
		GTB.sha = xhr.target.response.sha;
		GTB.putFile();
	};
	xhr.send( null );

};



GTB.putFile = function () {

	GTB.content = GTBdivContent.innerHTML;

	console.log( "GTB.content", GTB.content );

	const codedData = window.btoa( GTB.content ); // encode the string

	const body = JSON.stringify( {
		"branch": GTB.branch,
		"content": codedData,
		"message": `add to file`,
		"sha": GTB.sha

	} );

	xhr = new XMLHttpRequest();
	xhr.open( "PUT", GTB.url, true );
	xhr.setRequestHeader( "Authorization", "token " + GTB.accessToken );
	xhr.setRequestHeader( "Content-Type", "application/json" );
	xhr.onerror = ( xhr ) => console.log( "error:", xhr );
	xhr.onprogress = ( xhr ) => console.log( "bytes loaded:", xhr.loaded );
	xhr.send( body );

	GTBdivMessage.innerText = `Put: ${ new Date().toLocaleString() } bytes:${ GTB.content.length }`;
	//+ `sha: ${ GTB.sha; }`;

};
