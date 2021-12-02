// copyright 2021 Theo Armour. MIT license.
/* global COR, MNU, GRVdivDetails, GRVdivFolders, GRVdivGitHubRepoTreeView, divPopUp, navMenu */
// jshint esversion: 6
// jshint loopfunc: true

const FXH = {};

FXH.init = function () {

	window.addEventListener( "hashchange", FXH.onHashChange );

}


FXH.onHashChange = function () {

	//if ( window[ "GRV" ]?.accessToken ) { return; }

	FXH.timeStart = performance.now();

	const url = location.hash ? location.hash.slice( 1 ) : FXH.defaultUrl;
	FXH.content = "";
	FXH.file = "";
	FXH.fileName = url.split( "/" ).pop();
	extension = FXH.fileName.includes( "." ) ? FXH.fileName.toLowerCase().split( '.' ).pop() : "";
	FXH.url = "../../../" + url;

	FXH.selectHandler( FXH.url );

};



FXH.selectHandler = function ( fName ) {

	//console.log( "handler fName", fName );

	const extension = fName.includes( "." ) ? fName.toLowerCase().split( '.' ).pop() : "";
	//console.log( "extension", extension );

	main.hidden = false;

	if ( window[ "THR" ] ) { THR.renderer.domElement.style.display = "none"; }


	if ( [ "zip" ].includes( extension ) ) {

		FXH.loadHandler( "ZIP", "zip-handler.js" ); return;

	}


	if ( [ "htm", "html" ].includes( extension ) ) {

		main.style.overflow = "auto";

		FXH.loadHandler( "HTM", "htm-html-handler.js" ); return;

	}

	if ( [ "", "txt", "md", "markdown" ].includes( extension ) ) {

		main.style.overflow = "auto";

		FXH.loadHandler( "MDN", MDN.onChange() ); return;

	}


	if ( [ "gif", "jpg", "jpeg", "png", "svg" ].includes( extension ) ) {

		main.style.overflow = "auto";

		FXH.loadHandler( "IMG", "img-image-handler.js" ); return;

	}


	//FXH.loadHandler( "UNK", "unk-unknown-handler.js" );

	//console.log( "FXH.url", decodeURI( FXH.url ) );
	//divMainContent.innerHTML =
	// 	`<iframe id=ifr src="${ decodeURI( FXH.url ) }" style="border:none;height:100vh;width:100%" ></iframe>`;

};



FXH.loadHandler = function ( obj, handler ) {

	//console.log( "FXH.pathUtilities ", FXH.pathUtilities );

	if ( window[ obj ] === undefined ) {

		//console.log( "obj", obj );
		scr = document.body.appendChild( document.createElement( 'script' ) );
		//scr.onload dealt with individually by each handler
		scr.src = FXH.pathUtilities + `handlers/${ handler }`;
		//scr.src = `js/handlers/${ parser }`;

	} else {

		window[ obj ].handle();

	}

	//FXH.onProgress( FXH.file && FXH.file.size || 0, "Load complete" );

};


FXH.loadLoaders = function ( obj, scripts, onLoad ) {

	scripts = Array.isArray( scripts ) ? scripts : [ scripts ];

	if ( !obj?.loaded ) {

		//console.log( "scripts", scripts );

		if ( scripts.length === 0 ) {

			obj.loaded = true;
			onLoad();

		} else {

			for ( script of scripts ) {

				obj.loaded = true;
				const load = document.body.appendChild( document.createElement( 'script' ) );
				load.onload = onLoad;
				load.src = script;

			}

			return;

		}

	}

	onLoad();

};


MDN = {};

MDN.src = "https://cdnjs.cloudflare.com/ajax/libs/showdown/1.9.1/showdown.min.js";


MDN.handle = function () {

	//if ( FXH.file ) { console.log( "file", FXH.file.name ); MDN.read(); return; }

	if ( FXH.url ) { console.log( "url", FXH.url.split( "/" ).pop() ); MDN.onChange(); return; }

	//if ( FXH.content ) { console.log( "zip", FXH.zipFileName ); MDN.checkLoader(); return; }

};


MDN.onChange = function () {

	FXH.loadLoaders( MDN, MDN.src, MDN.request );

};

MDN.request = function ( url = FXH.url ) {

	console.log( "url", url );

	const xhr = new XMLHttpRequest();
	//FXH.addListeners( xhr );
	xhr.open( "get", FXH.url, true );
	xhr.onload = () => { FXH.display( xhr.responseText ); };
	xhr.send( null );

	return xhr;

};



FXH.display = function ( content = FXH.content ) {

	showdown.setFlavor( "github" );

	const options = { excludeTrailingPunctuationFromURLs: true, ghMention: true, rquestImgDimensions: true, simplifiedAutoLink: true, simpleLineBreaks: true, emoji: true, openLinksInNewWindow: true };

	const txt = content.replace( /\<!--@@@/, "" ).replace( /\@@@-->/, "" );
	const htm = new showdown.Converter( options ).makeHtml( txt );
	divMainContent.innerHTML = `
<div style="border:0px solid red; margin: 0 auto; padding: 0 1rem; max-width: 40rem;" >
${ htm }
</div>`;

	FXH.timeEnd = performance.now();
	//console.log( "FRX time load", ( FXH.timeEnd - FXH.timeStart ).toLocaleString() );


};
