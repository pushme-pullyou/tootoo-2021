# Drawing


## Drawing SVG

* https://www.autodraw.com/
	* Draws for you
* https://sketch.io/sketchpad
	* exports to svg
	* good for handwriting
	* Closed source
* https://boxy-svg.com/
	* for drawing not handwriting
* https://keep.google.com/
	* no svg export
* https://www.hand-write.com/
	* s pen support 2014
* https://inker.co
	* for drawing
* https://editor.method.ac/
	* GH 2021 / drawing / No SVG
* https://squidnotes
	* Available as an app only??
* vectr.com
	* for drawing not handwriting

Tech on GitHub

* http://drawsvg.org/drawsvg.html ***
	* https://github.com/DRAWSVG/drawsvg-editor
* https://yqnn.github.io/svg-path-editor/
* https://frangoteam.github.io/editor
* https://n-peugnet.github.io/image-map-creator/
* https://svgstud.io/

Portal

* https://www.justinmind.com/blog/11-great-free-paid-svg-editors-for-ux-designers/
* https://www.pngtosvg.com/blog/top-24-online-and-offline-vector-graphics-editor/
* https://www.sitepoint.com/6-free-web-based-svg-editors-compared/



## Android

## Autodesk Sketchbook

* Can set image size
* Saves directly to Drive
* Many cool brushes
* UI complex though

### Google Canvas

* Can export png to Google Drive
* Then open with irfanview

### OneNote

* Export to PDF

### Squid


### Evernote


### CANVAS

		const size = 512;
		canvas = parent.locationMap.appendChild( document.createElement( 'canvas' ) );
		canvas.width = canvas.height = size;
		canvas.style.cssText = 'border: 1px solid gray; ';
		context = canvas.getContext( '2d' );

	function canvasText( text, color ) {
		var canvas = document.createElement( 'canvas' );
		var context = canvas.getContext( '2d' );

		context.font = '18px sans-serif';
		var width = context.measureText( text );

		canvas.width = ( width.width + 10 ) ; // 480
		canvas.height = 20;

		context.fillStyle = color;
		context.fillRect( 0, 0, canvas.width, canvas.height);

		context.lineWidth = 1 ;
		context.strokeStyle = '#000';
		context.strokeRect( 0, 0, canvas.width, canvas.height);

		context.fillStyle = '#000' ;
		context.font = '18px sans-serif';
		context.fillText( text, 5, 17 );

		var texture = new THREE.Texture( canvas );
		texture.needsUpdate = true;
		return texture;

	}
