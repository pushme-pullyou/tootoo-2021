


const ZIP = {};

ZIP.src = "https://cdn.jsdelivr.net/npm/jszip@3.7.1/dist/jszip.min.js";
ZIP.files = [ "LICENSE", "NPP_16.stl", "Photo Album_Example Auckland.pdf", "README.md", "Structural_MRI_animation.ogv.240p.webm", "ca_cs.xls", "code-of-conduct.md", "concept.md", "envmap.png", "heritage-front.jpg", "markdown-help.md", "markdown.md", "noun_Information_585560.svg", "pano.mp4", "readme.html", "sample.md", "snippets.txt", "style-sample-tags.html", "system-map.gif", "test-case.zip", "text-to-hack-3.html", "text-to-hack.html", "text.txt", "the-scream.jpg", "tree.obj", "us-county-state-latlon-pop.csv" ];



ZIP.writeZip = function ( files = ZIP.files ) {

	if ( !ZIP.zip ) {

		const scr = document.body.appendChild( document.createElement( 'script' ) );
		scr.onload = () => {
			ZIP.zip = new JSZip();
			ZIP.AddFilesToZip( files );
		};
		scr.src = ZIP.src;

		return;

	}

	ZIP.AddFilesToZip( files );

};



ZIP.AddFilesToZip = function ( files ) {

	files = Array.isArray( files ) ? files : [ files ];

	for ( let file of files ) {

		ZIP.zip.file( file, "Hello World\n" );

	}

	ZIP.saveZip();

};



ZIP.saveZip = function () {

	ZIP.zip.generateAsync( { type: "blob" } ).then( ( content ) => ZIP.saveAs( content, "example.zip" ) );

};


ZIP.saveAs = function ( content, fileName ) {

	const blob = new Blob( [ content ] );
	let a = document.createElement( "a" );
	a.href = window.URL.createObjectURL( blob );
	a.download = fileName;
	a.click();
	a = null;

};
