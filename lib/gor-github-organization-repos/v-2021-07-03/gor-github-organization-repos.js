// copyright 2021 Theo Armour. MIT license.
/* global COR, MNU, GORdivDetails, GORsumTitle, GORinpUser, GORselRepo, GORdivGitHubRepos, GORdivInfo */
// jshint esversion: 6
// jshint loopfunc: true

const GOR = {};


GOR.init = function ( { user = COR.user, repo = COR.repo } = {} ) {
	GOR.user = user;
	GOR.repo = repo;
	GOR.info = `View all the repositories belonging to a GitHub user or organization`;
	//	<a href="#lib/gor-github-organization-repos/README.md" t>read me</a> `

	const htm = `
			<details id=GORdet >

				<summary class="summary-primary gmd-1" title="Click to view list of a user's repositories">

					<span id=GORsumTitle >${ GOR.user } repositories</span>

					${ MNU.addInfoBox( GOR.info ) }

				</summary>

				<div class=divNavResize>

					<label for="GORinpUser">Click the 'X' to clear the box, then select a GitHub user from the list or type one in:</label>
					<input type=search list="GORlistUsers" id="GORinpUser" oninput=GOR.getOrganization(this.value);
						placeholder="Search GitHub..." name="q" title="Select a GitHub user or organization" style=width:100% />

					<datalist id="GORlistUsers">
						<option value="pushme-pullyou/tootoo-2021" >
						<option value="ladybug-tools/spider-2021" >
						<option value="theo-armour/2021">
						<option value="mrdoob/three.js">
						<option value="mostaphaRoudsari">
						<option value="chriswmackey">
					</datalist>

					<div id=GORdivGitHubRepos></div>

					<br>

				</div>

			</details>
	`;

	GORdivDetails.innerHTML = htm;

	//GORinpUser.value = GOR.user + "/" + GOR.repo;

	//GOR.getOrganization();

};



GOR.getOrganization = function ( value = GORinpUser.value ) {
	//console.log( "user", user );

	if ( !value ) { return; }

	const valueArr = value.split( "/" );

	GOR.user = valueArr.shift();

	GOR.repo = valueArr.shift();

	GOR.urlApi = `https://api.github.com/users/${ GOR.user }/repos?per_page=100`;

	GOR.requestFile( GOR.urlApi, GOR.onLoadTree );

};


GOR.requestFile = function ( url = GOR.urlApi, callback = GOR.onLoadTree ) {

	const xhr = new XMLHttpRequest();
	xhr.open( "GET", url, true );
	xhr.responseType = "json";
	xhr.onerror = ( xhr ) => console.log( "error:", xhr );
	//xhr.onprogress = ( xhr ) => console.log( "bytes loaded:", xhr.loaded );
	xhr.onload = ( xhr ) => callback( xhr.target.response );
	xhr.send( null );

};


GOR.onLoadTree = function ( repos = GOR.repos ) {
	//console.log( "repos", repos );

	GOR.repos = repos;

	//repo = GOR.repos.find( repo => repo.name.startsWith( GOR.user.toLowerCase() + ".github" ) );

	//GOR.repo = repo ? repo.name : GOR.repos[ 0 ].name;

	//console.log( "repo", GOR.repo );

	const texts = repos.map( ( repo, index ) => {
		const selected = repo.name === GOR.repo ? "selected" : "";
		return `<option title="${ repo.description }" style="background-color:#fff;" ${ selected }>${ repo.name }</option>`;
	} );

	GORdivGitHubRepos.innerHTML = `
<div>
	<select id=GORselRepo oninput=GOR.getRepo(this); class=select-resize size=10 >
	${ texts.join( "" ) }
	</select>
</div>
<div id=GORdivInfo ></div>`;

	if ( GOR.user ) {
		GORselRepo.oninput();
		GORsumTitle.innerHTML = `${ GOR.user } repositories`;
	}

};



GOR.getRepo = function ( that ) {

	const json = GOR.repos[ that.selectedIndex ];
	//console.log( "json", json );

	if ( json ) {

		GOR.repo = json.name;

		GOR.branch = json.default_branch;

		GOR.urlApi = `https://api.github.com/repos/${ GOR.user }/${ GOR.repo }/git/trees/${ GOR.branch }?recursive=1`;

		GORdivInfo.innerHTML = `<br>
<div>User: <a href=https://github.com/${ GOR.user } target="_blank" title="Click to view in new window" >${ GOR.user }</a></div>
<div>Repo: <a href="${ json.html_url }" target="_blank" title="Click to view in new window">${ json.name }</a></div>
<p>Description: ${ json.description }</p>
<p>Updated: ${ json.updated_at }</p>
<div>Fork: ${ json.fork } ~ Watchers: ${ json.watchers } ~ Stars: ${ json.stargazers_count }</div>
`;

	} else {

		// if ( window.GRVdivGitHubRepoTreeView ) { GRVdivGitHubRepoTreeView.innerHTML = ""; }

		// GORdivInfo.innerHTML = "";
	}

};