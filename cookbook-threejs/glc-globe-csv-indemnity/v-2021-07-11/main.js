const COR = {
	user: "pushme-pullyou",
	repo: "tootoo-2021",
	branch: "main",
	path: "../../../",
	defaultFile: "README.md",
	ignoreFolders: [],
	filterFiles: [ "gif", "md", "jpg", "license", "pdf", "png", "svg", "txt" ],
	urlSource: "https://github.com/pushme-pullyou/tootoo-2021/tree/main/lib-geo/glc-globe-csv",
	urlAssets: "https://pushme-pullyou.github.io/tootoo-2021/",
	iconGitHub: `<img src="https://pushme-pullyou.github.io/tootoo-2021/lib/assets/icons/mark-github.svg">`,
	iconInfo: `<img class=infoImg src="https://pushme-pullyou.github.io/tootoo-2021/lib/assets/icons/noun_Information_585560.svg">`,
	iconExternalFile: `<img class=infoImg  src="https://pushme-pullyou.github.io/tootoo-2021/lib/assets/icons/icon-external-link.svg">`,
	title: document.title ? document.title : location.href.split( "/" ).pop().slice( 0, - 5 ).replace( /-/g, " " ),
	version: document.head.querySelector( "[ name=date ]" ).content,
	description: document.head.querySelector( "[ name=description ]" ).content,
};


function init () {

	//COR.path = COR.assets;
	//COR.assets = COR.path;

	MNU.init();

	selYear.innerHTML = "<option>Total ( 1/10 scale of other)</option>";

	//MNUdivSample.innerHTML = MNU.getSample();

	for ( var i = 0; i < 39; i++ ) {

		selYear.innerHTML += `<option>${ 2017 - i }</option>`;

	}

	selYear.selectedIndex = 1;

	selYear.focus();


	//const htm = "Hello, World!";
	//MNU.init( { description: htm } );
	//MNUaSource.hidden = true;
	//MNUspnVersion.hidden = true;

	// FOX = File Open XHR
	//FOX.init();
	//FOXdivDetails.innerHTML = FOX.getMenu();
	//FOX.onHashChange();

	// GOR.init();
	// GORinpUser.value = COR.user + "/" + COR.repo;
	// GOR.getOrganization();
	//GORdet.open = true;

	//GRV.getFiles = GRV.getFilesAll;
	//GRV.getFiles = GRV.getFilesCurated;
	//GRV.init();
	//GRVdet.open = true;
	//GRVsumRepo.hidden = true;
	//GRV.getRepo();

	//setTimeout( () => { GRVdet253.open = true }, 200 );

	THR.init();

	THR.animate();

	THR.addLights();

	//THR.addGround();

	THR.group = THR.getGroupNew();

//	THRU.addMeshes( 100 );

	// geometry = new THREE.SphereGeometry( 50, 50, 25 );
	// material = new THREE.MeshNormalMaterial();
	// mesh = new THREE.Mesh( geometry, material );
	// THR.group.add( mesh );

	GLO.initGlobeWithBitmap();

	GJS.initGeoJson();

	const urlGeoJson = "https://pushme-pullyou.github.io/tootoo-2021/lib/assets/geojson/cb_2019_us_county_20m.geojson";

	GJS.requestFile( urlGeoJson, GJS.onLoadGeoJson );

	//THR.zoomObjectBoundingSphere();

	THR.camera.position.set( -20, -65, 60 )

	JFC.url = "https://pushme-pullyou.github.io/tootoo-2021/data/simplemaps/worldcities.csv";
	JFC.url = "https://theo-armour.github.io/maps-2021/data/soil-carbon-coalition/indemnity-geodata.csv";

	JFC.requestFile( JFC.url, JFC.onLoadCsv, JFConParseCsv );

	GLC.init();

	// HRT.init();



	CORdivStats.innerHTML = `
<p
	title="View number of objects that need rendering and total number of triangles used to create objects">
	<button onclick="THR.setStats()">View the rendering statistics</button>
</p>`;

	THR.controls.autoRotate = false;

	// if running on server, keeps address bar pointed to latest dev

	if ( !location.hash && location.protocol === "https:" ) {

		window.history.pushState( "", "", "../" + location.hash );
		COR.path = "./";

	} else {


	}

};

function JFConParseCsv ( index = 1) {

	//console.log( "", 23 );

	//console.log( "JFC.json", JFC.json );

	//barData = JFC.json.map( line => [ line[ 9 ], line[ 2 ], line[ 3 ] ] );

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


RAY.getHtm = function ( intersected ) {
	//console.log( "main intersected", intersected.instanceId );

	const county = JFC.json[ intersected.instanceId ];
	//console.log( "county", county);
	// const mesh = RAY.intersected.object;

	const htm = `
	<div>
		county: <span class=feature style=float:right;>
		<a href="https://www.google.com/search?q=${ county[ 0 ] }+county+${ county[ 1 ] }" target="_blank">${ county[ 0 ]}</a></span><br>
		state: <span class=feature >${ county[ 1 ]}</span><br>
		population: <span class=feature>${( +county[ 5 ] ).toLocaleString() }</span></br>
		year: <span class=feature >${ 2018 - selYear.selectedIndex }</span><br>
		indemnity: <span class=feature > $${ ( +county[ 45 - selYear.selectedIndex ] ) } million</span><br>
	</div>`;

	return htm;
};