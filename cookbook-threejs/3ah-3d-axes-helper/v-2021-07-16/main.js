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

	sumNavMenu.hidden = false;


	THR.init();

	THR.animate();

	THR.addLights();

	THR.addGround();

	THR.group = THR.getGroupNew();

	THRU.addMeshes(100);

	THR.zoomObjectBoundingSphere();

	//axes = new THREE.Group();
	//console.log( "axes", axes );

	A3H.init();

	// FOO.init();

	// FOO.extension = "json";
	// FOO.responseType = "json";
	// FOO.onLoadFile = PP.onLoadJson;

	// path = "../../assets/json/";

	// FOO.requestFile( path + "lab_building_result.json" );

	// JTV.init();

	//HRT.init();

	// if running on server, keeps address bar pointed to latest dev

	CORdivStats.innerHTML = `
<p
	title="View number of objects that need rendering and total number of triangles used to create objects">
	<button onclick="THR.setStats()">setStats</button>
</p>`;


	if ( !location.hash && location.protocol === "https:" ) {

		window.history.pushState( "", "", "../" + location.hash );
		COR.path = "./";

	} else {

		THR.controls.autoRotate = false;

	}

};

