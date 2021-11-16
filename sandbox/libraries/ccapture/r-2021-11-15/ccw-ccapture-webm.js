
// Create a capturer that exports a WebM video
//var capturer = new CCapture( { format: 'webm' } );

const CCW = {};
CCW.frameRate = 60;
CCW.timeLimit = 8;
CCW.progress = 0;

CCW.recorder = new CCapture( {
	verbose: false,
	display: true,
	frameRate: CCW.frameRate,
	quality: 100,
	format: 'webm',
	timeLimit: CCW.timeLimit,
	frameLimit: 0,
	autoSaveTime: 0
} );



CCW.init = function ( obj = {} ) {

	CCW.target = obj.target || divMessage;

	htm = `
<details open>

<summary>CCW CCapture WebM</summary>

	<div class="buttons">
	<p>
		<label title="Slide me">
			value: <output id=out>170</output>
			<input id=rngDistance type=range class=full-width oninput=out.value=this.value;
				min=1 max=200 value=170>
		</label>
	</p>
	<p>
		<button id="butSetup">Setup</button>
	</p>
	<p>
		<button id="butStart">Start recording to WebM</button>
	</p>
	<p>
		<button id="butStop">Stop (or wait for time limit)</button>
	</p>
	</div>
</detail>
`;

	CCW.target.innerHTML = htm;

	CCW.setupButtons();

};



CCW.setupButtons = function () {

	butSetup.addEventListener( 'click', e => {
		e.preventDefault();
		CCW.resize();
		animate = CCW.render;
		animate();
	}, false );

	butStart.addEventListener( 'click', e => {
		e.preventDefault();
		CCW.recorder.start();
		butStart.style.display = 'none';
		butStop.style.display = 'block';
	}, false );

	butStop.addEventListener( 'click', e => {
		e.preventDefault();
		CCW.recorder.stop();
		butStop.style.display = 'none';
		recorder.save();
	}, false );

};



CCW.resize = function ( width = 512, height = 512 ) {
	camera.aspect = width / height;
	camera.updateProjectionMatrix();
	renderer.setSize( width, height );
};



CCW.render = function() {

	//progress goes from 0 to 1

	const frames = CCW.frameRate * CCW.timeLimit;

	const delta = Math.PI * 2 / frames;

	mesh.rotation.x += delta;
	mesh.rotation.y += delta;

	const distance = + rngDistance.value;
	const center = scene.position;

	camera.position.x = center.x + Math.cos( CCW.progress * Math.PI * 2 ) * distance;
	camera.position.y = center.y + Math.sin( CCW.progress * Math.PI * 2 ) * distance;
	camera.position.z = center.z + Math.cos( CCW.progress * Math.PI * 2 ) * distance;

	camera.lookAt( center );

	CCW.progress += 1 / frames;

	renderer.render( scene, camera );
	CCW.recorder.capture( renderer.domElement );
	requestAnimationFrame( animate );

}