const base = "https://api.github.com/repos/pushme-pullyou/tootoo-2021/contents/";
//const base = "../../../";

const CKE = {

	urlDefault: base + "sandbox/notesy/lorem.html",


};



CKE.init = function ( url = CKE.url ) {

	CKE.url = url;

	//CKEspnTitle = location.href.split( '/' ).pop().slice().replace( /-/g, ' ' );

	//CKEspnTitle = document.title ? document.title : location.href.split( '/' ).pop().slice( 0, - 5 ).replace( /-/g, ' ' );

	//CKEspnVersion = document.head.querySelector( "[ name=date ]" ).content;

	htm = `
<h2 style=display:inline;margin:0 >

<a href="${ CKE.url }" target="_blank"
	title="source code on GitHub"><img
	src=https://pushme-pullyou.github.io/tootoo-2021/lib/assets/icons/mark-github.svg>
</a>

<a href="" title="Click this menu title to reset the file">
	<span id=CKEspnTitle></span>
</a>

<button onclick=CKE.putFileToGitHub() title="Press Alt-S">putToGitHub</button>

</h2>

<span id="CKEspnMessage"></span>

<div id="container">
	<div class="editor"></div>
</div>

<div id="wordCount"></div>

`;

	CKEdivCkeditor.innerHTML = htm;

	CKE.accessToken = localStorage.getItem( 'githubAccessToken' ) || "";
	//console.log( "CKE.accessToken", CKE.accessToken );
	//CKEinpAccessToken.value = CKE.accessToken;


	window.addEventListener( "hashchange", CKE.onHashChange, false );
	window.addEventListener( "beforeunload", CKE.checkForChange );
	window.addEventListener( 'keyup', CKE.onKeyUp, false ); // Save file Alt--S

	//CKE.requestFile();

	CKE.onHashChange();

};



CKE.setGitHubAccessToken = function () {

	localStorage.setItem( "githubAccessToken", CKEinpAccessToken.value );

};



CKE.onHashChange = function () {

	CKE.url = location.hash ? location.hash.slice( 1 ) : CKE.urlDefault;

	CKEspnTitle.innerText = CKE.url.split( '/' ).pop().slice().replace( /-/g, ' ' );

	console.log( "CKE.url", CKE.url );

	CKE.requestFile( CKE.url );

};



CKE.requestFile = function ( event ) {
	//console.log( "CKE.url ", CKE.url );

	const xhr = new XMLHttpRequest();
	xhr.open( "GET", CKE.url, true );
	xhr.setRequestHeader( "Authorization", "token " + CKE.accessToken );
	xhr.responseType = "json";
	xhr.onerror = ( xhr ) => console.log( "error:", xhr );
	//xhr.onprogress = ( xhr ) => console.log( "bytes loaded:", xhr.loaded );
	xhr.onload = CKE.onLoad;
	xhr.send( null );

};



CKE.onLoad = function ( xhr ) {
	//console.log( "response", xhr );

	CKE.sha = xhr.target.response.sha;

	const content = atob( xhr.target.response.content );

	if ( CKE.editor ) {

		CKE.editor.data.set( content );

	} else {

		CKE.createEditor( content );

	}

	CKE.content = content;


	//CKEspnMessage.innerText = `Get:${ new Date().toLocaleString() } bytes:${ content.length } sha:${ CKE.sha }`;
	CKEspnMessage.innerText = `Get${ new Date().toLocaleString().split( "," ).pop() } bytes:${ CKE.content.length }`;


};



CKE.putFileToGitHub = function () {

	if ( CKE.url === "" ) { alert( "No URL" ); return; }

	const xhr = new XMLHttpRequest();
	xhr.open( "GET", CKE.url, true );
	xhr.setRequestHeader( "Authorization", "token " + CKE.accessToken );
	xhr.responseType = "json";
	xhr.onerror = ( xhr ) => console.log( "error:", xhr );
	//xhr.onprogress = ( xhr ) => console.log( "bytes loaded:", xhr.loaded );
	xhr.onload = ( xhr ) => {
		//console.log( "", xhr );
		CKE.sha = xhr.target.response.sha;
		CKE.putFile();
	};
	xhr.send( null );

};



CKE.putFile = function () {

	CKE.content = CKE.editor.getData();
	//console.log( "CKE.content", CKE.content );

	const codedData = window.btoa( CKE.content ); // encode the string

	const body = JSON.stringify( {
		"branch": CKE.branch,
		"content": codedData,
		"message": `add to file`,
		"sha": CKE.sha

	} );

	xhr = new XMLHttpRequest();
	xhr.open( "PUT", CKE.url, true );
	xhr.setRequestHeader( "Authorization", "token " + CKE.accessToken );
	xhr.setRequestHeader( "Content-Type", "application/json" );
	xhr.onerror = ( xhr ) => console.log( "error:", xhr );
	xhr.onprogress = ( xhr ) => console.log( "bytes loaded:", xhr.loaded );
	xhr.send( body );

	//CKEspnMessage.innerText = `Put: ${ new Date().toLocaleString() } bytes:${ CKE.content.length } sha:${ CKE.sha }`;
	CKEspnMessage.innerText = `Put: ${ new Date().toLocaleString().split( "," ).pop() } bytes:${ CKE.content.length }`;

};



CKE.checkForChange = function ( event ) {

	if ( editor.data.get() === CKE.content ) { return; }

	//console.log( "", CKE.content );

	event.preventDefault();

	event.returnValue = "";

};



CKE.onKeyUp = function ( event ) {

	//console.log( 'key', event.keyCode );

	event.preventDefault();

	if ( event.altKey && event.keyCode === 83 ) {

		CKE.putFileToGitHub();

	}

};



CKE.createEditor = function ( content ) {

	ClassicEditor
		.create( document.querySelector( '.editor' ), {

			initialData: content,

			htmlSupport: {
				allow: [
					{
						name: /.*/,
						attributes: true,
						classes: true,
						styles: true
					}
				]
			},

			toolbar: {
				items: [
					'heading',
					'|',
					'bold',
					'italic',
					'strikethrough',
					'code',
					'blockQuote',
					'link',
					'horizontalLine',
					'sourceEditing',
					'bulletedList',
					'numberedList',
					'|',
					'findAndReplace',
					'outdent',
					'indent',
					'|',
					'removeFormat',
					'imageUpload',
					'undo',
					'redo'
				]
			},
			language: 'en',
			image: {
				toolbar: [
					'imageTextAlternative',
					'imageStyle:inline',
					'imageStyle:block',
					'imageStyle:side'
				]
			},
			licenseKey: '',

		} )

		.then( editor => {

			CKE.editor = editor; // create a global

		} )


		// .then( editor => {
		// 	const wordCountPlugin = editor.plugins.get( 'WordCount' );
		// 	const wordCountWrapper = document.getElementById( 'wordCount' );

		// 	wordCountWrapper.appendChild( wordCountPlugin.wordCountContainer );
		// } )


		.catch( error => {

			console.error( 'Oops, something went wrong!' );
			console.error( 'Please, report the following error on https://github.com/ckeditor/ckeditor5/issues with the build id and the error stack trace:' );
			console.warn( 'Build id: lbmmnmrgezqg-rdlk6p2px8qg' );
			console.error( error );

		} );

};