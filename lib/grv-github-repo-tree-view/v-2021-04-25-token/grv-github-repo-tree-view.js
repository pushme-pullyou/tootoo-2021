const GRV = {};

GRV.user = "pushme-pullyou";
GRV.repo = "tootoo-2021";
GRV.branch = "main";
GRV.path = "./";

GRV.defaultFile = "README.md";
GRV.ignoreFolders = [];
GRV.urlViewer = "";

//GRV.getFiles = GRV.getFilesSimple;


GRV.init = function () {

	GRV.iconOctoCat = `<img width=14 src="${ GRV.path }lib/assets/icons/octicon.svg">`;
	GRV.link = `<img width=14 src="${ GRV.path }lib/assets/icons/icon-link-external.svg">`;
	GRV.pencil = `<img width=14 src="${ GRV.path }lib/assets/icons/noun_Pencil_2995943.svg">`;

	//GRV.requestFile( GRV.urlApi, GRV.onLoadTree );

	GRV.accessToken = localStorage.getItem( 'githubAccessToken' ) || "";

	const htm = `
			<details open>
				<!-- 'open' triggers a run on load -->

				<summary id=GRVsumRepo class="summary-primary gmd-1" title="View selected items">
					<span id=GRVsumTitle >${ GRV.repo } repository files</span>
					<span class="info">
						<img class=infoImg src="${ GRV.path }lib/assets/icons/noun_Information_585560.svg">
						<div id="divGRV" class="infoTooltip gmd-5">
							Display all folders and files in a GitHub repository in a tree view menu<br>
							<button onclick=GRV.test()>Testing: view all files in this repository</button>
						</div>
					</span>
				</summary>

				<div class=divNavResize>

					<p>
						Access token
						<input id=GRVinpGitHubApiKey onclick=this.select(); onblur=GRV.setGitHubAccessToken();
							title="Obtain API Access Token" style=width:100%;>
					</p>

					<p><button onclick=GRV.editContent(); >edit content</button>

					<button onclick=GRV.saveContent(); >save content</button>

					</p>

					<div id=GRVdivMessage ></div>

					<div id=GRVdivGitHubRepoTreeView></div>

					<br>

				</div>

			</details>
	`;

	GRVdivDetails.innerHTML = htm;

	GRVinpGitHubApiKey.value = GRV.accessToken;
};


GRV.setGitHubAccessToken = function () {

	GRV.accessToken = GRVinpGitHubApiKey.value;

	console.log( 'accessToken', GRV.accessToken );

	localStorage.setItem( "githubAccessToken", GRV.accessToken );

};


GRV.editContent = function () {

	txt = divContentMain.innerHTML;

	const path = location.hash.slice( 1 );

	GRV.url = `https://api.github.com/repos/${ GRV.user }/${ GRV.repo }/contents/${ path }`;

	const xhr = new XMLHttpRequest();
	xhr.open( "GET", GRV.url, true );
	xhr.setRequestHeader( "Authorization", "token " + GRV.accessToken );
	xhr.responseType = "json";
	xhr.onerror = ( xhr ) => console.log( "error:", xhr );
	//xhr.onprogress = ( xhr ) => console.log( "bytes loaded:", xhr.loaded );
	xhr.onload = GRV.onLoad;
	xhr.send( null );

	divContentMain.innerHTML = `<textarea id=textareaMain style=height:100vh;width:100%;>${ txt }</textarea>`;

};

GRV.onLoad = function ( xhr ) {
	//console.log( "response", xhr );

	GRV.sha = xhr.target.response.sha;

	const content = atob( xhr.target.response.content );

	divContentMain.innerHTML = `<textarea id=textareaMain style="height:98%;width:98%;" ></textarea>`;

	textareaMain.value = content;

	GRV.content = content;

	if ( window.divMessage ) {

		divMessage.innerText = `Get:${ new Date().toLocaleString() } bytes:${ content.length } sha:${ GRV.sha }`;

	}

};

GRV.saveContent = function () {

	GRV.url = `https://api.github.com/repos/${ GRV.user }/${ GRV.repo }/contents/${ location.hash.slice( 1 ) }`

		const xhr = new XMLHttpRequest();
		xhr.open( "GET", GRV.url, true );
		xhr.setRequestHeader( "Authorization", "token " + GRV.accessToken );
		xhr.responseType = "json";
		xhr.onerror = ( xhr ) => console.log( "error:", xhr );
		//xhr.onprogress = ( xhr ) => console.log( "bytes loaded:", xhr.loaded );
		xhr.onload = ( xhr ) => {
			//console.log( "", xhr );
			GRV.sha = xhr.target.response.sha;
			GRV.putFile();
		};
		xhr.send( null );


};


GRV.putFile = function () {

	GRV.content = textareaMain.value;

	const codedData = window.btoa( GRV.content ); // encode the string

	const body = JSON.stringify( {
		"branch": GRV.branch,
		"content": codedData,
		"message": `add to file`,
		"sha": GRV.sha

	} );

	xhr = new XMLHttpRequest();
	xhr.open( "PUT", GRV.url, true );
	xhr.setRequestHeader( "Authorization", "token " + GRV.accessToken );
	xhr.setRequestHeader( "Content-Type", "application/json" );
	xhr.onerror = ( xhr ) => console.log( "error:", xhr );
	xhr.onprogress = ( xhr ) => console.log( "bytes loaded:", xhr.loaded );
	xhr.send( body );

	GRVdivMessage.innerText = `Put: ${ new Date().toLocaleString() } bytes:${ GRV.content.length } sha:${ GRV.sha }`;

};

GRV.getRepo = function (user = GRV.user, repo = GRV.repo, branch = GRV.branch  ) {

	GRV.user = user;
	GRV.repo = repo;
	GRV.branch = branch;

	//GRV.urlApi = `https://api.github.com/repos/${ user }/${ repo }/git/trees/${ branch }?recursive=1`;
	GRV.urlApi = `https://api.github.com/repos/${ GRV.user }/${ GRV.repo }/git/trees/${ GRV.branch }?recursive=1`;
	GRV.urlSource = `https://github.com/${ GRV.user }/${ GRV.repo }//tree/${ GRV.branch }/`;
	GRV.urlViewer = repo.startsWith( user ) ? `https://${ user }.github.io/` : `https://${ user }.github.io/${ repo }/`;
	GRV.links = undefined;
	//location.hash = "";

	GRV.requestFile( GRV.urlApi, GRV.onLoadTree );

};


GRV.requestFile = function ( url = GRV.urlApi, callback = GRV.onLoadTree ) {

	const xhr = new XMLHttpRequest();
	xhr.open( "GET", url, true );
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

		//for ( let ignore of GRV.ignoreFolders ) {

			//if ( path[ 0 ] === ignore ) { count++; }


		//}

		if ( path.includes( "sandbox" ) && path.includes( "html-samples" )  ) { folders.push( path ); }

		//if ( count === 0 ) { folders.push( path ); }

	}

	const files = tree.filter( obj => obj.type === "blob" ).map( subtree => subtree.path );
	// console.log( "files", files );
	GRV.files = files;

	const htm = `
	<div id=GRVdivFolders >
		<!-- <p>Use right-click menu to open or close all folders</p> -->
		${ GRV.subtreesToDetails( folders, files ).join( "" ) }
	</div>`;

	let filesRoot;

	if ( GRV.getFiles === GRV.getFilesSimple ) {

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
	<a href="${ GRV.urlSource }${ item }" title="Source code on GitHub. Edit me!" target="_blank" >
	${ GRV.iconOctoCat }</a>
	<a href="#${ item }" >${ item.split( "/" ).pop() }</a>
	<a href="${ GRV.urlViewer }${ item }" title="Link to just this file. Open file in new tab." target="_blank" >
		${ GRV.link }</a>
</div>`);

	}

	GRVdivGitHubRepoTreeView.innerHTML = filesRoot.join( "" ) + htm;

	window.addEventListener( "hashchange", GRV.onHashChange, false );

	//GRVdivFolders.addEventListener( "contextmenu", GRV.onContextMenu );

	GRV.onHashChange();

};



GRV.onHashChange = function () {

	if ( !GRV.links ) {

		GRV.links = Array.from( GRVdivGitHubRepoTreeView.querySelectorAll( "a" ) );
	}

	GRV.links.forEach( link => link.parentNode.classList.remove( "highlight" ) );

	const str = location.hash ? location.hash.slice( 1 ) : GRV.defaultFile;
	//const str = location.hash.slice( 1 );
	const item = GRV.links.find( a => a.getAttribute( "href" ).includes( str ) );
	//console.log( "item", item );

	item.parentNode.classList.add( "highlight" );
	//console.log( "item.parentNode", item.parentNode );

	item.parentNode.parentNode.open = true;

	item.parentNode.parentNode.parentNode.open = true;

	if ( item.parentNode.parentNode.parentNode.parentNode ) {

		item.parentNode.parentNode.parentNode.parentNode.open = true;

	}

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

	GRVsumTitle.innerHTML = `${ GRV.repo } repository files`;


	// if ( location.protocol === "https:" ) {

	// 	//FOX.path = `https://${ GRV.user }.github.io/${ GRV.repo }/`;
	// 	FOX.path = `https://cdn.jsdelivr.net/gh/${ GRV.user }/${ GRV.repo }@master/`;

	// }

	// FOX.onHashChange();

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

		const filesHtm = GRV.getFiles( subtree, files );

		//console.log( "subtreeTitle", subtreeTitle );

		// eel
		const detOpen = ""; //subtreeTitle[ 0 ] === "pages" ? "open" : "";

		//GRV.files = files;

		return `
		${ closer }
		<details id=GRVdet${ index } class="GRVdet" onToggle = GRV.onDetToggle("${ subtreeTitle }") ${ detOpen }>
			<summary class="GRVsum" >${ subtreeTitle }</summary>
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


GRV.getFiles = function ( subtree, files ) {
	//console.log( "files", files );
	//console.log( "subtree", subtree );

	const str = subtree.join( "/" );
	//console.log( "str", str );

	const filtered = files
		.filter( file => file.slice( 0, file.lastIndexOf( "/" ) ) === str )
		.map( item => `
<div class=GRVdiv>
	<a href="${ GRV.urlSource }${ item }" title="Source code on GitHub" target="_blank" >
	${ GRV.iconOctoCat }</a>
	<a href="#${ item }" title="">${ item.split( "/" ).pop() }</a>
	<a href="${ GRV.urlViewer }${ item }" title="Open file in new tab"  target="_blank" >
	${ GRV.link }</a>

</div>`);

	//	<a href="#edit=${ item }" title="Edit this file" >${ GRV.pencil }</a>
	return filtered;
};



GRV.getFilesSimple = function ( subtree, files ) {

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



////////////

GRV.onContextMenu = function ( event ) {

	event.preventDefault();

	console.log( "event", event.target.parentNode );

	el = event.target.parentNode;

	divPopUp.style.display = "block";
	divPopUp.style.left = event.pageX - 10 + "px";
	divPopUp.style.top = event.pageY - 10 + "px";

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

	divPopUp.style.display = "";

	divPopUp.innerHTML = "";

	window.removeEventListener( "click", GRV.onClick );

};


////////////

GRV.test = function () {

	links = GRVdivGitHubRepoTreeView.querySelectorAll( "a" );
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