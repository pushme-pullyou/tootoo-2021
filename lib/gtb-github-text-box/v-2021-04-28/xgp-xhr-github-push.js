// copyright 2020 Theo Armour. MIT license.
// name from: XMLHTTPRequest GitHub Push (XGP)

const XGP = {
	user: "theo-armour",
	repo: "qdata",
	branch: "master",
	base: "https://api.github.com/repos/theo-armour/qdata/contents/",
	Date: new Date(),
	defaultFile: "sandbox/html-samples/html-sample-1.html"
};

XGP.init = () => {

	XGP.title = document.title ? document.title : location.href.split( "/" ).pop().slice( 0, - 5 ).replace( /-/g, " " );
	XGP.token = COR.token;
	XGP.user = COR.user || "pushme-pullyou";
	XGP.repo = COR.repo || "tootoo-2021";
	XGP.branch = COR.branch || "main";
	XGP.path = COR.path || "../../../";

	XGP.source = COR.source;
	XGP.version = COR.version;
	XGP.description = COR.description;

	const htm  = `

<details id=XGPdetTest>

	<summary class="summary-primary gmd-1" title="View selected items">

		Test Menu

		<span class="info">
			<img class=infoImg src="${ XGP.path }/lib/assets/icons/noun_Information_585560.svg">
			<div class="infoTooltip gmd-5">
			<div>${ XGP.description }</div>
			version <span>${ XGP.version }</span>
			</div>
		</span>


	</summary>

	<div class=divNavResize>

		<p>
			<button onclick=location.hash="LICENSE" >license</button>

			<button onclick=location.hash="README.md" >read me</button>
		</p>

	</div>

	<div id=XGPdivLog></div>

</details>`;

	XGPdivTemplate.innerHTML = htm;

	window.addEventListener( "beforeunload", XGP.checkForChange );
	window.addEventListener( 'keyup', XGP.onKeyUp, false ); // Save file Alt--S
	window.addEventListener( 'hashchange', XGP.onHashChange, false );

	XGP.onHashChange();

};



XGP.checkForChange = function ( event ) {

	if ( textareaMain.value === XGP.content ) { return; }

	event.preventDefault();

	event.returnValue = "";

};



XGP.onHashChange = function ( event ) {

	console.log( "location.hash ", location.hash.length );

	if ( XGP.url  === 23 ) {

	} else if ( location.hash.length > 1 ) {

		file = location.hash.slice( 1 );

		XGP.url = `https://api.github.com/repos/${ XGP.user }/${ XGP.repo }/contents/${ file }`;

	} else {

		XGP.url = `https://api.github.com/repos/${ XGP.user }/${ XGP.repo }/contents/${ XGP.defaultFile }`;

	}

	console.log( "XGP.url ", XGP.url );

	const xhr = new XMLHttpRequest();
	xhr.open( "GET", XGP.url, true );
	xhr.setRequestHeader( "Authorization", "token " + XGP.token );
	xhr.responseType = "json";
	xhr.onerror = ( xhr ) => console.log( "error:", xhr );
	//xhr.onprogress = ( xhr ) => console.log( "bytes loaded:", xhr.loaded );
	xhr.onload = XGP.onLoad;
	xhr.send( null );

};



XGP.onLoad = function ( xhr ) {
	//console.log( "response", xhr );

	XGP.sha = xhr.target.response.sha;

	const content = atob( xhr.target.response.content );

	divContentMain.innerHTML = content; //`<textarea id=textareaMain style="" ></textarea>`;

	//textareaMain.value = content;

	XGP.content = content;

	if ( divMessage ) {

		divMessage.innerText = `Get:${ new Date().toLocaleString() } bytes:${ content.length } sha:${ XGP.sha }`;
		//TEDdivMenuOpenFile.innerText = `Get:${ new Date().toLocaleString() } bytes:${ content.length }`;

	}

};


/////////


XGP.putFileToGitHub = function () {

	if ( XGP.url === "" ) { alert( "No URL" ); return; }

	const xhr = new XMLHttpRequest();
	xhr.open( "GET", XGP.url, true );
	xhr.setRequestHeader( "Authorization", "token " + XGP.token );
	xhr.responseType = "json";
	xhr.onerror = ( xhr ) => console.log( "error:", xhr );
	//xhr.onprogress = ( xhr ) => console.log( "bytes loaded:", xhr.loaded );
	xhr.onload = ( xhr ) => {
		console.log( "xhr", xhr );
		XGP.sha = xhr.target.response.sha;
		XGP.putFile();
	};
	xhr.send( null );

};



XGP.putFile = function () {

	XGP.content = divTEDtext.innerHTML;

	const codedData = window.btoa( XGP.content ); // encode the string

	const body = JSON.stringify( {
		"branch": XGP.branch,
		"content": codedData,
		"message": `add to file`,
		"sha": XGP.sha

	} );

	xhr = new XMLHttpRequest();
	xhr.open( "PUT", XGP.url, true );
	xhr.setRequestHeader( "Authorization", "token " + XGP.token );
	xhr.setRequestHeader( "Content-Type", "application/json" );
	xhr.onerror = ( xhr ) => console.log( "error:", xhr );
	xhr.onprogress = ( xhr ) => console.log( "bytes loaded:", xhr.loaded );
	xhr.send( body );

	TEDdivMenuOpenFile.innerText = `Put: ${ new Date().toLocaleString() } bytes:${ XGP.content.length } sha:${ XGP.sha }`;
	//TEDdivMenuOpenFile.innerText = `Put: ${ new Date().toLocaleString() } bytes:${ XGP.content.length }`;

};
