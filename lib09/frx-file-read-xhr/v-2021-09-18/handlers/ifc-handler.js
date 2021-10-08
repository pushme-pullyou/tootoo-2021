// copyright 2021 Theo Armour. MIT license.
/* global THREE, COR */
// jshint esversion: 6
// jshint loopfunc: true

IFC = {};


IFC.handle = function () {

	//console.log( "FRX.content", FRX.content.slice( 0, 100 ) );
	console.log( "FRX.file", FRX.file.name );
	console.log( "FRX.url", FRX.url.split( "/" ).pop() );

	if ( FRX.content ) { IFC.onUnZip(); return; }

	if ( FRX.file ) { IFC.read(); return; }

	if ( FRX.url ) { IFC.display(); return; }

};



IFC.onUnZip = function () {

	if ( IFC.loader === undefined ) {

		IFC.loader = document.body.appendChild( document.createElement( 'script' ) );
		IFC.loader.onload = () => IFC.display( FRX.content );
		IFC.loader.src = "https://cdnjs.cloudflare.com/ajax/libs/showdown/1.9.1/showdown.min.js";

	} else {

		IFC.loadDataUrl( FRX.content );

	}

};



IFC.read = function () {

	// if ( IFC.loader === undefined ) {

	// 	IFC.loader = document.body.appendChild( document.createElement( 'script' ) );
	// 	IFC.loader.onload = () => IFC.readFile();
	// 	IFC.loader.src = "https://cdnjs.cloudflare.com/ajax/libs/showdown/1.9.1/showdown.min.js";

	// } else {

	IFC.readFile();

	//}

};



IFC.readFile = function () {

	const reader = new FileReader();
	reader.onload = ( event ) => IFC.display( event.target.result );
	reader.readAsText( FRX.file );

};



IFC.onChange = function () {

	// if ( IFC.loader === undefined ) {

	// 	IFC.loader = document.body.appendChild( document.createElement( 'script' ) );
	// 	IFC.loader.onload = () => IFC.display( FRX.url );
	// 	IFC.loader.src = FRX.url;

	// } else {

	IFC.request( FRX.url );

	//}
};



IFC.request = function ( url ) {

	const xhr = new XMLHttpRequest();
	xhr.open( "get", FRX.url, true );
	xhr.onload = () => { IFC.display( xhr.responseText ); };
	xhr.send( null );

	return;

};



IFC.display = function () {

	//console.log( "content", content );

	divMainContent.innerHTML =
		`<iframe src="${ decodeURI( FRX.url ) }" height=${ window.innerHeight } style="border:none;width:100%;" ></iframe>`;

	// 	divMainContent.innerHTML = `
	// <div style="border:0px solid red; margin: 0 auto; padding: 0 1rem; max-width: 40rem;" >
	// ${ decodeURI( FRX.url ) }
	// </div>`;
};



IFC.handle();