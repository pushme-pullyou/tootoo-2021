// copyright 2021 Theo Armour. MIT license.
/* global COR, MNU, GRVdivDetails, GRVdivFolders, GRVdivGitHubRepoTreeView, divPopUp, navMenu */
// jshint esversion: 6
// jshint loopfunc: true

const GRV = {};

GRV.urlHome = "https://www.ladybug.tools/3d-models/";

GRV.info = `
Right-click folder names to bring up the context menu to open and close multiple folders.<br>
<br>
File: grv-github-repo-tree-view.js<br>
Name space: GRV<br>
Release: 2021-09-18<br>
<button onclick=GRV.test()>Testing: view all files in this repository</button>`;

GRV.intro = `
<p>This menu displays a tree view of all folders and files in the selected GitHub repository.</p>
`
GRV.urlViewer = "";

GRV.menuAll = "Display all the folders and files in the repository";
GRV.menuCurated = "Display curated list of folders and files";


//GRV.getFiles = GRV.getFilesCurated;


GRV.init = function ( { user = COR.user, repo = COR.repo, branch = COR.branch } = {} ) {

	GRV.accessToken = localStorage.getItem( 'githubAccessToken' ) || "";

	GRV.ignoreFolders = []; //COR.defaultIgnoreFolders.slice() || [];

	// check if GRV.repo could be better
	const menuType = GRV.getFiles === GRV.getFilesAll ? GRV.menuCurated : GRV.menuAll;
	const htm = `
<details id=GRVdet ontoggle=GRV.toggleMenu(); >

	<summary id=GRVsumRepo class="summary-primary gmd-1" title="View selected items">
		<span id=GRVsumTitle >${ COR.repo } folders & files</span>
		${ MNU.addInfoBox( GRV.info ) }
	</summary>


	<div class=divNavResize>

	<div id=GRVdivIntro >${ GRV.intro }</div>

		<div id=GRVdivGitHubRepoTreeView></div>

		<p><button id=GRVbutMenu onclick=GRV.toggleMenu() >${ menuType }</button></p>

	</div>

</details>`;

	GRVdivDetails.innerHTML = htm;

};



GRV.getRepo = function ( user = COR.user, repo = COR.repo, branch = COR.branch ) {

	GRV.user = user;
	GRV.repo = repo;
	GRV.branch = branch;


	//GRV.urlApi = `https://api.github.com/repos/${ user }/${ repo }/git/trees/${ branch }?recursive=1`;
	GRV.urlApi = `https://api.github.com/repos/${ GRV.user }/${ GRV.repo }/git/trees/${ GRV.branch }?recursive=1`;
	GRV.urlSource = `https://github.com/${ GRV.user }/${ GRV.repo }/tree/${ GRV.branch }/`;
	GRV.urlViewer = GRV.repo.startsWith( GRV.user ) ? `https://${ GRV.user }.github.io/` : `https://${ GRV.user }.github.io/${ GRV.repo }/`;
	GRV.links = undefined;
	//location.hash = "";

	GRV.requestFile( GRV.urlApi, GRV.onLoadTree );

};



GRV.requestFile = function ( url = GRV.urlApi, callback = GRV.onLoadTree ) {

	const xhr = new XMLHttpRequest();
	xhr.open( "GET", url, true );
	if ( GRV.accessToken ) {

		xhr.setRequestHeader( "Authorization", "token " + GRV.accessToken );

	}
	xhr.responseType = "json";
	xhr.onerror = ( xhr ) => console.log( "error:", xhr );
	//xhr.onprogress = ( xhr ) => console.log( "bytes loaded:", xhr.loaded );
	xhr.onload = ( xhr ) => callback( xhr.target.response );
	xhr.send( null );

};



GRV.onLoadTree = function ( json ) {
	//console.log( "json", json );

	const tree = json.tree.slice();

	const subtrees = tree.filter( item => item.type === "tree" )
		.map( subtree => subtree.path.split( "/" ) );
	//console.log( "subtrees", subtrees );

	const folders = [];

	for ( let path of subtrees ) {

		let count = 0;

		for ( let ignore of GRV.ignoreFolders ) {

			if ( path[ 0 ] === ignore ) { count++; }

		}

		if ( count === 0 ) { folders.push( path ); }

	}

	const files = tree.filter( obj => obj.type === "blob" ).map( subtree => subtree.path );
	//console.log( "files", files );
	GRV.files = files;

	const htm = `
	<div id=GRVdivFolders >
		<!-- <p>Use right-click menu to open or close all folders</p> -->
		${ GRV.subtreesToDetails( folders, files ).join( "" ) }
	</div>`;

	let filesRoot;

	if ( GRV.getFiles === GRV.getFilesCurated ) {

		filesRoot = files
			.filter( file => !file.includes( "/" ) )
			.filter( file => !["404.html", "index.html","readme.html"].includes( file ) )
			.filter( file => COR.filterFiles.includes( file.split( "." ).pop().toLowerCase() ) )
			.map( ( item, i ) => `
		<div class=GRVdiv >
			<a href="#${ GRV.urlHome }${ item }" >${ item.split( "." ).shift().replace( /-/g, " " ) }</a>
		</div>`);

	} else {

		filesRoot = files
			.filter( file => !file.includes( "/" ) )
			//.filter( file => file.endsWith( ".md" ) )
			.map( ( item, i ) => `
		<div class=GRVdiv >
			<a href="${ GRV.urlSource }${ item }" title="Source code on GitHub. Edit me!" target="_blank" >
			${ COR.iconGitHub }</a>
			<a href="#${ GRV.urlHome }${ item }" >${ item.split( "/" ).pop() }</a>
			<a href="${ GRV.urlViewer }${ item }" title="Link to just this file. Open file in new tab." target="_blank" >${ COR.iconExternalFile }</a>
		</div>`);

	}

	GRVdivGitHubRepoTreeView.innerHTML = filesRoot.join( "" ) + htm;

	window.addEventListener( "hashchange", GRV.onHashChange, false );

	GRVdivFolders.addEventListener( "contextmenu", GRV.onContextMenu );

	GRV.onHashChange();

};



GRV.onHashChange = function () {

	if ( !GRV.links ) {

		GRV.links = Array.from( GRVdivGitHubRepoTreeView.querySelectorAll( "a" ) );
	}

	GRV.links.forEach( link => link.parentNode.classList.remove( "highlight" ) );

	const str = location.hash ? location.hash.slice( 1 ) : GRV.urlHome  + COR.defaultFile;
	//const str = location.hash.slice( 1 );
	const item = GRV.links.find( a => a.getAttribute( "href" ).includes( str ) );
	//console.log( "item", item );

	if ( item && item.parentNode ) {

		item.parentNode.classList.add( "highlight" );
		//console.log( "item.parentNode", item.parentNode );

		item.parentNode.parentNode.open = true;

	}


	// item.parentNode.parentNode.parentNode.open = true;

	// if ( item.parentNode.parentNode.parentNode.parentNode ) {

	// 	item.parentNode.parentNode.parentNode.parentNode.open = true;

	// }

	// if ( item && item.parentNode ) {

	// 	item.parentNode.classList.add( "highlight" );

	// }

	// if ( item && item.parentNode.parentNodeitem ) {

	// 	item.parentNode.parentNodeitem.parentNode.parentNode.open = true;

	// 	item.parentNode.parentNode.parentNode.open = true;

	// 	if ( item.parentNode.parentNode.parentNode.parentNode ) {

	// 		item.parentNode.parentNode.parentNode.parentNode.open = true;

	// 	}

	// }

	//item.scrollIntoView();

};



GRV.subtreesToDetails = function ( subtrees, files ) {
	//console.log( "subtrees", subtrees );
	//console.log( "files", files );

	let lengthSlicePrevious = 0;

	const htmArr = subtrees.map( ( subtree, index ) => {
		//let closer = "</details>";
		let closer = "";

		const subtreeTitle = subtree.slice( -1 );
		const subtreeSlice = subtree.slice( 0, -1 );
		//const subtreeSliceJson = JSON.stringify( subtreeSlice );

		if ( subtreeSlice.length === lengthSlicePrevious ) {
			closer = "</details>";
			//console.log( "len same", subtreeSlice   );
		}

		if ( subtreeSlice.length < lengthSlicePrevious ) {
			const diff = lengthSlicePrevious - subtreeSlice.length + 1;
			closer = Array( diff ).fill( "</details>" ).join( "" );
			//console.log( "len shorter", subtreeTitle, diff, subtreeSlice, subtreeSlice.length, lengthSlicePrevious );
		}

		lengthSlicePrevious = subtreeSlice.length;

		//console.log( "lengthSlicePrevious", lengthSlicePrevious );

		const GRVclass = lengthSlicePrevious !== 0 ? "summary-tertiary" : "summary-secondary";
		const filesHtm = GRV.getFiles( subtree, files );

		//console.log( "subtreeTitle", subtreeTitle );

		// eel
		const detOpen = ""; //subtreeTitle[ 0 ] === "pages" ? "open" : "";

		//GRV.files = files;

		return `
		${ closer }
		<details id=GRVdet${ index } class="GRVdet" onToggle = GRV.onDetToggle("${ subtreeTitle }") ${ detOpen }>
			<summary class=${ GRVclass } >${ subtreeTitle }</summary>
			${ filesHtm.join( "" ) }
		`;
	} );

	//console.log( "htmArr", htmArr );

	return htmArr;
};



GRV.onDetToggle = function ( title ) {

	//console.log( "title", title );
	//console.log( "hash", location.hash );

	if ( !location.hash.includes( title ) ) {

		const readme = GRV.files.find( file => file.endsWith( title + "/README.md" ) );

		if ( readme ) { location.hash = readme; }

	}

};



GRV.getFilesAll = function ( subtree, files ) {
	//console.log( "files", files );
	//console.log( "subtree", subtree );

	const str = subtree.join( "/" );
	//console.log( "str", str );

	const filtered = files
		.filter( file => file.slice( 0, file.lastIndexOf( "/" ) ) === str )
		.map( item => `
		<div class=GRVdiv>
			<a href="${ GRV.urlSource }${ item }" title="Source code on GitHub" target="_blank" >
			${ COR.iconGitHub }</a>
			<a href="#${ GRV.urlHome }${ item }" title="">${ item.split( "/" ).pop() }</a>
			<a href="${ GRV.urlViewer }${ item }" title="Open file in new tab"  target="_blank" >
			${ COR.iconExternalFile }</a>
		</div>`);

	return filtered;
};



GRV.getFilesCurated = function ( subtree, files ) {

	// console.log( "subtree", subtree );
	// console.log( "files", files );

	const str = subtree.join( "/" );

	//console.log( "str", str );

	const filtered = files
		.filter( file => file.slice( 0, file.lastIndexOf( "/" ) ) === str )
		//.filter( file => file.endsWith( ".md" ) || file.endsWith( ".jpg" ) || file.endsWith( ".pdf" ) )
		.filter( file => COR.filterFiles.includes( file.split( "." ).pop().toLowerCase() ) )
		.map( item => `
		<div style="margin: 5px 0;" >
			<a href="#${ GRV.urlHome }${ item }" title="" onclick="JavaScript:if(window.innerWidth<640||window.innerHeight<500){navMenuDet.open=false;}" >${ item.split( "/" ).pop().split( "." ).shift().replace( /-/g, " " ) }</a>
		</div>`);

	return filtered;

};



GRV.toggleMenu = function () {

	if ( GRVbutMenu.innerText === GRV.menuAll ) {
		GRVbutMenu.innerHTML = GRV.menuCurated;
		GRV.getFiles = GRV.getFilesAll;
		GRV.ignoreFolders = [];


	} else {

		GRVbutMenu.innerHTML = GRV.menuAll;
		GRV.getFiles = GRV.getFilesCurated;
		GRV.ignoreFolders = COR.defaultIgnoreFolders;
	}

	//console.log( "", GRV.getFiles );
	GRV.getRepo();

};

////////////

GRV.onContextMenu = function ( event ) {

	event.preventDefault();

	console.log( "event", event.target.parentNode );

	//el = event.target.parentNode;

	if ( !window.divPopUp ) {

		divPopUp = document.body.appendChild( document.createElement( 'div' ) );

	}

	divPopUp.classList.add( "infoTooltip" );
	//divPopUp.style.cssText = `border: 1px solid red; width: 10rem; position: absolute;`
	divPopUp.style.display = "block";
	divPopUp.style.left = event.pageX - 10 + "px";
	divPopUp.style.top = event.pageY - 10 + "px";
	divPopUp.style.zIndex = "50";

	const htm = `

	<div><button onclick=GRV.toggleChildren(GRVdivFolders,true); >open all</button></div>
	<div><button onclick=GRV.toggleChildren(GRVdivFolders,false); >close all</button></div>
	<hr>
	<div><button onclick=GRV.toggleChildren(${ event.target.parentNode.id },true); >open children</button></div>
	<div><button onclick=GRV.toggleChildren(${ event.target.parentNode.id },false); >close children</button></div>
	`;

	divPopUp.innerHTML = htm;

	window.addEventListener( "click", GRV.onClick );

};


GRV.toggleChildren = function ( element = GRVdivFolders, boole = false ) {

	//console.log( "el", element, element.querySelectorAll( "details" ) )

	element.open = boole;

	element.querySelectorAll( "details" ).forEach( detail => detail.open = boole );

};



GRV.onClick = function () {

	divPopUp.style.display = "none";

	divPopUp.innerHTML = "";

	window.removeEventListener( "click", GRV.onClick );

};


////////////

GRV.test = function () {

	const links = GRVdivGitHubRepoTreeView.querySelectorAll( "a" );
	console.log( "links", links );

	//console.log( "GRV.links", GRV.links );

	let i = 1;

	nextLink();

	function nextLink () {

		GRV.links[ i ].click();

		if ( i < GRV.links.length - 2 ) {

			i += 3;

			setTimeout( nextLink, 1000 );

		} else {

			console.log( "number of flies opened:", ( i - 1 ) / 3 );

		}
	}
};
