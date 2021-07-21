// copyright 2021 Theo Armour. MIT license.
//* global  */
// jshint esversion: 6
// jshint loopfunc: true

function GTB() {

	this.user = "pushme-pullyou";
	this.repo = "tootoo-2021";
	this.branch = "master";
	this.file = "test-cases/text-to-hack.html";
	this.id = 1;


	this.init = ( params = {} ) => {
		//console.log( "params", params );

		this.accessToken = localStorage.getItem( 'githubAccessToken' ) || "";
		//console.log( "params", params );
		this.user = params.user || this.user;
		this.repo = params.repo || this.repo;
		this.branch = params.branch || this.branch;
		this.file = params.file || this.file;
		this.id = params.id || this.id;
		console.log( "this.id", this.id );

		this.url = `https://api.github.com/repos/${ this.user }/${ this.repo }/contents/${ this.file }`;

		this.divTextBox = window[ `GTBdivTextBox${ this.id }` ];

		const htm = `
<div>
	<button id=idButPut${ this.id }>putToGitHub</button>
	<div id=idMessage${ this.id } style=display:inline; ></div>
	Ed<input type=checkbox id=idChkEdit${ this.id } checked>
	Htm<input type=checkbox id=idChkHtml${ this.id }>
</div>
<div id=idContent${ this.id } style="border: 1px #888 solid;padding: 0.5em;" contentEditable ></div>
	`;

		this.divTextBox.innerHTML = htm;

		this.divContent = window[ `idContent${ this.id }` ];
		//console.log( "this.divContent ", this.divContent );

		this.divMessage = window[ `idMessage${ this.id }` ];

		const put = window[ `idButPut${ this.id }` ];

		put.onclick = () => { this.putFileToGitHub( this.url ); };

		const chk = window[ `idChkEdit${ this.id }` ];

		chk.onclick = () => { this.divContent.contentEditable = chk.checked; };

		this.chkHtm = window[ `idChkHtml${ this.id }` ];

		this.chkHtm.onclick = () => {

			console.log( "chkHtm.checked", this.chkHtm.checked );

			if ( this.chkHtm.checked ) {

				this.divContent.innerText = this.divContent.innerHTML;

			} else {

				this.divContent.innerHTML = this.divContent.innerText;

			};

		};

		this.requestFile();

		//window.addEventListener( "beforeunload", this.checkForChange, false );

	};



	this.checkForChange = function ( event ) {

		console.log( "event", this.divContent.innerHTML, this.contentHtml );

		if ( this.divContent.innerHTML === this.contentHtml ) {
			console.log( "equal" );
			return;
		} else {

			console.log( "not equal" );
		}

		event.preventDefault();

		event.returnValue = "Are you sure you want to exit?";

	};



	this.requestFile = function ( event ) {

		const xhr = new XMLHttpRequest();
		xhr.open( "GET", this.url, true );
		xhr.setRequestHeader( "Authorization", "token " + this.accessToken );
		xhr.responseType = "json";
		xhr.onerror = ( xhr ) => console.log( "error:", xhr );
		//xhr.onprogress = ( xhr ) => console.log( "bytes loaded:", xhr.loaded );
		xhr.onload = ( xhr ) => this.onLoad( xhr );
		xhr.send( null );

	};



	this.onLoad = function ( xhr ) {

		console.log( "xhr.target.response", xhr.target.response);
		this.sha = xhr.target.response.sha;
		this.content = xhr.target.response.content;
		this.htm = atob( this.content );
		this.divContent.innerHTML = this.htm;
		//console.log( "htm", this.htm );
		this.divMessage.innerText = `Get:${ new Date().toLocaleString() } bytes:${ this.content.length }`;
		// sha: ${ this.sha; }`;

	};


	/////////


	this.putFileToGitHub = function ( url ) {

		if ( url === "" ) { alert( "No URL" ); return; }
		//console.log( "this.url", url );

		const xhr = new XMLHttpRequest();
		xhr.open( "GET", url, true );
		xhr.setRequestHeader( "Authorization", "token " + this.accessToken );
		xhr.responseType = "json";
		xhr.onerror = ( xhr ) => console.log( "error:", xhr );
		//xhr.onprogress = ( xhr ) => console.log( "bytes loaded:", xhr.loaded );
		xhr.onload = ( xhr ) => {
			//console.log( "xhr", xhr );
			this.sha = xhr.target.response.sha;
			this.putFile();
		};
		xhr.send( null );

	};



	this.putFile = function () {

		this.content = this.chkHtm.checked ? this.divContent.innerText : this.divContent.innerHTML;

		const codedData = window.btoa( this.content ); // encode the string

		const body = JSON.stringify( {
			"branch": this.branch,
			"content": codedData,
			"message": `add to file`,
			"sha": this.sha

		} );

		const xhr = new XMLHttpRequest();
		xhr.open( "PUT", this.url, true );
		xhr.setRequestHeader( "Authorization", "token " + this.accessToken );
		xhr.setRequestHeader( "Content-Type", "application/json" );
		xhr.onerror = ( xhr ) => console.log( "error:", xhr );
		xhr.onprogress = ( xhr ) => console.log( "bytes loaded:", xhr.loaded );
		xhr.send( body );

		this.divMessage.innerText = `Put: ${ new Date().toLocaleString() } bytes:${ this.content.length }`;
		//+ `sha: ${ this.sha; }`;

	};

}
