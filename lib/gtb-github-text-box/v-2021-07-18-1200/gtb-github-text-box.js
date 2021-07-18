// copyright 2021 Theo Armour. MIT license.


const GTB = function () {

	this.user = "pushme-pullyou";
	this.repo = "tootoo-2021";
	this.branch = "main";
	this.file = "test-cases/text-to-hack.html";
	this.divTextBox = "GTBdivTextBox";
	this.idMessage = "GTBdivMessage";
	this.idContent = "GTBdivContent";
	this.idButPut = "GTBbutPut";



	this.init = ( params = {} ) => {

		//console.log( "params", params );

		this.divTextBox = params.divTextBox || this.divTextBox;
		this.idMessage = params.idMessage || this.idMessage;
		this.idContent = params.idContent || this.idContent;
		this.idButPut = params.idButPut || this.idButPut;
		this.file = params.file || this.file;

		this.accessToken = localStorage.getItem( 'githubAccessToken' ) || "";

		this.url = `https://api.github.com/repos/${ this.user }/${ this.repo }/contents/${ this.file }`;


		const htm = `
<div>
	<button id=${ this.idButPut } title="Press Alt-S">putToGitHub</button>

	<div id=${ this.idMessage } style=display:inline; >
	</div>
</div>
<div id=${ this.idContent } style="border: 1px #888 solid;overflow:auto;padding: 0.5em;resize:both;" contentEditable ></div>
	`;

		window[ this.divTextBox ].innerHTML = htm;

		
		window.addEventListener( 'keyup', this.onKeyUp, false ); // Save file Alt--S
		//window.addEventListener( 'hashchange', this.onHashChange, false );

		window[ this.idButPut ].onclick = () => this.putFileToGitHub( this.url );

		//window[ this.idButPut ].onclick = (event) => this.checkForChange(event)

		this.requestFile();

	};



	this.checkForChange = function ( event ) {

		console.log( "event", window[ this.idContent ].innerHTML, this.contentHtm );

		if ( window[ this.idContent ].innerHTML === this.contentHtm ) {
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
		//console.log( "response", xhr );

		this.sha = xhr.target.response.sha;
		const content = xhr.target.response.content;
		console.log( "response", xhr.target.response );
		const htm = atob( content );

		window[ this.idContent ].innerHTML = htm;

		this.content = content;
		this.contentHtm = htm;

		window[ this.idMessage ].innerText = `Get:${ new Date().toLocaleString() } bytes:${ content.length }`;
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

		this.content = window[ this.idContent ].innerHTML;
		//console.log( "this.content", this.content );

		const codedData = window.btoa( this.content ); // encode the string

		const body = JSON.stringify( {
			"branch": this.branch,
			"content": codedData,
			"message": `add to file`,
			"sha": this.sha

		} );

		xhr = new XMLHttpRequest();
		xhr.open( "PUT", this.url, true );
		xhr.setRequestHeader( "Authorization", "token " + this.accessToken );
		xhr.setRequestHeader( "Content-Type", "application/json" );
		xhr.onerror = ( xhr ) => console.log( "error:", xhr );
		xhr.onprogress = ( xhr ) => console.log( "bytes loaded:", xhr.loaded );
		xhr.send( body );

		window[ this.idMessage ].innerText = `Put: ${ new Date().toLocaleString() } bytes:${ this.content.length }`;
		//+ `sha: ${ this.sha; }`;

	};

};
