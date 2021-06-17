// copyright 2020 Theo Armour. MIT license.

const MNU = {};



MNU.init = function () {

	MNU.title = document.title ? document.title : location.href.split( "/" ).pop().slice( 0, - 5 ).replace( /-/g, " " );
	MNU.user = COR.user || "pushme-pullyou";
	MNU.repo = COR.repo || "tootoo-2021";
	MNU.branch = COR.branch || "main";
	MNU.path = COR.path || "../../../";
	MNU.source = COR.source;
	MNU.version = COR.version;
	MNU.description = COR.description;

	// if ( window.innerWidth > 640 && window.innerHeight > 500 ) {
	// 	detNavMenu.open = true;
	// }

	// if ( !window.MNUdivPopUp ) {
	// 	MNUdivPopUp = document.body.appendChild( document.createElement( 'div' ) );
	// 	MNUdivPopUp.id = "MNUdivPopUp";
	// 	MNUdivPopUp.hidden = true;
	// }

	// <div id=MNUdivHeader ></div>

	MNUdivHeader.innerHTML = `
<header>

	<h2>
		<a id=MNUaSource href=${ MNU.source } target="_top" title="Source code on GitHub">
			<img src="${ MNU.path }/lib/assets/icons/mark-github.svg">

		</a>

		<a href="" title="Click to reload this page">
			<span id=MNUspnTitle>${ MNU.title }</span>
			<span id=MNUspnVersion>${ MNU.version }</span>
		</a>
		&nbsp;
		<span class="info">
			<img class=infoImg src="${ MNU.path }/lib/assets/icons/noun_Information_585560.svg">
			<div class="infoTooltip gmd-5">
			<div>${ MNU.description }</div>
			version <span>${ MNU.version }</span>
			</div>
		</span>

	</h2>

</header>`;


	// <div id=MNUdivFooter ></div>
	MNUdivFooter.innerHTML = `
<footer>

	<hr>

	<center>
		<a id=MNUaIcon class=aDingbat href="javascript:sumNavMenu.scrollIntoView();" title="Scroll to top" >❦</a>
	</center>

</footer>`;

};



MNU.unhidePopUpCentered = function ( html = "howdy" ) {

	MNUdivPopUp.hidden = false;
	MNUdivPopUp.style.top = "50%";
	MNUdivPopUp.style.left = "50%";
	MNUdivPopUp.style.transform = "translate(-50%, -50%)";
	MNUdivPopUp.innerHTML = html;

};


MNU.toggleDarkMode = function ( button ) {

	if ( button.innerHTML.includes( "dark" ) ) {

		//root.style.backgroundColor = "#1e1f23";
		document.body.style.color = "#aaa";
		navMenu.style.backgroundColor = "#555";

		THR.scene.background = new THREE.Color( 0x222222 );
		//THR.scene.fog.far = 999999;

		//const summaries = document.querySelectorAll(".summary-secondary");
		//console.log( "", summaries );

		Array.from( document.querySelectorAll( "a" ) )
			.forEach( a => a.style.color = "#ccc" );

		Array.from( document.querySelectorAll( "input,select,option" ) )
			.forEach( iso => iso.style.backgroundColor = "#bbb" );

		document.documentElement.style.setProperty( "--color-2-background", "#888" );
		Array.from( document.querySelectorAll( ".summary-primary" ) )
			.forEach( sum => sum.style.backgroundColor = "#888" );

		document.documentElement.style.setProperty( "--color-3-background", "#bbb" );
		Array.from( document.querySelectorAll( ".summary-secondary" ) )
			.forEach( sum => sum.style.backgroundColor = "#bbb" );


		MNUdivPopUp.style.backgroundColor = "#333";

		button.innerHTML = "light";

		return;

	}

	//root.style.backgroundColor = "#1e1f23";
	document.body.style.color = "teal";
	navMenu.style.backgroundColor = "#fafffa";

	THR.scene.background = new THREE.Color( 0xcce0ff );
	//THR.scene.fog.far = THR.radius * 8;

	const summaries = document.querySelectorAll( ".summary-primary" );
	Array.from( summaries ).forEach( sum => sum.style.backgroundColor = "#eee" );

	divPopUp.style.backgroundColor = "#eee";

	button.innerHTML = "dark";

};


MNU.sample = `
			<details id=detFile>

				<summary class="summary-primary gmd-1" title="Open files on your device: ">file menu</summary>

				<div id=FRdivMenuFileReader></div>

				<p>
					<input type=file id=FRinpFile onchange=FR.readFile(this); accept="*">
				</p>

				<div id=FOOdivLog>to be reset</div>

				<div id=FOZdivFileOpenZip></div>

				<div id=divLog></div>

			</details>

			<details ontoggle="">

				<summary class="summary-primary gmd-1" title="View selected items">sample files gallery</summary>

				<div class=divNavResize>

					<p>Sample files you can load, view and experiment with:</p>

					<div id=GFFdivGithubFoldersFiles></div>

					<div id=GFFdivFileInfo></div>

					<br>

				</div>

			</details>

			<details class=detNavMenu id=detView ontoggle="">

				<summary class="summary-primary gmd-1" title="View selected model aspects">view menu</summary>

				<div class=divNavResize>

					<h3>test 1</h3>
					<div>

						lorem ipsum, quia dolor sit, amet, consectetur, adipisci velit, sed quia non numquam eius modi
						tempora incidunt, ut labore et dolore magnam aliquam quaerat voluptatem. ut enim ad minima
						veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea
						commodi consequatur? quis autem vel eum iure reprehenderit, qui in ea voluptate velit esse, quam
						nihil molestiae consequatur, vel illum, qui dolorem eum fugiat, quo voluptas nulla pariatur?
					</div>

					<h3>test 2 </h3>
					<div>

						lorem ipsum, quia dolor sit, amet, consectetur, adipisci velit, sed quia non numquam eius modi
						tempora incidunt, ut labore et dolore magnam aliquam quaerat voluptatem. ut enim ad minima
						veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea
						commodi consequatur? quis autem vel eum iure reprehenderit, qui in ea voluptate velit esse, quam
						nihil molestiae consequatur, vel illum, qui dolorem eum fugiat, quo voluptas nulla pariatur?
					</div>

				</div>

			</details>

			<details class=detNavMenu id=detData ontoggle=JTV.init();JTV.onLoad();>

				<summary class="summary-primary gmd-1" title="Browse the data in the file">data menu</summary>

				<div class=divNavResize>

					<p>
						<i>We need to decide what data should appear here & and how best to format it.
							Work-in-progress.</i>
					</p>

					<div id=JTHdivJsonTreeHelper></div>

					<div id=JTFdivJsonTreeFinder></div>

					<div id=JTEdivJsonTreeEdit></div>

					<div id=JTVdivJsonTreeView></div>

					<hr>

				</div>

			</details>
`