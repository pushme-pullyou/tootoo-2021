const GOR = {

	path: "../../../"
};


GOR.init = function () {


	const htm = `
			<details open>
				<!-- 'open' triggers a run on load -->

				<summary class="summary-primary gmd-1" title="View selected items">${ GOR.user } repositories

					<span class="info">
						<img class=infoImg src="${ GOR.path }lib/assets/icons/noun_Information_585560.svg">
						<div id="divGOR" class="infoTooltip gmd-5">
							test <button onclick=GOR.test()>view all files in this repository</button>
						</div>
					</span>
				</summary>

				<div class=divNavResize>

					<p>orgs:</p>

					<div id=GORdivGitHubReposTreeView></div>

					<br>

				</div>

			</details>
	`;

	GORdivDetails.innerHTML = htm;

	GOR.getOrganization();

}


// https://api.github.com/orgs/pushme-pullyou/repos

GOR.getOrganization = function () {

	user = "ladybug-tools";
	repo = "spider-2020";

	url = `https://api.github.com/users/${ GOR.user }/repos?per_page=100`;
	GOR.urlViewer = "";

	//GOR.urlViewer = `https://www.ladybug.tools/${ repo }/`;

	GOR.requestFile( url, GOR.onLoadTree );

};


GOR.requestFile = function ( url = "https://example.com", callback = onLoad ) {

	const xhr = new XMLHttpRequest();
	xhr.open( "GET", url, true );
	xhr.responseType = "json";
	xhr.onerror = ( xhr ) => console.log( "error:", xhr );
	//xhr.onprogress = ( xhr ) => console.log( "bytes loaded:", xhr.loaded );
	xhr.onload = ( xhr ) => callback( xhr.target.response );
	xhr.send( null );

};


GOR.onLoadTree = function ( repos ) {;
	console.log( "repos", repos );
	GOR.repos = repos;
	texts = repos.map( ( repo, index ) => `
<div title="${ repo.description }" >
	<button onclick=GOR.getRepo("${ GOR.user}","${ repo.name }",${ index }); >${ repo.name }</button>
</div>` );

	GORdivGitHubReposTreeView.innerHTML = texts.join( "")

}

// https://ladybug-tools.github.io


GOR.getRepo = function ( user = "ladybug-tools", repo = "spider-2020", index ) {

	json = GOR.repos[ index ];

	url = `https://api.github.com/repos/${ user }/${ repo }/git/trees/${ json.default_branch }?recursive=1`;

	GRV.urlViewer = `https://${ user }.github.io/${ repo }/`;

	GRV.requestFile( url, GRV.onLoadTree );

};