const COR = {
	user: "pushme-pullyou",
	repo: "tootoo-2021",
	branch: "main",
	path: "../../../",
	defaultFile: "README.md",
	ignoreFolders: [],
	filterFiles: [ "gif", "md", "jpg", "license", "pdf", "png", "svg", "txt" ],
	urlSource: "https://github.com/pushme-pullyou/tootoo-2021/",
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
	//MNUdivSample.innerHTML = MNU.getSample();

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

	const urlGeoJson = "../../../lib/assets/geojson/cb_2019_us_county_20m.geojson";

	GJS.requestFile( urlGeoJson, GJS.onLoadGeoJson );

	THR.zoomObjectBoundingSphere();

	//HRT.init();

	CORdivStats.innerHTML = `
<p
	title="View number of objects that need rendering and total number of triangles used to create objects">
	<button onclick="THR.setStats()">setStats</button>
</p>`;

	// if running on server, keeps address bar pointed to latest dev

	if ( !location.hash && location.protocol === "https:" ) {

		window.history.pushState( "", "", "../" + location.hash );
		COR.path = "./";

	} else {

		THR.controls.autoRotate = false;

	}

};

