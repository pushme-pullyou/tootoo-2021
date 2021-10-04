// copyright 2021 Theo Armour. MIT license.
/* global COR, main, divMainContent, showdown, detNavMenu, sumNavMenu */
// jshint esversion: 6
// jshint loopfunc: true

const CKM = {};


CKM.init = function ( url) {

	CKM.parentContent = divMainContent;
	CKM.defaultFile = url || "README.md";

	//CKM.base = "https://api.github.com/repos/pushme-pullyou/tootoo-2021/contents/";
	CKM.base = "https://api.github.com/repos/theo-armour/qdata/contents/";
	//CKM.base = `https://api.github.com/repos/${ COR.user }/${ COR.repo }/contents/`;

	CKM.accessToken = localStorage.getItem( "githubAccessToken" ) || "";

	if ( CKM.accessToken === "null" || CKM.accessToken === "" ) {

		CKM.accessToken = prompt( "Enter GitHub Personal Access Token" );

		localStorage.setItem( "githubAccessToken", CKM.accessToken );

	}

	CKM.parentContent.innerHTML = `

	<div id="container"  >

		<div class="editor"></div>

	</div>

	<div id="wordCount"></div>`;

	window.addEventListener( "hashchange", CKM.onHashChange, false );

	window.addEventListener( "beforeunload", CKM.checkForChange );

	const scr = document.body.appendChild( document.createElement( "script" ) );
	scr.onload = () => CKM.createEditor();
	scr.src = "https://pushme-pullyou.github.io/tootoo-2021/lib10/ckeditor5-markdown/build/ckeditor.js";

};



CKM.onHashChange = function () {

	if ( CKM.contentEditor !== undefined ) {

	  //console.log( "equal", CKM.editor.data.get() === CKM.contentEditor );

		if ( CKM.editor.data.get() !== CKM.contentEditor ) {

			const response = confirm( "Changes you made may not be saved. Click OK to proceed without saving" );

			if ( response !== true ) { return; }

		}

	}

	CKM.hash = location.hash ? location.hash.slice( 1 ) : CKM.defaultFile;
	console.log( "file", CKM.hash.split( "/" ).pop() );

	CKM.url = CKM.base + CKM.hash;

	CKM.requestFile();

};



CKM.requestFile = function () {
	//console.log( "CKM.hash ", CKM.hash );

	const xhr = new XMLHttpRequest();
	xhr.open( "GET", CKM.url, true );
	xhr.setRequestHeader( "Authorization", "token " + CKM.accessToken );
	xhr.responseType = "json";
	xhr.onerror = ( xhr ) => console.log( "error:", xhr );
	//xhr.onprogress = ( xhr ) => console.log( "bytes loaded:", xhr.loaded );
	xhr.onload = CKM.onLoad;
	xhr.send( null );

};



CKM.onLoad = function ( xhr ) {

	CKM.content = atob( xhr.target.response.content );

	CKM.editor.data.set( CKM.content );

	CKM.contentEditor = CKM.editor.data.get();

	spnMessage.innerText = `Get ${ new Date().toLocaleString().split( "," ).pop().slice( 1, -3 ) } ${ CKM.contentEditor.length }`;

};



//////////

CKM.getSha = function () {

	if ( CKM.url === "" ) { alert( "No URL" ); return; }

	const xhr = new XMLHttpRequest();
	xhr.open( "GET", CKM.url, true );
	xhr.setRequestHeader( "Authorization", "token " + CKM.accessToken );
	xhr.responseType = "json";
	xhr.onerror = ( xhr ) => console.log( "error:", xhr );
	//xhr.onprogress = ( xhr ) => console.log( "bytes loaded:", xhr.loaded );
	xhr.onload = ( xhr ) => {
		//console.log( "", xhr );
		CKM.sha = xhr.target.response.sha;
		CKM.putFile();
	};
	xhr.send( null );

};



CKM.putFile = function () {

	CKM.contentEditor = CKM.editor.data.get();
	//console.log( "CKM.contentEditor.length", CKM.contentEditor.length );

	const codedData = window.btoa( CKM.contentEditor ); // encode the string

	const body = JSON.stringify( {
		"branch": CKM.branch,
		"content": codedData,
		"message": `add to file`,
		"sha": CKM.sha

	} );

	xhr = new XMLHttpRequest();
	xhr.open( "PUT", CKM.url, true );
	xhr.setRequestHeader( "Authorization", "token " + CKM.accessToken );
	xhr.setRequestHeader( "Content-Type", "application/json" );
	xhr.onerror = ( xhr ) => console.log( "error:", xhr );
	//xhr.onprogress = ( xhr ) => console.log( "bytes loaded:", xhr.loaded );
	xhr.send( body );

	spnMessage.innerText = `Put ${ new Date().toLocaleString().split( "," ).pop().slice( 1, -3 ) } ${ CKM.contentEditor.length }`;

};



CKM.checkForChange = function ( event ) {

	if ( CKM.editor.data.get() === CKM.contentEditor ) { return; }

	console.log( "file", CKM.url.split( "/" ).pop() );

	event.preventDefault();

	event.returnValue = "";

};



CKM.onKeyUp = function ( event ) {

	//console.log( "key", event.keyCode );

	event.preventDefault();

	if ( event.altKey && event.keyCode === 83 ) {

		CKM.getSha();

	}

};



//////////

CKM.createEditor = function ( content ) {

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

			CKM.editor = editor; // create a global

			CKM.onHashChange();

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

