


const ZIP = {};

ZIP.scripts = [
	"https://cdn.jsdelivr.net/npm/jszip@3.7.1/dist/jszip.min.js",
	"https://cdn.jsdelivr.net/npm/mammoth@1.4.19/mammoth.browser.min.js",
	"https://cdnjs.cloudflare.com/ajax/libs/showdown/1.9.1/showdown.min.js"
];

ZIP.month = 12;

ZIP.days = [ 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];

ZIP.baseOld = `../../../../../zzz-diary/${ ZIP.month }/`;

ZIP.baseNew = `../../../../../theo-armour-qdata/journal/days-of-year-md/${ ZIP.month }/`;

//ZIP.fileNames = [ "LICENSE", "NPP_16.stl", "Photo Album_Example Auckland.pdf", "README.md", "Structural_MRI_animation.ogv.240p.webm", "ca_cs.xls", "code-of-conduct.md", "concept.md", "envmap.png", "heritage-front.jpg", "markdown-help.md", "markdown.md", "noun_Information_585560.svg", "pano.mp4", "readme.html", "sample.md", "snippets.txt", "style-sample-tags.html", "system-map.gif", "test-case.zip", "text-to-hack-3.html", "text-to-hack.html", "text.txt", "the-scream.jpg", "tree.obj", "us-county-state-latlon-pop.csv" ];


ZIP.init = function () {

	ZIP.loadScripts();

	ZIP.getFiles(); // can do while loading scripts

};


ZIP.loadScripts = function ( scripts = ZIP.scripts ) {

	scripts = Array.isArray( scripts ) ? scripts : [ scripts ];

	for ( let script of scripts ) {

		const load = document.body.appendChild( document.createElement( 'script' ) );
		load.src = script;

	}

	return;

};



ZIP.getFiles = function () {

	ZIP.count = 0;
	ZIP.fileNames = [];

	for ( let i = 1; i <= ZIP.days[ ZIP.month - 1 ]; i++ ) {

		const day = ( "0" + i ).slice( -2 );
		ZIP.fileNames[ i - 1 ] = "" + ZIP.month + day;

	}

	console.log( "files", ZIP.fileNames );

};



ZIP.getZip = function () {

	ZIP.zip = new JSZip();
	ZIP.requestFileNew();

};



ZIP.requestFileNew = function () {

	const day = ( "0" + ( 1 + ZIP.count ) ).slice( -2 );
	const url = ZIP.baseNew + ZIP.month + "-" + day + ".md";

	console.log( "url", url );

	const xhr = new XMLHttpRequest();
	xhr.open( "GET", url, true );
	xhr.responseType = "text";
	xhr.onerror = ( xhr ) => console.log( "error:", xhr );
	//xhr.onprogress = ( xhr ) => console.log( "bytes loaded:", xhr.loaded );
	xhr.onload = ( xhr ) => {
		ZIP.mdNew = xhr.target.response;
		ZIP.requestFileOld();

	};
	xhr.send( null );

};


ZIP.requestFileOld = function () {

	const url = ZIP.baseOld + ZIP.fileNames[ ZIP.count ] + ".docx";

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
					let text = event.value;

					text = text.replace( /\*\*\*/g, "## " );

					return text;

				} )
				.then( md => {

					const mdBoth = ZIP.mdNew + md;

					const htm = new showdown.Converter().makeHtml( mdBoth );

					divContent.innerHTML += htm + "\n===\n";

					ZIP.zip.file( ZIP.fileNames[ ZIP.count ] + ".htm", htm );
					ZIP.count++;
					if ( ZIP.count < ZIP.fileNames.length ) { ZIP.requestFileNew(); }
				} );

	};

	xhr.send( null );

};



ZIP.saveZip = function ( fileName = `month-${ ZIP.month }.zip` ) {

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
