

// XMLHTTPRequest GitHub Push (XGP)

const XGP = {
	user: "theo-armour",
	repo: "qdata",
	branch: "master",
	base: "https://api.github.com/repos/theo-armour/qdata/contents/",
	Date: new Date(),
	defaultFile: "README.md"
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

	window.addEventListener( 'hashchange', XGP.onHashChange, false );

	XGP.onHashChange();

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

	divTEDtext.innerHTML = `<textarea id=textareaMain style="" ></textarea>`;

	textareaMain.value = content;

	XGP.content = content;

	if ( window.divMessage ) {

		//divMessage.innerText = `Get:${ new Date().toLocaleString() } bytes:${ content.length } sha:${ XGP.sha }`;
		divMessage.innerText = `Get:${ new Date().toLocaleString() } bytes:${ content.length }`;

	}

};


