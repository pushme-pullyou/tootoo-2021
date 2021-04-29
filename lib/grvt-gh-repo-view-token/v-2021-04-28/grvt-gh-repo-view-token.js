
GRVT = {};


GRVT.init = () => {

	GRVT.title = document.title ? document.title : location.href.split( "/" ).pop().slice( 0, - 5 ).replace( /-/g, " " );
	GRVT.token = COR.token;
	GRVT.user = COR.user || "pushme-pullyou";
	GRVT.repo = COR.repo || "tootoo-2021";
	GRVT.branch = COR.branch || "main";
	GRVT.path = COR.path || "../../../";
	GRVT.defaultFile = "README.md";
	GRVT.ignoreFolders = [];
	GRVT.source = COR.source;
	GRVT.version = "2021-04-28";
	GRVT.description = `Display all folders and files in a GitHub repository in a tree view menu <br>
	<button onclick=GRVT.test() > Testing: view all files in this repository</button >`;

	GRVT.iconOctoCat = `<img width=14 src="${ GRVT.path }lib/assets/icons/octicon.svg">`;
	GRVT.link = `<img width=14 src="${ GRVT.path }lib/assets/icons/icon-link-external.svg">`;
	GRVT.pencil = `<img width=14 src="${ GRVT.path }lib/assets/icons/noun_Pencil_2995943.svg">`;


	GRVTdivGitHubRepoViewToken.innerHTML = `

<details id=GRVTdetMenu>

	<summary id=GRVTsumTitle class="summary-primary gmd-1" title="View selected items">

		View Repository Folders & Files

		<span class="info">
			<img class=infoImg src="${ GRVT.path }/lib/assets/icons/noun_Information_585560.svg">
			<div class="infoTooltip gmd-5">
			<div>${ GRVT.description }</div>
			version <span>${ GRVT.version }</span>
			</div>
		</span>

	</summary>

	<div class=divNavResize>

		<div id=GRVdivMessage ></div>

		<div id=GRVdivGitHubRepoTreeView></div>

	</div>

	<div id=GRVTdivLog></div>

</details>`;


};




GRVT.getRepo = function ( user = GRVT.user, repo = GRVT.repo, branch = GRVT.branch ) {

	GRVT.user = user;
	GRVT.repo = repo;
	GRVT.branch = branch;

	//GRVT.urlApi = `https://api.github.com/repos/${ user }/${ repo }/git/trees/${ branch }?recursive=1`;
	GRVT.urlApi = `https://api.github.com/repos/${ GRVT.user }/${ GRVT.repo }/git/trees/${ GRVT.branch }?recursive=1`;
	GRVT.urlSource = `https://github.com/${ GRVT.user }/${ GRVT.repo }//tree/${ GRVT.branch }/`;
	GRVT.urlViewer = repo.startsWith( user ) ? `https://${ user }.github.io/` : `https://${ user }.github.io/${ repo }/`;
	GRVT.links = undefined;
	//location.hash = "";

	GRVT.requestFile( GRVT.urlApi, GRVT.onLoadTree );

};


GRVT.requestFile = function ( url = GRVT.urlApi, callback = GRVT.onLoadTree ) {

	const xhr = new XMLHttpRequest();
	xhr.open( "GET", url, true );
	xhr.responseType = "json";
	xhr.setRequestHeader( "Authorization", "token " + GRVT.token );
	xhr.onerror = ( xhr ) => console.log( "error:", xhr );
	//xhr.onprogress = ( xhr ) => console.log( "bytes loaded:", xhr.loaded );
	xhr.onload = ( xhr ) => callback( xhr.target.response );
	xhr.send( null );

};


GRVT.onLoadTree = function ( json ) {
	//console.log( "json", json );

	const tree = json.tree.slice();

	const subtrees = tree.filter( item => item.type === "tree" )
		.map( subtree => subtree.path.split( "/" ) );
	//console.log( "subtrees", subtrees );

	const folders = [];

	for ( let path of subtrees ) {

		// let count = 0;

		// for ( let ignore of GRVT.ignoreFolders ) {

		// 	if ( path[ 0 ] === ignore ) { count++; }

		// }

		// if ( count === 0 ) { folders.push( path ); }

		if ( path.includes( "html-samples" ) ) { folders.push( path ); }

	}

	const files = tree.filter( obj => obj.type === "blob" ).map( subtree => subtree.path );
	// console.log( "files", files );
	GRVT.files = files;

	const htm = `
	<div id=GRVdivFolders >
		<!-- <p>Use right-click menu to open or close all folders</p> -->
		${ GRVT.subtreesToDetails( folders, files ).join( "" ) }
	</div>`;

	let filesRoot;

	if ( GRVT.getFiles === GRVT.getFilesSimple ) {

		filesRoot = files
			.filter( file => !file.includes( "/" ) )
			.filter( file => file.endsWith( ".md" ) )
			.map( ( item, i ) => `
		<div class=GRVdiv >
			<a href="#${ item }" >Home</a>
		</div>`);

	} else {

		filesRoot = files
			.filter( file => !file.includes( "/" ) )
			.filter( file => !file.endsWith( "html" ) )
			.filter( file => file.endsWith( ".md" ) )
			.map( ( item, i ) => `
<div class=GRVdiv >
	<a href="${ GRVT.urlSource }${ item }" title="Source code on GitHub. Edit me!" target="_blank" >
	${ GRVT.iconOctoCat }</a>
	<a href="#${ item }" >${ item.split( "/" ).pop() }</a>
	<a href="${ GRVT.urlViewer }${ item }" title="Link to just this file. Open file in new tab." target="_blank" >
		${ GRVT.link }</a>
</div>`);

	}

	//GRVdivGitHubRepoTreeView.innerHTML = filesRoot.join( "" ) + htm;

	GRVdivGitHubRepoTreeView.innerHTML = htm;

	GRVdet0.open = true;

	window.addEventListener( "hashchange", GRVT.onHashChange, false );

	//GRVdivFolders.addEventListener( "contextmenu", GRVT.onContextMenu );

	GRVT.onHashChange();

};



GRVT.onHashChange = function () {

	if ( !GRVT.links ) {

		GRVT.links = Array.from( GRVdivGitHubRepoTreeView.querySelectorAll( "a" ) );
	}

	GRVT.links.forEach( link => link.parentNode.classList.remove( "highlight" ) );

	const str = location.hash ? location.hash.slice( 1 ) : GRVT.defaultFile;
	//const str = location.hash.slice( 1 );
	const item = GRVT.links.find( a => a.getAttribute( "href" ).includes( str ) );
	//console.log( "item", item );

	//item.parentNode.classList.add( "highlight" );
	//console.log( "item.parentNode", item.parentNode );

	//item.parentNode.parentNode.open = true;

	//item.parentNode.parentNode.parentNode.open = true;

	// if ( item.parentNode.parentNode.parentNode.parentNode ) {

	// 	item.parentNode.parentNode.parentNode.parentNode.open = true;

	// }

	if ( item && item.parentNode ) {

		item.parentNode.classList.add( "highlight" );

	}

	if ( item && item.parentNode.parentNodeitem ) {

		item.parentNode.parentNodeitem.parentNode.parentNode.open = true;

		item.parentNode.parentNode.parentNode.open = true;

		if ( item.parentNode.parentNode.parentNode.parentNode ) {

			item.parentNode.parentNode.parentNode.parentNode.open = true;

		}

	}

	//item.scrollIntoView();

	GRVTsumTitle.innerHTML = `${ GRVT.repo } repository files`;


	// if ( location.protocol === "https:" ) {

	// 	//FOX.path = `https://${ GRVT.user }.github.io/${ GRVT.repo }/`;
	// 	FOX.path = `https://cdn.jsdelivr.net/gh/${ GRVT.user }/${ GRVT.repo }@master/`;

	// }

	// FOX.onHashChange();

};



GRVT.subtreesToDetails = function ( subtrees, files ) {
	//console.log( "subtrees", subtrees );
	//console.log( "files", files );

	let lengthSlicePrevious = 0;

	const htmArr = subtrees.map( ( subtree, index ) => {
		//let closer = "</details>";
		let closer = "";

		const subtreeTitle = subtree.slice( -1 );
		const subtreeSlice = subtree.slice( 0, -1 );
		const subtreeSliceJson = JSON.stringify( subtreeSlice );

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

		const filesHtm = GRVT.getFiles( subtree, files );

		//console.log( "subtreeTitle", subtreeTitle );

		// eel
		const detOpen = ""; //subtreeTitle[ 0 ] === "pages" ? "open" : "";

		//GRVT.files = files;

		return `
		${ closer }
		<details id=GRVdet${ index } class="GRVdet" onToggle = GRVT.onDetToggle("${ subtreeTitle }") ${ detOpen }>
			<summary class="GRVsum" >${ subtreeTitle }</summary>
			${ filesHtm.join( "" ) }
		`;
	} );

	//console.log( "htmArr", htmArr );

	return htmArr;
};



GRVT.onDetToggle = function ( title ) {

	//console.log( "title", title );
	//console.log( "hash", location.hash );

	if ( !location.hash.includes( title ) ) {

		const readme = GRVT.files.find( file => file.endsWith( title + "/README.md" ) );

		if ( readme ) { location.hash = readme; }

	}

};

GRVT.getFiles = function ( subtree, files ) {
	//console.log( "files", files );
	//console.log( "subtree", subtree );

	const str = subtree.join( "/" );
	//console.log( "str", str );

	const filtered = files
		.filter( file => file.slice( 0, file.lastIndexOf( "/" ) ) === str )
		.map( item => `
<div class=GRVdiv>
	<a href="${ GRVT.urlSource }${ item }" title="Source code on GitHub" target="_blank" >
	${ GRVT.iconOctoCat }</a>
	<a href="#${ item }" title="">${ item.split( "/" ).pop() }</a>
	<a href="${ GRVT.urlViewer }${ item }" title="Open file in new tab"  target="_blank" >
	${ GRVT.link }</a>

</div>`);

	//	<a href="#edit=${ item }" title="Edit this file" >${ GRVT.pencil }</a>
	return filtered;
};



GRVT.getFilesSimple = function ( subtree, files ) {

	//console.log( "subtree", subtree );

	const str = subtree.join( "/" );

	const filtered = files
		.filter( file => file.slice( 0, file.lastIndexOf( "/" ) ) === str )
		.filter( file => file.endsWith( ".md" ) || file.endsWith( ".jpg" ) || file.endsWith( ".pdf" ) )
		.map( item => `
		<div style="margin: 5px 0;" >
			<a href="#${ item }" title="" onclick="JavaScript:if(window.innerWidth<640||window.innerHeight<500){navMenuDet.open=false;}" >${ item.split( "/" ).pop().split( "." ).shift().replace( /-/g, " " ) }</a>
		</div>`);

	return filtered;

};

