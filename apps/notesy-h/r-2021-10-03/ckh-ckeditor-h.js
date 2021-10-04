// copyright 2021 Theo Armour. MIT license.
/* global COR, main, divMainContent, showdown, detNavMenu, sumNavMenu */
// jshint esversion: 6
// jshint loopfunc: true

const CKH = {};


CKH.init = function ( url ) {

	CKH.parentContent = divMainContent;
	CKH.defaultFile = url || "snippets/notes.htm";

	CKH.base = "https://api.github.com/repos/theo-armour/qdata/contents/";
	//CKH.base = `https://api.github.com/repos/${ COR.user }/${ COR.repo }/contents/`;

	CKH.accessToken = localStorage.getItem( "githubAccessToken" ) || "";

	if ( CKH.accessToken === "null" || CKH.accessToken === "" ) {

		CKH.accessToken = prompt( "Enter GitHub Personal Access Token" )

		localStorage.setItem( "githubAccessToken", CKH.accessToken );

	}

	CKH.parentContent.innerHTML = `

	<div id="container"  >

		<div class="editor"></div>

	</div>

	<div id="wordCount"></div>`;

	window.addEventListener( "hashchange", CKH.onHashChange, false );

	window.addEventListener( "beforeunload", CKH.checkForChange );

	const scr = document.body.appendChild( document.createElement( "script" ) );
	scr.onload = () => CKH.createEditor();
	scr.src = "https://pushme-pullyou.github.io/tootoo-2021/lib10/ckeditor5/build/ckeditor.js";

};



CKH.onHashChange = function () {

	if ( CKH.contentEditor !== undefined ) {

	// 	console.log( "equal", CKH.editor.data.get() === CKH.contentEditor );

		if ( CKH.editor.data.get() !== CKH.contentEditor ) {

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

	CKH.editor.data.set( CKH.content );

	CKH.contentEditor = CKH.editor.data.get();

	spnMessage.innerText = `Get ${ new Date().toLocaleString().split( "," ).pop().slice( 1, -3 ) } ${ CKH.contentEditor.length }`;

};



//////////

CKH.getSha = function () {

	//if ( CKH.url === "" ) { alert( "No URL" ); return; }

	const xhr = new XMLHttpRequest();
	xhr.open( "GET", CKH.url, true );
	xhr.setRequestHeader( "Authorization", "token " + CKH.accessToken );
	xhr.responseType = "json";
	xhr.onerror = ( xhr ) => console.log( "error:", xhr );
	//xhr.onprogress = ( xhr ) => console.log( "bytes loaded:", xhr.loaded );
	xhr.onload = ( xhr ) => {
		CKH.sha = xhr.target.response.sha;
		CKH.putFile();
	};
	xhr.send( null );

};



CKH.putFile = function () {

	CKH.contentEditor = CKH.editor.data.get();
	//console.log( "CKH.contentEditor.length", CKH.contentEditor.length );

	const codedData = window.btoa( CKH.contentEditor ); // encode the string

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

	spnMessage.innerText = `Put ${ new Date().toLocaleString().split( "," ).pop().slice( 1, -3 ) } ${ CKH.contentEditor.length }`;

};



CKH.checkForChange = function ( event ) {

	if ( CKH.editor.data.get() === CKH.contentEditor ) { return; }

	console.log( "file", CKH.url.split( "/" ).pop() );

	event.preventDefault();

	event.returnValue = "";

};



CKH.onKeyUp = function ( event ) {

	//console.log( "key", event.keyCode );

	event.preventDefault();

	if ( event.altKey && event.keyCode === 83 ) {

		CKH.getSha();

	}

};



//////////

CKH.createEditor = function ( content ) {

	ClassicEditor
		.create( document.querySelector( ".editor" ), {

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
					"heading",
					"|",
					"bold",
					"italic",
					"strikethrough",
					"code",
					"blockQuote",
					"link",
					"horizontalLine",
					"sourceEditing",
					"bulletedList",
					"numberedList",
					"|",
					//"findAndReplace",
					"outdent",
					"indent",
					"|",
					"removeFormat",
					"imageUpload",
					"undo",
					"redo"
				]
			},
			language: "en",
			image: {
				toolbar: [
					"imageTextAlternative",
					"imageStyle:inline",
					"imageStyle:block",
					"imageStyle:side"
				]
			},
			licenseKey: "",

		} )

		.then( editor => {

			CKH.editor = editor; // create a global

			CKH.onHashChange();

		} )

		// .then( editor => {
		// 	const wordCountPlugin = editor.plugins.get( "WordCount" );
		// 	const wordCountWrapper = document.getElementById( "wordCount" );

		// 	wordCountWrapper.appendChild( wordCountPlugin.wordCountContainer );
		// } )


		.catch( error => {
			console.error( "Oops, something went wrong!" );
			console.error( "Please, report the following error on https://github.com/CKHditor/CKHditor5/issues with the build id and the error stack trace:" );
			console.warn( "Build id: lbmmnmrgezqg-rdlk6p2px8qg" );
			console.error( error );
		} );

};

