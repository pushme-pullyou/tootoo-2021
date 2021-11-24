const ZSF = {};

ZSF.count = 0;
ZSF.base = "../../../"

ZSF.scripts = [
	"https://cdn.jsdelivr.net/npm/jszip@3.7.1/dist/jszip.min.js",
	"https://cdnjs.cloudflare.com/ajax/libs/showdown/1.9.1/showdown.min.js"
];

//ZSF.init()


ZSF.init = function () {

	ZSF.loadScripts();


};




ZSF.loadScripts = function ( scripts = ZSF.scripts ) {

	scripts = Array.isArray( scripts ) ? scripts : [ scripts ];

	for ( let script of scripts ) {

		const load = document.body.appendChild( document.createElement( 'script' ) );
		load.src = script;

	}

	return;

};


ZSF.getFiles = function () {

	ZSF.filesFiltered = GRV.files.filter( file => file.endsWith( ".md" ) );

	ZSF.zip = new JSZip();

	ZSF.getFile();

}


ZSF.getFile = function () {

	//url = "https://cdn.jsdelivr.net/gh/pushme-pullyou/tootoo-2021@master/README.md";

	url = ZSF.base + ZSF.filesFiltered[ ZSF.count ];

	console.log( "url", url );
	const options = { openLinksInNewWindow: false, excludeTrailingPunctuationFromURLs: true, ghMention: true, simplifiedAutoLink: true, simpleLineBreaks: true, emoji: true };


	const xhr = new XMLHttpRequest();
	xhr.open( "GET", url, true );
	xhr.responseType = "text";
	xhr.onerror = ( xhr ) => console.log( "error:", xhr );
	//xhr.onprogress = ( xhr ) => console.log( "bytes loaded:", xhr.loaded );
	xhr.onload = ( xhr ) => {
		//console.log( "response", xhr.target.response );

		let txt = xhr.target.response;
		txt = txt.replace( /\<!--@@@/, "" ).replace( /\@@@-->/, "" );

		htm = new showdown.Converter( options ).makeHtml( txt );
		ZSF.zip.file( ZSF.filesFiltered[ ZSF.count ].replace( /\.md/, ".htm" ), htm );
		//console.log( "ZSF.zip", ZSF.zip );
		ZSF.saveZip();


	};
	xhr.send( null );

};



ZSF.saveZip = function () {

	ZSF.count++;

	if ( ZSF.count < ZSF.filesFiltered.length ) {

		ZSF.getFile();
		return;
	}

	ZSF.zip.generateAsync( { type: "blob" } ).then( ( content ) => ZSF.saveAs( content, "example.zip" ) );

};



ZSF.saveAs = function ( content, fileName ) {

	console.log( "", content );

	const blob = new Blob( [ content ] );
	let a = document.createElement( "a" );
	a.href = window.URL.createObjectURL( blob );
	a.download = fileName;
	a.click();
	a = null;

};
