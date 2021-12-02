// copyright 2021 Theo Armour. MIT license.
/* global COR, MNU, GRVdivDetails */
// jshint esversion: 6
// jshint loopfunc: true

const FXH = {};


FXH.init = function () {

	window.addEventListener( "hashchange", FXH.onHashChange );

};


FXH.onHashChange = function () {

	FXH.timeStart = performance.now();

	const relativeURL = location.hash ? location.hash.slice( 1 ) : COR.defaultFile;
	//FXH.content = "";
	//FXH.file = "";
	FXH.fileName = relativeURL.split( "/" ).pop();
	FXH.extension = FXH.fileName.includes( "." ) ? FXH.fileName.toLowerCase().split( '.' ).pop() : "";
	FXH.url = COR.defaultBaseURL + relativeURL;

	FXH.selectHandler( FXH.url );

};





FXH.selectHandler = function ( fName ) {

	//console.log( "fName", fName );

	if ( [ "", "txt", "md", "markdown" ].includes( FXH.extension ) ) {

		const src = "https://cdnjs.cloudflare.com/ajax/libs/showdown/1.9.1/showdown.min.js";

		FXH.mdn = {};

		FXH.display = FXH.displayMarkdown;

		FXH.loadLoaders( FXH.mdn, src, FXH.request );

	}

	if ( [ "zip" ].includes( FXH.extension ) ) {

		FXH.zip = {};

		const src = [
			"https://cdn.jsdelivr.net/npm/jszip@3.7.1/dist/jszip.min.js",
			"https://pushme-pullyou.github.io/tootoo-2021/lib12/fxh-file-xmlhttprequest/r-2021-12-02/zip-parser.js"

		];

		FXH.loadLoaders( FXH.zip, src, FXH.fetchZipFile );

	}

	if ( [ "htm", "html" ].includes( FXH.extension ) ) {

		FXH.display = FXH.displayHTM;

		FXH.request();

	}

	if ( [ "gif", "jpg", "jpeg", "png", "svg" ].includes( FXH.extension ) ) {

		divMainContent.innerHTML = `
<a href=${ FXH.url } title="Open this image in a new window" target="_blank" >
	<img src="${ decodeURI( FXH.url ) }" alt="${ FXH.fileName }"style=max-width:100% >
</a>`;

	}


	//FXH.loadHandler( "UNK", "unk-unknown-handler.js" );

	//console.log( "FXH.url", decodeURI( FXH.url ) );
	//divMainContent.innerHTML =
	// 	`<iframe id=ifr src="${ decodeURI( FXH.url ) }" style="border:none;height:100vh;width:100%" ></iframe>`;

};


FXH.loadLoaders = function ( obj, scripts, onLoad ) {

	scripts = Array.isArray( scripts ) ? scripts : [ scripts ];

	if ( !obj?.loaded ) {

		console.log( "scripts", scripts );

		if ( scripts.length === 0 ) {

			obj.loaded = true;
			onLoad();

		} else {

			for ( script of scripts ) {

				obj.loaded = true;
				const load = document.body.appendChild( document.createElement( "script" ) );
				load.onload = onLoad;
				load.src = script;

			}

			return;

		}

	}

	onLoad();

};



FXH.request = function ( event ) {
	console.log( "event", event );

	const xhr = new XMLHttpRequest();
	//FXH.addListeners( xhr );
	xhr.open( "get", FXH.url, true );
	xhr.onload = () => FXH.display( xhr.responseText );
	xhr.send( null );

	return xhr;

};



FXH.displayMarkdown = function ( content ) {

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



FXH.displayHTM = function ( content ) {

	//console.log( "content", content );

	divMainContent.innerHTML = `
<div style="border:0px solid red; margin: 0 auto; padding: 0 1rem; max-width: 40rem;" >
	${ content }
</div>`;
};