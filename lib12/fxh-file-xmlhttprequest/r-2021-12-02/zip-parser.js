
const ZIP = {};


ZIP.readFile = function ( file = FRX.file ) {

	//console.log( "file", FRX.file );

	JSZip.loadAsync( FRX.file )

		.then( ( zip ) => {

			console.log( "zip", zip );

			ZIP.zip = zip;

			ZIP.getNames( zip );

			//ZIP.getZipContents( names[ 0 ], zip );

		} )

		.catch( error => { console.error( "There has been a problem with your file operation:", error ); } );

};



ZIP.onChange = function () {


	if ( !window.JSZip ) {

		FRX.loadLoaders( ZIP, ZIP.src, ZIP.fetchZipFile );

		return;

	}

	FRX.loadLoaders( ZIP, ZIP.src, ZIP.fetchZipFile );

};


ZIP.fetchZipFile = function ( e ) {

	//url = url || "https://pushme-pullyou.github.io/tootoo-2021/" + FRX.url.slice( 2 )
	//console.log( "e", e );

	fetch( FRX.url )

		.then( response => {

			if ( !response.ok ) { throw new Error( "Error" + response.statusText ); }

			return response.blob();

		} )

		.then( JSZip.loadAsync )

		.then( zip => {

			ZIP.zip = zip;

			ZIP.getNames();

		} )

		.catch( error => {
			console.error( "There has been a problem with your fetch operation:", error );
		} );

};




ZIP.getNames = function () {

	ZIP.names = [];

	ZIP.zip.forEach( ( relativePath, zipEntry ) => {
		//console.log( "zipEntry.name", zipEntry.name );
		ZIP.names.push( zipEntry.name );
	} );

	// console.log( "names", names );

	if ( ZIP.names.length === 1 ) {

		ZIP.getZipContents( ZIP.names );
	}

	if ( ZIP.target ) {

		const htm = `
<h3>${ FRX.file.name }</h3>
<p>
<select id=ZIPselFiles  multiple size=10 width=100%></select>
</p>
<p>
<button onclick=ZIP.getZipContents(ZIPselFiles) >Process selected files</button>
</p>
`;

		ZIP.target.innerHTML = htm;

		namesSelected = ZIP.names.filter( name => name.toLowerCase().endsWith( "rad" ) );

		ZIPselFiles.innerHTML = namesSelected.map( name => `<option>${ name }</option>` ).join( "" ) + "<br>";

	}

	//return names;

};



ZIP.getZipContents = function ( fileNames ) {

	ZIP.fileNames = fileNames;

	if ( !Array.isArray( fileNames ) ) {

		ZIP.fileNames = Array.from( fileNames.selectedOptions ).map( option => option.innerText );

		if ( fileNames.length > 1 ) {

			chkNewFile.checked = false;

			THR.group = THR.getGroupNew();

		}

	}


	for ( let fileName of ZIP.fileNames ) {

		console.log( "fileName", fileName );

		extension = fileName.split( "." ).pop().toLowerCase();

		ZIP.zip.file( fileName ).async( "uint8array" )

			.then( function ( uint8array ) {

				let text;
				//console.log( "text", text );

				if ( uint8array[ 0 ] !== 255 || uint8array[ 0 ] === 239 || uint8array[ 0 ] === 60 ) {

					text = new TextDecoder( "utf-8" ).decode( uint8array );
					//console.log( 'text', text );

				} else {

					const arr = new Uint8Array( uint8array.length / 2 );
					let index = 0;

					for ( let i = 0; i < uint8array.length; i++ ) {

						if ( i % 2 === 0 ) {

							arr[ index++ ] = uint8array[ i ];

						}

					}

					text = new TextDecoder( "utf-8" ).decode( arr );

				}

				const regex = /encoding="utf-16"/i;

				return text.match( regex ) ? text.slice( 1 ).replace( regex, "" ) : text;

			} )

			.then( text => {
				//divMainContent.innerText = text;

				FRX.content = text;
				FRX.file = "";
				FRX.url = "";

				FRX.zipFileName = fileName;

				FRX.selectHandler( fileName );

			} )

			.catch( error => {
				console.error( "There has been a problem with your fetch operation:", error );
			} );

	}
};

