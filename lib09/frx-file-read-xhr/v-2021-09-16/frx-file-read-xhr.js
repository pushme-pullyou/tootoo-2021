// copyright 2021 Theo Armour. MIT license.
/* global MNU, FRX, FRXdivMenuFileRead, FRXdivLog  */
// jshint esversion: 6
// jshint loopfunc: true


const FRX = {};

FRX.version = "v-2021-09-16";


FRX.reader = new FileReader();

FRX.init = function () {

	if ( location.protocol === "https:" ) {

		FRX.path = COR.pathTooToo + `lib09/frx-file-read-xhr/${ FRX.version }/`;

	} else {

		FRX.path = COR.pathTooToo + `lib09/frx-file-read-xhr/${ FRX.version }/`;

	}


	FRX.defaultFile = COR.defaultFile;

	const info = `
<p>Open <a href="http://gbxml.org" target="_blank">gbXML</a>, HBJSON, Rhino 3DM, gLTF,
<a href="https://www.energyplus.net/" target="_blank">EnergyPlus</a> IDF and OSM, OBJ, STL, VTK files.</p>
Use the file dialog, drag&drop or a URL.</p>
File: frx-file-read-xhr.js<br>
Name space: FRX<br>
Release: ${ FRX.version }<br>`;

	FRXdivDetails.innerHTML = `
<details id=detFile>
		<summary class="summary-primary gmd-1" title="Open files on your device: ">
		File menu
		<span id=MNUspnFile ></span>
		${ MNU.addInfoBox( info ) }
	</summary>

	<div id=FRdivMenuFileReader> </div>

	<div id=GRAdivDetails></div>

	<p>Select a file from your device or network.</p>
	<p>
		<input type=file id=FRXinpFiles onchange=FRX.onInputFiles(this); accept="*" multiple>
	</p>

	<div id=FRXdivLog></div>

	<div id=FRXdivLog2 ></div>

	<div id=FOZdivFileOpenZip></div>

</details>`;

	window.addEventListener( "hashchange", FRX.onHashChange );

	window.addEventListener( "dragenter", FRX.dragenter, false );
	window.addEventListener( "dragover", FRX.dragover, false );
	window.addEventListener( "drop", FRX.drop, false );

};



FRX.dragenter = function ( event ) {
	event.stopPropagation();
	event.preventDefault();
};

FRX.dragover = function ( event ) {
	event.stopPropagation();
	event.preventDefault();
};

FRX.drop = function ( event ) {
	event.stopPropagation();
	event.preventDefault();

	const dt = event.dataTransfer;
	FRX.files = dt.files;

	FRX.index = 0;
	FRX.readFile();

};



FRX.addListeners = function ( xhr ) {
	xhr.addEventListener( 'loadstart', FRX.handleEvent );
	xhr.addEventListener( 'load', FRX.handleEvent );
	xhr.addEventListener( 'loadend', FRX.handleEvent );
	xhr.addEventListener( 'progress', FRX.handleEvent );
	xhr.addEventListener( 'error', FRX.handleEvent );
	xhr.addEventListener( 'abort', FRX.handleEvent );
};



FRX.handleEvent = function ( e ) {

	FRXdivLog2.innerText = `${ e.type }: ${ e.loaded.toLocaleString() } bytes transferred\n`;

};




FRX.onHashChange = function () {

	FRX.timeStart = performance.now();

	const url = location.hash ? location.hash.slice( 1 ) : FRX.defaultFile;
	FRX.content = "";
	FRX.file = "";
	FRX.fileName = url.split( "/" ).pop();
	FRX.extension = FRX.fileName.toLowerCase().split( '.' ).pop();
	FRX.url = COR.path + url;

	FRX.loadHandler( FRX.url );

};



FRX.onInputFiles = function () {

	FRX.index = 0;
	FRX.files = FRXinpFiles.files;
	FRX.readFile();

};



FRX.readFile = function () {

	FRX.timeStart = performance.now();

	FRX.reader.readAsText( FRX.files[ FRX.index ] );

	FRX.file = FRX.files[ FRX.index ];
	FRX.fileName = FRX.file.name;
	FRX.extension = FRX.fileName.toLowerCase().split( '.' ).pop();
	FRX.hostName = FRX.file.type;
	FRX.content = "";
	FRX.url = "";

	console.log( "frx", FRX );
	FRX.index++;

	if ( FRX.index < FRX.files.length ) {

		setTimeout( FRX.readFile, 2000 );

	}

};



FRX.reader.onload = function () {

	FRX.loadHandler( FRX.fileName.toLowerCase() );

};



FRX.loadHandler = function ( fName ) {
	//console.log( "fName", fName );

	main.hidden = false;
	if ( window[ "THR" ] ) { THR.renderer.domElement.style.display = "none"; }


	if ( [ "htm", "html" ].includes( FRX.extension ) ) {

		main.style.overflow = "auto";

		FRX.load( "HTM", "htm-html-handler.js" ); return;

	}

	if ( FRX.extension === "md" || FRX.extension === "markdown" ) {

		main.style.overflow = "auto";

		FRX.load( "MDN", "mdn-markdown-handler.js" ); return;

	}


	if ( [ "gif", "jpg", "jpeg", "png", "svg" ].includes( FRX.extension ) ) {

		main.style.overflow = "auto";

		FRX.load( "IMG", "img-image-handler.js" ); return;

	}


	main.hidden = true;
	if ( window[ "THR" ] ) { THR.renderer.domElement.style.display = "block"; }

	// if ( fName.endsWith( ".md" ) ) { FRX.load( r3DM, "3dm-handler.js" ); return; }

	if ( fName.endsWith( ".3dm" ) ) { FRX.load( "r3DM", "3dm-handler.js" ); return; }

	if ( fName.endsWith( "xml" ) || fName.endsWith( "gbxml" ) ) { FRX.load( "GBX", "gbx-handler.js" ); return; }

	if ( fName.endsWith( "gltf" ) || fName.endsWith( "glb" ) ) { FRX.load( "GLTF", "gltf-handler.js" ); return; }

	if ( fName.endsWith( "hbjson" ) ) { FRX.load( "HBJ", "hbj-handler.js" ); return; }

	if ( fName.endsWith( ".idf" ) || fName.endsWith( ".osm" ) ) { FRX.load( "IDF", "idf-handler.js" ); return; }

	if ( fName.endsWith( ".ifc" ) ) { alert( "IFC file support coming soon!" ); }

	if ( fName.endsWith( ".json" ) ) { FRX.load( "JSN", "jsn-three-handler.js" ); return; }

	if ( fName.endsWith( ".obj" ) ) { FRX.load( "OBJ", "obj-handler.js" ); return; }

	if ( fName.endsWith( ".rad" ) ) { FRX.load( "RAD", "rad-handler.js" ); return; }

	if ( fName.endsWith( ".stl" ) ) { FRX.load( "STL", "stl-handler.js" ); return; }

	if ( fName.endsWith( ".vtk" ) || fName.endsWith( ".vtp" ) ) { FRX.load( "VTK", "vtk-handler.js" ); return; }

	if ( fName.endsWith( ".vtkjs" ) ) { alert( "VTKjs support coming soon!" ); return; }

	if ( fName.endsWith( ".zip" ) ) { FRX.load( "ZIP", "zip-handler.js" ); return; }

	if ( window[ "THR" ] ) { THR.renderer.domElement.style.display = "none"; }
	//divMainContent.style.display = "block";
	main.hidden = false;
	main.style.overflow = "hidden";

	//FRX.load( UNK, "unk-unknown-handler.js" );
	divMainContent.innerHTML =
		`<iframe id=ifr src="${ decodeURI( FRX.url ) }" style="border:none;height:100vh;width:100%" ></iframe>`;

};



FRX.load = function ( obj, handler ) {

	//console.log( "FRX.path ", FRX.path );

	if ( window[ obj ] === undefined ) {

		//console.log( "obj", obj );
		scr = document.body.appendChild( document.createElement( 'script' ) );
		//scr.onload dealt with individually by each handler
		scr.src = FRX.path + `handlers/${ handler }`;
		//scr.src = `js/handlers/${ parser }`;

	} else {

		window[ obj ].handle();

	}

	FRX.onProgress( FRX.file && FRX.file.size || 0, "Load complete" );

};



FRX.onProgress = function ( size = 0, note = "" ) {

	FRX.timeToLoad = ( performance.now() - FRX.timeStart ).toLocaleString();
	FRX.size = size;

	// const a = document.createElement( 'a' );
	// a.href = url;
	// FOO.hostName = a.hostname;
	const htm =
		`
		<p>
			<span class=attributeTitle >File name</span>: <span class=attributeValue >${ FRX.fileName }</span></br>
			<span class=attributeTitle >Host|type</span>: <span class=attributeValue >${ FRX.hostName }</span></br>
 			<span class=attributeTitle >Bytes loaded</span>: <span class=attributeValue >${ FRX.size.toLocaleString() }</span></br>
			<span class=attributeTitle >Time to load</span>: <span class=attributeValue>${ FRX.timeToLoad } ms</span></br>
			${ note }
		</p>
	`;

	FRXdivLog.innerHTML = htm;

};


// template

// ZZZ.handle = function () {

// 	//console.log( "FRX.content", FRX.content.slice( 0, 100 ) );
// 	console.log( "FRX.file", FRX.file.name );
// 	console.log( "FRX.url", FRX.url.split( "/").pop() );

// 	if ( FRX.content ) { ZZZ.parse( FRX.content ); return; }

// 	if ( FRX.file ) { ZZZ.read(); return; }

// 	if ( FRX.url ) { ZZZ.onChange( FRX.url ); return; }

// };