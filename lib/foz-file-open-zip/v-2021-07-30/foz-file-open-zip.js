// copyright 2021 Theo Armour. MIT license.
// jshint esversion: 6
// jshint loopfunc: true


const FOZ = {};


FOZ.onLoadFile = function ( dataZip ) {

	FOZ.timeStart = performance.now();

	const zip = new JSZip();
	const files = [];
	let fileName;

	zip.loadAsync( dataZip )

		.then( zip =>
			//console.log( 'zip', zip );
			zip.file( Object.keys( zip.files )[ 0 ] ).async( "string" )

		).then( text => {

			FOZdivFileOpenZip.innerHTML = `
<p>
	bytes loaded: ${ text.length.toLocaleString() }<br>
	time elapsed ${ ( performance.now() - FOZ.timeStart ).toLocaleString() } ms<br>
	file: ${ Object.keys( zip.files )[ 0 ] }
</p>`;

			FOZ.lines = text.split( /\r\n/ ).map( line => line.split( "|" ).map( item => item.trim() ) );

			divContent.innerText = FOZ.lines.slice( 0, 100 );

		} );

};