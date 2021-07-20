// copyright 2021 Theo Armour. MIT license.
//* global  */
// jshint esversion: 6
// jshint loopfunc: true

function GTB() {

	this.user = "pushme-pullyou";
	this.repo = "tootoo-2021";
	this.branch = "main";
	this.file = "test-cases/text-to-hack.html";
	this.idDivTextBox = "GTBdivTextBox";
	this.idMessage = "GTBdivMessage";
	this.idContent = "GTBdivContent";
	this.idButPut = "GTBbutPut";


	this.init = ( params = {} ) => {
		//console.log( "params", params );

		this.accessToken = localStorage.getItem( 'githubAccessToken' ) || "";

		this.idDivTextBox = params.idDivTextBox || this.idDivTextBox;
		this.idMessage = params.idMessage || this.idMessage;
		this.idContent = params.idContent || this.idContent;
		this.idButPut = params.idButPut || this.idButPut;
		this.file = params.file || this.file;

		this.url = `https://api.github.com/repos/${ this.user }/${ this.repo }/contents/${ this.file }`;

		this.divTextBox = window[ this.idDivTextBox ];

		const htm = `
<div>
	<button id=${ this.idButPut } title="Press Alt-S">putToGitHub</button>
	<div id=${ this.idMessage } style=display:inline; ></div>
</div>
<div id=${ this.idContent } style="border: 1px #888 solid;overflow:auto;padding: 0.5em;resize:both;" contentEditable ></div>
	`;

		this.divTextBox.innerHTML = htm;

		this.divContent = window[ this.idContent ];
		console.log( "this.divContent ", this.divContent );

		this.divMessage = window[ this.idMessage ];

		window[ this.idButPut ].onclick = () => this.putFileToGitHub( this.url );

		this.requestFile();

		window.addEventListener( "beforeunload", this.checkForChange, false );

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

		this.sha = xhr.target.response.sha;
		this.content = xhr.target.response.content;
		this.htm = atob( this.content );
		this.divContent.innerHTML = this.htm;
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

		this.content = this.divContent.innerHTML;

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