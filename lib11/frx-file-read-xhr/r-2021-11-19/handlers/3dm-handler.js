// copyright 2021 Theo Armour. MIT license.
/* global THREE, COR */
// jshint esversion: 6
// jshint loopfunc: true

r3DM = {};

r3DM.src = FRX.urlLoaders + "3DMLoader.js";

r3DM.handle = function () {

	if ( FRX.file ) { console.log( "file", FRX.file.name ); r3DM.read(); return; }

	if ( FRX.url ) { console.log( "url", FRX.url.split( "/" ).pop() ); r3DM.onChange(); return; }

	if ( FRX.content ) { console.log( "zip", FRX.zipFileName ); r3DM.checkLoader(); return; }

};



r3DM.read = function () {

	FRX.loadLoaders( r3DM, r3DM.src, r3DM.readFile );

};



r3DM.readFile = function () {

	const reader = new FileReader();
	reader.onload = () => r3DM.loadDataUrl( reader.result );
	reader.readAsDataURL( FRX.file );

};



r3DM.onChange = function () {

	FRX.loadLoaders( r3DM, r3DM.src, r3DM.doIt );

};



r3DM.doIt = function () {

	r3DM.loadDataUrl();

	//FRX.loadLoader( GBX, GBX.src, );

};



r3DM.checkLoader = function () {

	FRX.loadLoader( r3DM, r3DM.src, r3DM.parseContent );

};


r3DM.parseContent = function ( content ) {

	alert( "Unzipping 3DM files is broken. Sorry!" );

	return;


	console.log( "content", content.slice( 0, 200 ) );

	const loader = new THREE.Rhino3dmLoader();
	loader.setLibraryPath( 'https://cdn.jsdelivr.net/npm/rhino3dm@0.15.0-beta/' );

	//loader.onload( object => COR.reset( object.children ) );

	loader.parse( content,

		( object ) => {

			console.log( "object", object );
			//COR.reset( object.children

		},

		( err ) => { console.log( "error", err ); }

	);

};


r3DM.loadDataUrl = function ( url = FRX.url ) {

	const loader = new THREE.Rhino3dmLoader();
	loader.setLibraryPath( 'https://cdn.jsdelivr.net/npm/rhino3dm@0.15.0-beta/' );
	loader.load( url, ( object ) => { COR.reset( object.children ); } );

};


r3DM.handle();