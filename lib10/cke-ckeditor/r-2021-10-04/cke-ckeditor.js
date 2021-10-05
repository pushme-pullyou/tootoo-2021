// copyright 2021 Theo Armour. MIT license.
/* global COR, main, divMainContent, showdown, detNavMenu, sumNavMenu */
// jshint esversion: 6
// jshint loopfunc: true

const CKE = {};

//CKE.base = `https://api.github.com/repos/${ COR.user }/${ COR.repo }/contents/`;
//CKE.base = "https://api.github.com/repos/pushme-pullyou/tootoo-2021/contents/";
CKE.defaultBase = "https://api.github.com/repos/theo-armour/qdata/contents/";
CKE.defaultContent = divMainContent;
CKE.defaultClass = ".editor";
CKE.defaultFile = "snippets/notes.htm";
CKE.defaultType = "html";

CKE.init = function ( base, content, claass, file, type ) {

	//console.log( base, content, claass, file, type );

	CKE.base =  base || CKE.defaultBase;
	CKE.content = content || CKE.defaultContent;
	CKE.class = claass || CKE.defaultClass;
	CKE.type = type || CKE.defaultType;
	CKE.file = file || CKE.defaultFile;

	CKE.accessToken = localStorage.getItem( "githubAccessToken" ) || "";

	if ( CKE.accessToken === "null" || CKE.accessToken === "" ) {

		CKE.accessToken = prompt( "Enter GitHub Personal Access Token" );

		localStorage.setItem( "githubAccessToken", CKE.accessToken );

	}

	CKE.content.innerHTML = `

	<div id="container"  >

		<div class="editor"></div>

	</div>

	<div id="wordCount"></div>`;

	window.addEventListener( "hashchange", CKE.onHashChange, false );

	window.addEventListener( "beforeunload", CKE.checkForChange );

	const scr = document.body.appendChild( document.createElement( "script" ) );
	scr.onload = () => CKE.createEditor( CKE.class );
	const code = CKE.type === "html" ? "ckeditor5" : "ckeditor5-markdown"
	scr.src = `https://pushme-pullyou.github.io/tootoo-2021/lib10/${ code }/build/ckeditor.js`;


};



CKE.onHashChange = function () {

	if ( CKE.contentEditor !== undefined ) {

	  //console.log( "equal", CKE.editor.data.get() === CKE.contentEditor );

		if ( CKE.editor.data.get() !== CKE.contentEditor ) {

			const response = confirm( "Changes you made may not be saved. Click OK to proceed without saving" );

			if ( response !== true ) { return; }

		}

	}

	CKE.hash = location.hash ? location.hash.slice( 1 ) : CKE.file;

	console.log( "file", CKE.hash.split( "/" ).pop() );

	CKE.url = CKE.base + CKE.hash;

	CKE.requestFile();

};



CKE.requestFile = function () {
	//console.log( "CKE.hash ", CKE.hash );

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

	CKE.content = atob( xhr.target.response.content );

	CKE.editor.data.set( CKE.content );

	CKE.contentEditor = CKE.editor.data.get();

	spnMessage.innerText = `Get ${ new Date().toLocaleString().split( "," ).pop().slice( 1, -3 ) } ${ CKE.contentEditor.length }`;

};



//////////

CKE.getSha = function () {

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

	CKE.contentEditor = CKE.editor.data.get();
	//console.log( "CKE.contentEditor.length", CKE.contentEditor.length );

	const codedData = window.btoa( CKE.contentEditor ); // encode the string

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
	//xhr.onprogress = ( xhr ) => console.log( "bytes loaded:", xhr.loaded );
	xhr.send( body );

	spnMessage.innerText = `Put ${ new Date().toLocaleString().split( "," ).pop().slice( 1, -3 ) } ${ CKE.contentEditor.length }`;

};



CKE.checkForChange = function ( event ) {

	if ( CKE.editor.data.get() === CKE.contentEditor ) { return; }

	console.log( "file", CKE.url.split( "/" ).pop() );

	event.preventDefault();

	event.returnValue = "";

};



CKE.onKeyUp = function ( event ) {

	//console.log( "key", event.keyCode );

	event.preventDefault();

	if ( event.altKey && event.keyCode === 83 ) {

		CKE.getSha();

	}

};



//////////

CKE.createEditor = function ( editor = CKE.class ) {

	ClassicEditor
		.create( document.querySelector( editor ), {

			initialData: "content",

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

			CKE.editor = editor; // create a global

			CKE.onHashChange();

		} )

		// .then( editor => {
		// 	const wordCountPlugin = editor.plugins.get( "WordCount" );
		// 	const wordCountWrapper = document.getElementById( "wordCount" );

		// 	wordCountWrapper.appendChild( wordCountPlugin.wordCountContainer );
		// } )


		.catch( error => {
			console.error( "Oops, something went wrong!" );
			console.error( "Please, report the following error on https://github.com/ckeditor/ckditor5/issues with the build id and the error stack trace:" );
			console.warn( "Build id: lbmmnmrgezqg-rdlk6p2px8qg" );
			console.error( error );
		} );

};
