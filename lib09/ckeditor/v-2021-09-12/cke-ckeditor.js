// copyright 2021 Theo Armour. MIT license.
/* global COR, main, divMainContent, showdown, detNavMenu, sumNavMenu */
// jshint esversion: 6
// jshint loopfunc: true

const CKE = {};

CKE.base = "https://api.github.com/repos/pushme-pullyou/tootoo-2021/contents/";

CKE.init = function () {

	const htm = `
<details id=detCKE ontoggle=CKE.loadCkeditor() >

	<summary class="summary-primary gmd-1" title="Edit GitHub files on your device: ">
		CKE Editor
		<span id=MNUspnFile ></span>
		${ MNU.addInfoBox( "Files to try" ) }
	</summary>

	<div>
		<input id=CKEinpAccessToken onclick=this.select(); onblur=CKE.setGitHubAccessToken();
		title="Obtain GitHub API Access Token" style=width:100%; >
	</div>

	<div id=divLog></div>

</details>`

	CKEdivCkeditor.innerHTML = htm;


}


CKE.loadCkeditor = function () {

	if ( window[ "editor" ] === undefined ) {

		scr = document.body.appendChild( document.createElement( 'script' ) );
		scr.onload = () => CKE.onHashChange();
		scr.src = "https://pushme-pullyou.github.io/tootoo-2021/lib09/ckeditor/ckeditor5/build/ckeditor.js";
		//scr.src = `js/handlers/${ parser }`;

	} else {

		CKE.onHashChange();

	}

	CKE.accessToken = localStorage.getItem( 'githubAccessToken' ) || "";
	CKEinpAccessToken.value = CKE.accessToken;

	window.addEventListener( "hashchange", CKE.onHashChange, false );

	window.addEventListener( "beforeunload", CKE.checkForChange );

	window.removeEventListener( "hashchange", FRX.onHashChange );

}


CKE.onHashChange = function () {

	CKE.hash = location.hash ? location.hash.slice( 1 ) : COR.defaultFile;

	if ( !window.CKEdivPopUp ) {

		CKEdivPopUp = document.body.appendChild( document.createElement( 'div' ) );
		CKEdivPopUp.style.cssText = "position:fixed;left:calc( 1.5rem + var( --mnu-width ) );rem;top:1rem;transform-origin: 0 0;transform: rotate(90deg);";

	}

	CKEdivPopUp.innerHTML = `
<div>
<button onclick=CKE.requestFile(); > edit: ${ CKE.hash }</button >
</div>`

	divMainContent.innerHTML = `

<div id="container"  >

	<div class="editor"></div>

</div>

<div id="wordCount"></div>

<div id="divStats"></div>

<div id="divMessage"></div>
`;

	CKE.requestFile()

	//CKE.createEditor( "Text to be edited will appear here..." );

}



CKE.requestFile = function () {
	console.log( "CKE.hash ", CKE.hash );

	const xhr = new XMLHttpRequest();
	xhr.open( "GET", CKE.base + CKE.hash, true );
	xhr.setRequestHeader( "Authorization", "token " + CKE.accessToken );
	xhr.responseType = "json";
	xhr.onerror = ( xhr ) => console.log( "error:", xhr );
	//xhr.onprogress = ( xhr ) => console.log( "bytes loaded:", xhr.loaded );
	xhr.onload = CKE.onLoad;
	xhr.send( null );

};



CKE.onLoad = function ( xhr ) {
	console.log( "xhr", xhr );

	CKE.sha = xhr.target.response.sha;

	const content = atob( xhr.target.response.content );

	//console.log( "content", content );

	CKE.ext = CKE.hash.split( "." ).pop().toLowerCase();
	//console.log( "ext", CKE.ext );

	// if ( window.editor ) {

	// 	console.log( "", 23 );
	// 	editor.data.set( content );


	// } else {

		CKE.createEditor( content );

//	}

	CKE.content = content;

	if ( window.divMessage ) {

		//divMessage.innerText = `Get:${ new Date().toLocaleString() } bytes:${ content.length } sha:${ CKE.sha }`;
		divMessage.innerText = `Get${ new Date().toLocaleString().split( "," ).pop() } bytes:${ CKE.content.length }`;

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

			window.editor = editor; // create a global

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