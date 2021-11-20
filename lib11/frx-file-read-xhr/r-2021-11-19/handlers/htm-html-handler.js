// copyright 2021 Theo Armour. MIT license.
/* global THREE, COR */
// jshint esversion: 6
// jshint loopfunc: true

HTM = {};

HTM.src = FRX.urlLoaders + "3DMLoader.js";

HTM.handle = function () {

	if ( FRX.file ) { console.log( "file", FRX.file.name ); HTM.read(); return; }

	if ( FRX.url ) { console.log( "url", FRX.url.split( "/" ).pop() ); HTM.onChange(); return; }

	if ( FRX.content ) { console.log( "zip", FRX.zipFileName ); HTM.checkLoader(); return; }

};



HTM.read = function () {

	HTM.readFile();

};



HTM.readFile = function () {

	const reader = new FileReader();
	reader.onload = ( event ) => HTM.display( event.target.result );
	reader.readAsText( FRX.file );

};



HTM.onChange = function () {

	HTM.request();

};



HTM.checkLoader = function () {

	HTM.display();

};



HTM.request = function () {

	const xhr = new XMLHttpRequest();
	xhr.open( "get", FRX.url, true );
	xhr.onload = () => { HTM.display( xhr.responseText ); };
	xhr.send( null );

	return;

};



HTM.display = function ( content = FRX.content ) {

	//console.log( "url", url );

	divMainContent.innerHTML = `
<div style="border:0px solid red; margin: 0 auto; padding: 0 1rem; max-width: 40rem;" >
	${ content }
</div>`;
};



HTM.handle();