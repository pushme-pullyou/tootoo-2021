const GGF = {};


GGF.init = function () {
	console.log( "", 23 );
	if ( window.prgGenerateGIF) {

	} else {

		GGFdet.innerHTML +=

			`
		<button id="butGenerateGIF" onclick=GGF.onClick();>Generate GIF</button>
		<progress id="prgGenerateGIF" value="0" max="1" style="display:none"></progress>
		<div id=divMessage></div>
		`;

	}

};


GGF.onClick = async function () {


	animation = function animation ( time ) {

		if ( prgGenerateGIF?.style.display === 'none' ) {

			// Only render when not generating

			render( ( time / 500 ) % 1 );

		}

	}

	//butGenerateGIF.style.display = 'none';
	prgGenerateGIF.style.display = '';

	// Generate

	canvas = THR.renderer.domElement;

	const buffer = await GGF.generateGIF( canvas, render, 4, 30 );

	butGenerateGIF.style.display = '';
	prgGenerateGIF.style.display = 'none';

	// Download

	const blob = new Blob( [ buffer ], { type: 'image/gif' } );

	const link = document.createElement( "a" );
	link.href = URL.createObjectURL( blob );
	link.download = `animation-${ new Date().toISOString().slice( 0, 10 ) }.gif`;
	link.click();

};



GGF.generateGIF = function ( element, renderFunction, duration = 1, fps = 30 ) {

	const frames = duration * fps;

	const canvas = document.createElement( 'canvas' );
	canvas.width = element.width;
	canvas.height = element.height;

	const context = canvas.getContext( '2d' );

	const buffer = new Uint8Array( canvas.width * canvas.height * frames * 5 );
	const pixels = new Uint8Array( canvas.width * canvas.height );
	const writer = new GifWriter( buffer, canvas.width, canvas.height, { loop: 0 } );

	let current = 0;

	return new Promise( async function addFrame ( resolve ) {

		renderFunction( current / frames );

		context.drawImage( element, 0, 0 );

		const data = context.getImageData( 0, 0, canvas.width, canvas.height ).data;

		const palette = [];

		for ( var j = 0, k = 0, jl = data.length; j < jl; j += 4, k++ ) {

			const r = Math.floor( data[ j + 0 ] * 0.1 ) * 10;
			const g = Math.floor( data[ j + 1 ] * 0.1 ) * 10;
			const b = Math.floor( data[ j + 2 ] * 0.1 ) * 10;
			const color = r << 16 | g << 8 | b << 0;

			const index = palette.indexOf( color );

			if ( index === -1 ) {

				pixels[ k ] = palette.length;
				palette.push( color );

			} else {

				pixels[ k ] = index;

			}

		}

		// Force palette to be power of 2

		let powof2 = 1;
		while ( powof2 < palette.length ) powof2 <<= 1;
		palette.length = powof2;


		const delay = 100 / fps; // Delay in hundredths of a sec (100 = 1s)
		const options = { palette: new Uint32Array( palette ), delay: delay };
		writer.addFrame( 0, 0, canvas.width, canvas.height, pixels, options );

		current++;

		prgGenerateGIF.value = current / frames;

		if ( current < frames ) {

			await setTimeout( addFrame, 0, resolve );

		} else {

			resolve( buffer.subarray( 0, writer.end() ) );

		}

	} );

};


GGF.init();