// copyright 2021 Theo Armour. MIT license.
/* global COR, main, divMainContent, showdown, detNavMenu, sumNavMenu */
// jshint esversion: 6
// jshint loopfunc: true

const CKH = {};


CKH.init = function () {

	CKH.parentMenu = CKHdivCKEditor;
	CKH.parentContent = divMainContent;
	CKH.defaultFile = "snippets/notes.htm";

	CKH.base = "https://api.github.com/repos/theo-armour/qdata/contents/";
	//CKH.base = `https://api.github.com/repos/${ COR.user }/${ COR.repo }/contents/`;

	CKH.accessToken = localStorage.getItem( 'githubAccessToken' ) || "";

	if ( CKH.accessToken === "null" || CKH.accessToken === "" ) {

		CKH.accessToken = prompt( "Enter GitHub Personal Access Token" )

		localStorage.setItem( "githubAccessToken", CKH.accessToken );

	}


	CKH.parentContent.innerHTML = `

	<div id="container"  >

		<div class="editor"></div>

	</div>

	<div id="wordCount"></div>

	<div id="divStats"></div>`;

	window.addEventListener( "hashchange", CKH.onHashChange, false );

	window.addEventListener( "beforeunload", CKH.checkForChange );

	CKH.onHashChange();

};



CKH.onHashChange = function () {

	if ( CKH.editor ) {

		console.log( "true", CKH.editor?.data?.get().slice( 1 ) !== CKH.content );

		if ( CKH.editor?.data?.get() !== CKH.content ) {

			const response = confirm( "Changes you made may not be saved. Click OK to proceed without saving" );
			if ( response !== true ) { return; }

		}

	}

	CKH.hash = location.hash ? location.hash.slice( 1 ) : CKH.defaultFile;
	console.log( "file", CKH.hash.split( "/" ).pop() );

	CKH.url = CKH.base + CKH.hash;

	CKH.requestFile();

};



CKH.requestFile = function () {
	//console.log( "CKH.hash ", CKH.hash );

	const xhr = new XMLHttpRequest();
	xhr.open( "GET", CKH.url, true );
	xhr.setRequestHeader( "Authorization", "token " + CKH.accessToken );
	xhr.responseType = "json";
	xhr.onerror = ( xhr ) => console.log( "error:", xhr );
	//xhr.onprogress = ( xhr ) => console.log( "bytes loaded:", xhr.loaded );
	xhr.onload = CKH.onLoad;
	xhr.send( null );

};



CKH.onLoad = function ( xhr ) {

	CKH.content = atob( xhr.target.response.content );

	if ( CKH.editor ) {

		CKH.editor.data.set( CKH.content );


	} else {

		CKH.createEditor( CKH.content );

	}

	spnMessage.innerText = `Get ${ new Date().toLocaleString().split( "," ).pop().slice( 1, -3 ) } ${ CKH.content.length }`;

};



//////////

CKH.getSha = function () {

	if ( CKH.url === "" ) { alert( "No URL" ); return; }

	const xhr = new XMLHttpRequest();
	xhr.open( "GET", CKH.url, true );
	xhr.setRequestHeader( "Authorization", "token " + CKH.accessToken );
	xhr.responseType = "json";
	xhr.onerror = ( xhr ) => console.log( "error:", xhr );
	//xhr.onprogress = ( xhr ) => console.log( "bytes loaded:", xhr.loaded );
	xhr.onload = ( xhr ) => {
		//console.log( "", xhr );
		CKH.sha = xhr.target.response.sha;
		CKH.putFile();
	};
	xhr.send( null );

};



CKH.putFile = function () {

	CKH.content = CKH.editor.getData();
	//console.log( "CKH.content", CKH.content );

	const codedData = window.btoa( CKH.content ); // encode the string

	const body = JSON.stringify( {
		"branch": CKH.branch,
		"content": codedData,
		"message": `add to file`,
		"sha": CKH.sha

	} );

	xhr = new XMLHttpRequest();
	xhr.open( "PUT", CKH.url, true );
	xhr.setRequestHeader( "Authorization", "token " + CKH.accessToken );
	xhr.setRequestHeader( "Content-Type", "application/json" );
	xhr.onerror = ( xhr ) => console.log( "error:", xhr );
	//xhr.onprogress = ( xhr ) => console.log( "bytes loaded:", xhr.loaded );
	xhr.send( body );

	spnMessage.innerText = `Put ${ new Date().toLocaleString().split( "," ).pop().slice( 1, -3 ) } ${ CKH.content.length }`;

};



CKH.checkForChange = function ( event ) {

	if ( CKH.editor?.data?.get() === CKH.content ) { return; }

	console.log( "content", CKH.url.split( "/" ).pop() );

	event.preventDefault();

	event.returnValue = "";

};



CKH.onKeyUp = function ( event ) {

	//console.log( 'key', event.keyCode );

	event.preventDefault();

	if ( event.altKey && event.keyCode === 83 ) {

		CKH.getSha();

	}

};



//////////


CKH.createEditor = function ( content ) {

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
					//'findAndReplace',
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

			CKH.editor = editor; // create a global

			//CKH.content = editor.getData();

			CKH.content = CKH.editor.data.get();

		} )


		// .then( editor => {
		// 	const wordCountPlugin = editor.plugins.get( 'WordCount' );
		// 	const wordCountWrapper = document.getElementById( 'wordCount' );

		// 	wordCountWrapper.appendChild( wordCountPlugin.wordCountContainer );
		// } )


		.catch( error => {
			console.error( 'Oops, something went wrong!' );
			console.error( 'Please, report the following error on https://github.com/CKHditor/CKHditor5/issues with the build id and the error stack trace:' );
			console.warn( 'Build id: lbmmnmrgezqg-rdlk6p2px8qg' );
			console.error( error );
		} );

};

