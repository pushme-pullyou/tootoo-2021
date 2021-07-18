// copyright 2021 Theo Armour. MIT license.


const GTB = {
	user: "pushme-pullyou",
	repo: "tootoo-2021",
	branch: "maim",
	base: "https://api.github.com/repos/pushme-pullyou/tootoo-2021/contents/",
	Date: new Date(),
	defaultFile: "test-cases/text-to-hack.html"
};

GTB.init = ( { } = {} ) => {


	GTB.accessToken = localStorage.getItem( 'githubAccessToken' ) || "";
	GTBinpAccessToken.value = GTB.accessToken;

	const htm = `

<div id=GTBdivMessage ></div>
<div id=GTBdivContent ></div>
`;

	GTBdivTextBox.innerHTML = htm;

	window.addEventListener( "beforeunload", GTB.checkForChange );
	window.addEventListener( 'keyup', GTB.onKeyUp, false ); // Save file Alt--S
	window.addEventListener( 'hashchange', GTB.onHashChange, false );

	GTB.onHashChange();

};



GTB.setGitHubAccessToken = function () {

	localStorage.setItem( "githubAccessToken", GTBinpAccessToken.value );

};



GTB.checkForChange = function ( event ) {

	if ( textareaMain.value === GTB.content ) { return; }

	event.preventDefault();

	event.returnValue = "";

};



GTB.onHashChange = function ( event ) {

	console.log( "location.hash ", location.hash.length );

	if ( GTB.url  === 23 ) {

	} else if ( location.hash.length > 1 ) {

		file = location.hash.slice( 1 );

		GTB.url = `https://api.github.com/repos/${ GTB.user }/${ GTB.repo }/contents/${ file }`;

	} else {

		GTB.url = `https://api.github.com/repos/${ GTB.user }/${ GTB.repo }/contents/${ GTB.defaultFile }`;

	}

	console.log( "GTB.url ", GTB.url );

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

	GTBdivMessage.innerText = `Get:${ new Date().toLocaleString() } bytes:${ content.length } sha:${ GTB.sha }`;
		//TEDdivMenuOpenFile.innerText = `Get:${ new Date().toLocaleString() } bytes:${ content.length }`;

};


/////////


GTB.putFileToGitHub = function () {

	if ( GTB.url === "" ) { alert( "No URL" ); return; }

	const xhr = new XMLHttpRequest();
	xhr.open( "GET", GTB.url, true );
	xhr.setRequestHeader( "Authorization", "token " + GTB.token );
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

	GTB.content = divTEDtext.innerHTML;

	const codedData = window.btoa( GTB.content ); // encode the string

	const body = JSON.stringify( {
		"branch": GTB.branch,
		"content": codedData,
		"message": `add to file`,
		"sha": GTB.sha

	} );

	xhr = new XMLHttpRequest();
	xhr.open( "PUT", GTB.url, true );
	xhr.setRequestHeader( "Authorization", "token " + GTB.token );
	xhr.setRequestHeader( "Content-Type", "application/json" );
	xhr.onerror = ( xhr ) => console.log( "error:", xhr );
	xhr.onprogress = ( xhr ) => console.log( "bytes loaded:", xhr.loaded );
	xhr.send( body );

	TEDdivMenuOpenFile.innerText = `Put: ${ new Date().toLocaleString() } bytes:${ GTB.content.length } sha:${ GTB.sha }`;
	//TEDdivMenuOpenFile.innerText = `Put: ${ new Date().toLocaleString() } bytes:${ GTB.content.length }`;

};