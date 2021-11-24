


const ZIP = {};

ZIP.src = "https://cdn.jsdelivr.net/npm/jszip@3.7.1/dist/jszip.min.js";
ZIP.fileNames = [ "LICENSE", "NPP_16.stl", "Photo Album_Example Auckland.pdf", "README.md", "Structural_MRI_animation.ogv.240p.webm", "ca_cs.xls", "code-of-conduct.md", "concept.md", "envmap.png", "heritage-front.jpg", "markdown-help.md", "markdown.md", "noun_Information_585560.svg", "pano.mp4", "readme.html", "sample.md", "snippets.txt", "style-sample-tags.html", "system-map.gif", "test-case.zip", "text-to-hack-3.html", "text-to-hack.html", "text.txt", "the-scream.jpg", "tree.obj", "us-county-state-latlon-pop.csv" ];


ZIP.getFiles = function () {

	ZIP.base = "../../../../../zzz-diary/10/";
	ZIP.count = 0;
	ZIP.fileNames = [];

	for ( let i = 1; i < 32; i++ ) {

		const day = ( "0" + i ).slice( -2 );
		ZIP.fileNames[ i - 1] = "10" + day + ".docx";

	}

	console.log( "files", ZIP.fileNames );

};



ZIP.writeZip = function ( files = ZIP.fileNames ) {

	ZIP.fileNames = Array.isArray( files ) ? files : [ files ];

	if ( !ZIP.zip ) {

		const scr = document.body.appendChild( document.createElement( 'script' ) );

		scr.onload = () => {

			ZIP.zip = new JSZip();
			ZIP.requestFile();

		};

		scr.src = ZIP.src;

		return;

	}

	ZIP.requestFile();

};





ZIP.requestFile = function () {

	//url = "https://cdn.jsdelivr.net/gh/pushme-pullyou/tootoo-2021@master/README.md";

	url = ZIP.base + ZIP.fileNames[ ZIP.count ];

	console.log( "url", url );

	const xhr = new XMLHttpRequest();
	xhr.open( "GET",url, true );
	xhr.responseType = "text";
	xhr.onerror = ( xhr ) => console.log( "error:", xhr );
	//xhr.onprogress = ( xhr ) => console.log( "bytes loaded:", xhr.loaded );
	xhr.onload = ( xhr ) => {
		//console.log( "", xhr.target.response );

		ZIP.zip.file( ZIP.fileNames[ ZIP.count ], xhr.target.response );
		console.log( "ZIP.zip", ZIP.zip );
		ZIP.saveZip();


	}
	xhr.send( null );

};

ZIP.saveZip = function () {

	ZIP.count++;

	if ( ZIP.count < ZIP.fileNames.length ) {

		ZIP.requestFile();
		return;
	}

	ZIP.zip.generateAsync( { type: "blob" } ).then( ( content ) => ZIP.saveAs( content, "example.zip" ) );

};



ZIP.saveAs = function ( content, fileName ) {

	console.log( "", content  );

	const blob = new Blob( [ content ] );
	let a = document.createElement( "a" );
	a.href = window.URL.createObjectURL( blob );
	a.download = fileName;
	a.click();
	a = null;

};
