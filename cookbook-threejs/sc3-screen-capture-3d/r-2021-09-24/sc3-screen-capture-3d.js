const SC3 = {};

SC3.init = function () {

	htm = `
<details open>
<summary>Screen Capture 3d</summary>

<p>
<button onclick=SC3.captureScreen() >Capture screen</button>
</p>
<hr>

</details>`;

	SC3divScreenCapture3D.innerHTML = htm;
	
};

SC3.captureScreen = function () {

	// https://jsfiddle.net/user/2pha/fiddles/

	const win = window.open( '', '' );
	win.document.title = "Screenshot";
	//w.document.body.style.backgroundColor = "red";

	const image = new Image();
	// Without 'preserveDrawingBuffer' set to true, we must render now

	renderer.render( scene, camera );
	image.src = renderer.domElement.toDataURL();
	win.document.body.appendChild( image );

};
