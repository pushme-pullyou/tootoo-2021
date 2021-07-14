const COR = {
	user: "pushme-pullyou",
	repo: "tootoo-2021",
	branch: "main",
	path: "../../../",
	defaultFile: "README.md",
	ignoreFolders: [],
	filterFiles: [ "gif", "md", "jpg", "license", "pdf", "png", "svg", "txt" ],
	urlSource: "https://github.com/theo-armour/maps-2021/tree/main/sandbox/globe-us-county-indemnity",
	urlAssets: "https://pushme-pullyou.github.io/tootoo-2021/",
	iconGitHub: `<img src="https://pushme-pullyou.github.io/tootoo-2021/lib/assets/icons/mark-github.svg">`,
	iconInfo: `<img class=infoImg src="https://pushme-pullyou.github.io/tootoo-2021/lib/assets/icons/noun_Information_585560.svg">`,
	iconExternalFile: `<img class=infoImg  src="https://pushme-pullyou.github.io/tootoo-2021/lib/assets/icons/icon-external-link.svg">`,
	title: document.title ? document.title : location.href.split( "/" ).pop().slice( 0, - 5 ).replace( /-/g, " " ),
	version: document.head.querySelector( "[ name=date ]" ).content,
	description: document.head.querySelector( "[ name=description ]" ).content,
};


function init () {

	MNU.init();

	MNUspnVersion.hidden = true;

	selYear.innerHTML = "<option>Total ( 1/10 scale of other)</option>";


	for ( let i = 0; i < 39; i++ ) {

		selYear.innerHTML += `<option>${ 2017 - i }</option>`;

	}

	selYear.selectedIndex = 1;

	selYear.focus();

	THR.init();

	THR.animate();

	THR.addLights();

	THR.camera.position.set( -20, -65, 60 );

	THR.group = THR.getGroupNew();


	GLO.initGlobeWithBitmap();

	GJS.initGeoJson();


	const urlGeoJson = "https://pushme-pullyou.github.io/tootoo-2021/lib/assets/geojson/cb_2019_us_county_20m.geojson";

	GJS.requestFile( urlGeoJson, GJS.onLoadGeoJson );


	JFC.url = "https://theo-armour.github.io/maps-2021/data/soil-carbon-coalition/indemnity-geodata.csv";

	JFC.requestFile( JFC.url, JFC.onLoadCsv, JFConParseCsv );


	GLC.init();


	CORdivStats.innerHTML = `
<p
	title="View number of objects that need rendering and total number of triangles used to create objects">
	<button onclick="THR.setStats()">View the rendering statistics</button>
</p>`;


	// if running on server, keeps address bar pointed to latest dev

	if ( !location.hash && location.protocol === "https:" ) {

		window.history.pushState( "", "", "../" + location.hash );
		COR.path = "./";

	} else {


	}

	THR.controls.autoRotate = false; // Stop is way down here to display a bit of live rotation

};


function JFConParseCsv ( index = 1) {

	//console.log( "JFC.json", JFC.json );

	THR.group.remove( GLC.group );

	GLC.group.geometry

	GLC.group = new THREE.Group();
	GLC.group.name = "instances";
	THR.group.add( GLC.group );

	let scale = index === 0 ? 0.05 : 0.5;

	scale = scale * rngScale.value / 50;

	const barData = JFC.json.map( line => [ scale * line[ 45 - index ], +line[ 3 ], +line[ 4 ] ] );
	//console.log( "barData", barData );

	const mesh = GLC.getPoints( barData )
	//console.log( "mesh", mesh );
	GLC.group.add( mesh );

	RAY.init( GLC.group );

}

// replace default RAY.getHTM

RAY.getHtm = function ( intersected ) {
	//console.log( "main intersected", intersected.instanceId );

	const county = JFC.json[ intersected.instanceId ];
	console.log( "county", county);

	const htm = `
	<div>
		county: <span class=feature>
		<a href="https://www.google.com/search?q=${ county[ 0 ] }+county+${ county[ 1 ] }" title="Click to google it">${ county[ 0 ]}</a></span><br>
		state: <span class=feature >${ county[ 1 ]}</span><br>
		population: <span class=feature>${( +county[ 5 ] ).toLocaleString() }</span></br>
		year: <span class=feature >${ 2018 - selYear.selectedIndex }</span><br>
		indemnity: <span class=feature > $${ ( +county[ 44 - selYear.selectedIndex ] ) } million</span><br>
		total (1979-2017): <span class=feature>$${( +county[ 45 ] ).toLocaleString() }</span></br>
		fips: <span class=feature title="Click to google it"><a href="https://www.google.com/search?q=FIPS+county+${ county[ 2 ] }" target="_blank">${ county[ 2 ]}</a></span><br>
	</div>
	<div>
	<span style=color:#000;font-size:90%;> Indemnity by year</span>
	${ getBars2D( county.slice( 6, 44 ) ) }</div>`;

	return htm;

};


function getBars2D ( arr ) {

	arr.reverse();

	const max = Math.max( ...arr );
	const scale = 100 / max;
	//const dateStrings = linesCases[ 0 ].slice( 4 ).reverse();

	const bars = arr.map( ( item, index ) =>
		`<div style="background-color: cyan; color: black; margin-top:1px; height:1ch; width:${ scale * item }%;"
			title="year: ${ 2017 - index } indemnity : $${ item.toLocaleString() }">&nbsp;</div>`
	).join( "" );

	//ht = DMTdivContainer.clientHeight - 00 + "px";

	return `<div style="background-color:pink;width:100%;"
		title="Indemnity by year. Mouse over a bar to view data. Touch on phone: soon!" >${ bars }
	</div>`;

}