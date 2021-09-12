// copyright 2021 Theo Armour. MIT license.
/* global MNU, FRX, FRXdivMenuFileRead, FRXdivLog  */
// jshint esversion: 6
// jshint loopfunc: true


const FRX = {};

FRX.reader = new FileReader();
FRX.path = "";

FRX.init = function () {

	FRX.defaultFile = COR.defaultFile;

	window.addEventListener( "hashchange", FRX.onHashChange );

	const info = `
<p>Open <a href="http://gbxml.org" target="_blank">gbXML</a>, HBJSON, Rhino 3DM, gLTF,
<a href="https://www.energyplus.net/" target="_blank">EnergyPlus</a> IDF and OSM, OBJ, STL, VTK files.</p>
Use the file dialog, drag&drop or a URL`;

	FRXdivDetails.innerHTML = `
<details id=detFile >
		<summary class="summary-primary gmd-1" title="Open files on your device: ">File menu
		<span id=MNUspnFile ></span>
		${ MNU.addInfoBox( info ) }
	</summary>

	<div id=FRdivMenuFileReader> </div>

	<p>Select a file from your device or network.</p>
	<p>
		<input type=file id=FRXinpFiles onchange=FRX.onInputFiles(this); accept="*" multiple>
	</p>

	<div id=FRXdivLog></div>

	<div id=FOZdivFileOpenZip></div>

</details>`;

};


FRX.onHashChange = function () {

	FRX.timeStart = performance.now();

	const url = location.hash ? location.hash.slice( 1 ) : FRX.defaultFile;
	FRX.content = "";
	FRX.file = "";
	FRX.fileName = url.split( "/" ).pop();
	FRX.extension = FRX.fileName.toLowerCase().split( '.' ).pop();
	FRX.url = url;

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

	FRX.index++;

	if ( FRX.index < FRX.files.length ) {

		setTimeout( FRX.readFile, 2000 );

	}

};



FRX.reader.onload = function () {

	FRX.loadHandler( FRX.fileName.toLowerCase() );

};



FRX.loadHandler = function ( fName ) {

	console.log( "fName", fName );

	if ( FRX.fileName.startsWith( "edit" ) ) {

		FRX.url = FRX.path + FRX.fileName.slice( 4 );

		const xhr = new XMLHttpRequest();
		xhr.open( "get", FRX.url, true );
		xhr.onload = () => {
			const txt = xhr.responseText;
			divMainContent.innerHTML = `<textarea style="height:98vh;width:100%;" >${ txt }</textarea>`;
			window.scrollTo( 0, 0 );
			FRX.timeEnd = performance.now();
			//console.log( "FRX time load", ( FRX.timeEnd - FRX.timeStart ).toLocaleString() );
		};
		xhr.send( null );

		return;
	}


	if ( [ "htm", "html" ].includes( FRX.extension ) ) {

		// divMainContent.innerHTML =
		// 	`<iframe id=ifr src="${ decodeURI( FRX.url ) }" style="border:none;width:100%;" ></iframe>`;

		main.style.overflow = "hidden";

		divMainContent.innerHTML =
			`<iframe src="${ FRX.url }" height=${ window.innerHeight } style="border:none;width:100%;"  ></iframe>`;

		return;

	}

	if ( FRX.extension === "md" || FRX.extension.length > 4 ) {
		

		showdown.setFlavor( "github" );

		const options = { excludeTrailingPunctuationFromURLs: true, ghMention: true, parseImgDimensions: true, simplifiedAutoLink: true, simpleLineBreaks: true, emoji: true, openLinksInNewWindow: true };

		const xhr = new XMLHttpRequest();
		xhr.open( "get", FRX.url, true );
		xhr.onload = () => {
			const txt = xhr.responseText.replace( /\<!--@@@/, "" ).replace( /\@@@-->/, "" );
			const htm = new showdown.Converter( options ).makeHtml( txt );
			divMainContent.innerHTML = `
<div style="border:0px solid red; margin: 0 auto; padding: 0 1rem; max-width: 40rem;" >
${ htm }
</div>`;

			FRX.timeEnd = performance.now();
			//console.log( "FRX time load", ( FRX.timeEnd - FRX.timeStart ).toLocaleString() );
		};
		xhr.send( null );

		return;

	}


	if ( [ "gif", "jpg", "jpeg", "png", "svg" ].includes( FRX.extension ) ) {

		divMainContent.innerHTML = `<a href=${ FRX.url } title="Open this image in a new window" target="_blank" ><img src="${ decodeURI( FRX.url ) }" style=max-width:100% ></a>`;

		return;

	}



	// if ( fName.endsWith( ".md" ) ) { FRX.load( r3DM, "3dm-handler.js" ); return; }

	// if ( fName.endsWith( ".3dm" ) ) { FRX.load( r3DM, "3dm-handler.js" ); return; }

	// if ( fName.endsWith( "xml" ) ) { FRX.load( GBX, "gbx-handler.js" ); return; }

	// if ( fName.endsWith( "gltf" ) || fName.endsWith( "glb" ) ) { FRX.load( GLTF, "gltf-handler.js" ); return; }

	// if ( fName.endsWith( "hbjson" ) ) { FRX.load( HBJ, "hbj-handler.js" ); return; }

	// if ( fName.endsWith( ".idf" ) || fName.endsWith( ".osm" ) ) { FRX.load( IDF, "idf-handler.js" ); return; }

	// if ( fName.endsWith( ".ifc" ) ) { alert( "IFC file support coming soon!" ); }

	// if ( fName.endsWith( ".obj" ) ) { FRX.load( OBJ, "obj-handler.js" ); return; }

	// if ( fName.endsWith( ".rad" ) ) { FRX.load( RAD, "rad-handler.js" ); return; }

	// if ( fName.endsWith( ".stl" ) ) { FRX.load( STL, "stl-handler.js" ); return; }

	// if ( fName.endsWith( ".vtk" ) || fName.endsWith( ".vtp" ) ) { FRX.load( VTK, "vtk-handler.js" ); return; }

	// if ( fName.endsWith( ".vtkjs" ) ) { alert( "VTKjs support coming soon!" ); }

	// if ( fName.endsWith( ".zip" ) ) { FRX.load( ZIP, "zip-handler.js" ); return; }


	main.style.overflow = "hidden";

	divMainContent.innerHTML =
		`<iframe id=ifr src="${ decodeURI( FRX.url ) }" style="border:none;height:100vh;width:100%" ></iframe>`;

};



FRX.load = function ( obj, parser ) {

	console.log( "FRX.path ", FRX.path );

	if ( obj === undefined ) {

		//console.log( "obj", obj );
		scr = document.body.appendChild( document.createElement( 'script' ) );
		//scr.onload dealt with individually by each handler
		scr.src = COR.path + `js/handlers/${ parser }`;
		//scr.src = `js/handlers/${ parser }`;

	} else {

		obj.handle();

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