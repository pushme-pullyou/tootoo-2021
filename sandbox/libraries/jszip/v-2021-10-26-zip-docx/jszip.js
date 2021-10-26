


const ZIP = {};

ZIP.scripts = [
	"https://cdn.jsdelivr.net/npm/jszip@3.7.1/dist/jszip.min.js",
	"https://cdn.jsdelivr.net/npm/mammoth@1.4.19/mammoth.browser.min.js"
];

ZIP.fileNames = [ "LICENSE", "NPP_16.stl", "Photo Album_Example Auckland.pdf", "README.md", "Structural_MRI_animation.ogv.240p.webm", "ca_cs.xls", "code-of-conduct.md", "concept.md", "envmap.png", "heritage-front.jpg", "markdown-help.md", "markdown.md", "noun_Information_585560.svg", "pano.mp4", "readme.html", "sample.md", "snippets.txt", "style-sample-tags.html", "system-map.gif", "test-case.zip", "text-to-hack-3.html", "text-to-hack.html", "text.txt", "the-scream.jpg", "tree.obj", "us-county-state-latlon-pop.csv" ];


ZIP.init = function () {

	ZIP.loadScripts();

	ZIP.getFiles();

};


ZIP.loadScripts = function ( scripts = ZIP.scripts ) {

	scripts = Array.isArray( scripts ) ? scripts : [ scripts ];


	for ( script of scripts ) {

		const load = document.body.appendChild( document.createElement( 'script' ) );
		load.src = script;

	}

	return;

};


ZIP.getFiles = function () {

	ZIP.base = "../../../../../zzz-diary/10/";
	ZIP.count = 0;
	ZIP.fileNames = [];

	for ( let i = 1; i < 32; i++ ) {

		const day = ( "0" + i ).slice( -2 );
		ZIP.fileNames[ i - 1 ] = "10" + day;

	}

	console.log( "files", ZIP.fileNames );

};



ZIP.getZip = function () {

	ZIP.zip = new JSZip();
	ZIP.requestFile();

};




ZIP.requestFile = function () {

	const url = ZIP.base + ZIP.fileNames[ ZIP.count ] + ".docx";

	console.log( "url", url );

	const xhr = new XMLHttpRequest();
	xhr.open( "GET", url, true );
	xhr.responseType = "arraybuffer";
	xhr.onerror = ( xhr ) => console.log( "error:", xhr );
	//xhr.onprogress = ( xhr ) => console.log( "bytes loaded:", xhr.loaded );
	xhr.onload = ( xhr ) => {

		text =

			mammoth.extractRawText( { arrayBuffer: xhr.target.response } )
			.then( event => {
				const text = event.value;

				divContent.innerText += text;

				ZIP.zip.file( ZIP.fileNames[ ZIP.count ] + ".txt", event.value );
				ZIP.count++;
				if ( ZIP.count < ZIP.fileNames.length ) { ZIP.requestFile(); }

			} );

	};

	xhr.send( null );

};



ZIP.saveZip = function ( fileName = "example.zip" ) {

	ZIP.zip.generateAsync( { type: "blob" } ).then( ( content ) => {

		console.log( "content", content );

		const blob = new Blob( [ content ] );
		let a = document.createElement( "a" );
		a.href = window.URL.createObjectURL( blob );
		a.download = fileName;
		a.click();
		a = null;

	} );

};
