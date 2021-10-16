// copyright 2021 Theo Armour. MIT license.
/* global MNU, FRX, FRXdivMenuFileRead, FRXdivLog  */
// jshint esversion: 6
// jshint loopfunc: true


const FRX = {};

FRX.release = "r-2021-10-14";
FRX.releaseThree = "r133";
FRX.urlLoaders = `https://cdn.jsdelivr.net/gh/mrdoob/three.js@${ FRX.releaseThree }/examples/js/loaders/`;
FRX.reader = new FileReader();

FRX.init = function () {

	FRX.pathUtilities = COR.pathTooToo + `lib10/frx-file-read-xhr/${ FRX.release }/`;
	//FRX.pathUtilities = `./`;

	FRX.defaultFile = COR.pathContent + COR.defaultFile;

	//${ MNU.addInfoBox( info ); }

	const info = `
<p>Open <a href="http://gbxml.org" target="_blank">gbXML</a>, HBJSON, Rhino 3DM, gLTF,
<a href="https://www.energyplus.net/" target="_blank">EnergyPlus</a> IDF and OSM, OBJ, STL, VTK files.</p>
Use the file dialog, drag&drop or a URL.</p>
File: frx-file-read-xhr.js<br>
Name space: FRX<br>
Release: ${ FRX.release }<br>`;

	FRXdivDetails.innerHTML = `
<details id=detFile open>
		<summary class="summary-primary gmd-1" title="Open files on your device: ">
		File menu
		<span id=CORspnFile ></span>
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

	if ( window[ "GRV" ]?.accessToken ) { return; }

	FRX.timeStart = performance.now();

	const url = location.hash ? location.hash.slice( 1 ) : FRX.defaultFile;
	FRX.content = "";
	FRX.file = "";
	FRX.fileName = url.split( "/" ).pop();
	extension = FRX.fileName.includes( "." ) ? FRX.fileName.toLowerCase().split( '.' ).pop() : "";
	FRX.url = url;

	FRX.selectHandler( FRX.url );

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
	extension = FRX.fileName.includes( "." ) ? FRX.fileName.toLowerCase().split( '.' ).pop() : "";
	FRX.hostName = FRX.file.type;
	FRX.content = "";
	FRX.url = "";

	//console.log( "frx", FRX );

	FRX.index++;

	if ( FRX.index < FRX.files.length ) {

		setTimeout( FRX.readFile, 2000 );

	}

};



FRX.reader.onload = function () {

	FRX.selectHandler( FRX.fileName.toLowerCase() );

};



FRX.selectHandler = function ( fName ) {

	console.log( "fName", fName );

	const extension = fName.includes( "." ) ? fName.toLowerCase().split( '.' ).pop() : "";

	console.log( "extension", extension );
	main.hidden = false;

	if ( window[ "THR" ] ) { THR.renderer.domElement.style.display = "none"; }

	if ( [ "zip" ].includes( extension ) ) {

		FRX.loadHandler( "ZIP", "zip-handler.js" ); return;

	}


	if ( [ "htm", "html" ].includes( extension ) ) {

		main.style.overflow = "auto";

		FRX.loadHandler( "HTM", "htm-html-handler.js" ); return;

	}

	if ( [ "", "txt", "md", "markdown" ].includes( extension ) ) {

		main.style.overflow = "auto";

		FRX.loadHandler( "MDN", "mdn-markdown-handler.js" ); return;

	}


	if ( [ "gif", "jpg", "jpeg", "png", "svg" ].includes( extension ) ) {

		main.style.overflow = "auto";

		FRX.loadHandler( "IMG", "img-image-handler.js" ); return;

	}


	if ( window[ "THR" ] ) {

		main.hidden = true;
		THR.renderer.domElement.style.display = "block";

		if ( fName.endsWith( ".3dm" ) ) { FRX.loadHandler( "r3DM", "3dm-handler.js" ); return; }

		if ( fName.endsWith( "xml" ) || fName.endsWith( "gbxml" ) ) { FRX.loadHandler( "GBX", "gbx-handler.js" ); return; }

		if ( fName.endsWith( "gltf" ) || fName.endsWith( "glb" ) ) { FRX.loadHandler( "GLTF", "gltf-handler.js" ); return; }

		if ( fName.endsWith( "hbjson" ) ) { FRX.loadHandler( "HBJ", "hbj-handler.js" ); return; }

		if ( fName.endsWith( ".idf" ) || fName.endsWith( ".osm" ) ) { FRX.loadHandler( "IDF", "idf-handler.js" ); return; }

		if ( fName.endsWith( ".ifc" ) ) { FRX.loadHandler( "IFC", "ifc-handler.js" ); return; }

		if ( fName.endsWith( ".json" ) ) { FRX.loadHandler( "JSN", "jsn-three-handler.js" ); return; }

		if ( fName.endsWith( ".obj" ) ) { FRX.loadHandler( "OBJ", "obj-handler.js" ); return; }

		if ( fName.endsWith( ".rad" ) ) { FRX.loadHandler( "RAD", "rad-handler.js" ); return; }

		if ( fName.endsWith( ".stl" ) ) { FRX.loadHandler( "STL", "stl-handler.js" ); return; }

		if ( fName.endsWith( ".vtk" ) || fName.endsWith( ".vtp" ) ) { FRX.loadHandler( "VTK", "vtk-handler.js" ); return; }

		if ( fName.endsWith( ".vtkjs" ) ) { alert( "VTKjs support coming soon!" ); return; }

		if ( fName.endsWith( ".zip" ) ) { FRX.loadHandler( "ZIP", "zip-handler.js" ); return; }

		if ( window[ "THR" ] ) { THR.renderer.domElement.style.display = "none"; }
		//divMainContent.style.display = "block";

	}
	main.hidden = false;
	main.style.overflow = "hidden";

	FRX.loadHandler( "UNK", "unk-unknown-handler.js" );

	//console.log( "FRX.url", decodeURI( FRX.url ) );
	//divMainContent.innerHTML =
	// 	`<iframe id=ifr src="${ decodeURI( FRX.url ) }" style="border:none;height:100vh;width:100%" ></iframe>`;

};


FRX.loadLoader = function ( loader, script, onLoad ) {

	if ( loader === undefined ) {

		const load = document.body.appendChild( document.createElement( 'script' ) );
		load.onload = () => { loader = load; onLoad(); };
		load.src = script;
		return;

	}

	onLoad();

};


FRX.loadLoaders = function ( loader, scripts, onLoad ) {

	scripts = Array.isArray( scripts ) ? scripts : [ scripts ];

	if ( loader === undefined ) {

		//console.log( "scripts", scripts );
		if ( scripts.length === 0 ) {

			loader = "foo";
			onLoad();

		} else {

			for ( script of scripts ) {

				const load = document.body.appendChild( document.createElement( 'script' ) );
				load.onload = () => { loader = load; onLoad(); };
				load.src = script;

			}

			return;


		}





	}

	onLoad();

};



FRX.loadHandler = function ( obj, handler ) {

	//console.log( "FRX.pathUtilities ", FRX.pathUtilities );

	if ( window[ obj ] === undefined ) {

		//console.log( "obj", obj );
		scr = document.body.appendChild( document.createElement( 'script' ) );
		//scr.onload dealt with individually by each handler
		scr.src = FRX.pathUtilities + `handlers/${ handler }`;
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