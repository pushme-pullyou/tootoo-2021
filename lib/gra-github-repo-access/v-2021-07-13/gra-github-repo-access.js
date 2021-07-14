// copyright 2021 Theo Armour. MIT license.

/* jshint esversion: 6 */

const GRA = {
	parameters: {
		user: "pushme-pullyou",
		repo: "tootoo-2021",
		branch: "main",
		path: "./"
	}
};


GRA.init = () => {

	GRA.info = `
<div>
	Provide the parameters needed to make a GitHub API call<br>
	<button onclick=GRA.testSwitchPP() >test switch pp</button><br>
	<button onclick=GRA.testSwitchTheo() >test switch theo</button><br>
	<button onclick=GRA.test() >test call API</button>
</div>`;


	GRAdivDetails.innerHTML = `

<details id=GRAdet open>

	<summary id=GRAsumRepo class="summary-primary gmd-1" title="View selected items">

		GitHub Repo Access Token

		${ MNU.addInfoBox( GRA.info ) }

	</summary>

	<div class=divNavResize>

		<div>
			<label title="Input the GitHub API Access Token">GitHub Access token
			<input id=GRAinpToken onclick=this.select(); onblur=GRA.setGitHubParametersAPI();
				class=full-width >
			</label>
		</div>

		<div>
			<label title="Input the GitHub API user or organization">User
			<input id=GRAinpUser onclick=this.select(); onblur=GRA.setGitHubParametersAPI();
				class=full-width >
			</label>
		</div>

		<div>
			<label title="Input the GitHub API repo">Repository
			<input id=GRAinpRepo onclick=this.select(); onblur=GRA.setGitHubParametersAPI();
				class=full-width >
			</label>
		</div>

		<div>
			<label title="Input the GitHub API branch">Branch
			<input id=GRAinpBranch onclick=this.select(); onblur=GRA.setGitHubParametersAPI();
				class=full-width >
			</label>
		</div>

		<div>
			<label title="Input the GitHub API path">Path
			<input id=GRAinpPath onclick=this.select(); onblur=GRA.setGitHubParametersAPI();
				class=full-width >
			</label>
		</div>

	</div>

	<div id=GRAdivLog></div>

	<br>

</details>`;

	GRA.getParametersAPI();

};


GRA.getParametersAPI = () => {

	const strParameter = localStorage.getItem( "githubParametersAPI" ) || "{}";
	//console.log( "strParameter", strParameter );
	const parameters = JSON.parse( strParameter );
	//console.log( "parameters", parameters );

	GRA.parameters.token = parameters.token || GRA.parameters.token;
	GRA.parameters.user = parameters.user || GRA.parameters.user;
	GRA.parameters.repo = parameters.repo || GRA.parameters.repo;
	GRA.parameters.branch = parameters.branch || GRA.parameters.branch;
	GRA.parameters.path = parameters.path || GRA.parameters.path;

	GRAinpToken.value = GRA.parameters.token;
	GRAinpUser.value = GRA.parameters.user;
	GRAinpRepo.value = GRA.parameters.repo;
	GRAinpBranch.value = GRA.parameters.branch;
	GRAinpPath.value = GRA.parameters.path;

};



GRA.setGitHubParametersAPI = function () {

	GRA.parameters.token = GRAinpToken.value;
	GRA.parameters.user = GRAinpUser.value;
	GRA.parameters.repo = GRAinpRepo.value;
	GRA.parameters.branch = GRAinpBranch.value;
	GRA.parameters.path = GRAinpPath.value;

	const parameters = { token: GRA.parameters.token, user: GRA.parameters.user, repo: GRA.parameters.repo, branch: GRA.parameters.branch, path: GRA.parameters.path };

	const strParameters = JSON.stringify( parameters );
	console.log( "strParameters", strParameters );

	localStorage.setItem( "githubParametersAPI", strParameters );

};



GRA.test = () => {

	const url = `https://api.github.com/repos/${ GRA.parameters.user }/${ GRA.parameters.repo }/git/trees/${ GRA.parameters.branch }?recursive=1`;

	const xhr = new XMLHttpRequest();
	xhr.open( "GET", url, true );
	xhr.setRequestHeader( "Authorization", "token " + GRA.parameters.token );
	xhr.responseType = "json";
	xhr.onerror = ( xhr ) => console.log( "error:", xhr );
	//xhr.onprogress = ( xhr ) => console.log( "bytes loaded:", xhr.loaded );
	xhr.onload = ( xhr ) => divContentMain.innerText = JSON.stringify( xhr.target.response, null, "\t" );
	xhr.send( null );

};


GRA.testSwitchTheo = () => {

	COR.user = GRAinpUser.value = "theo-armour";
	COR.repo  = GRAinpRepo.value = "qdata";
	COR.branch = GRAinpBranch.value = "master";
	COR.path = GRAinpPath.value = "./";


	GRVT.user = COR.user || "pushme-pullyou";
	GRVT.repo = COR.repo || "tootoo-2021";
	GRVT.branch = COR.branch || "main";
	GRVT.path = COR.path || "../../../";

	GRA.setGitHubParametersAPI();

	console.log( "GRA.parameters", GRA.parameters );

}

GRA.testSwitchPP = () => {

	COR.user = GRAinpUser.value = "pushme-pullyou";
	COR.repo = GRAinpRepo.value = "tootoo-2021";
	COR.branch = GRAinpBranch.value = "main";
	COR.path = GRAinpPath.value = "./";


	GRVT.user = COR.user;
	GRVT.repo = COR.repo;
	GRVT.branch = COR.branch;
	GRVT.path = COR.path;

	GRA.setGitHubParametersAPI();

	console.log( "GRA.parameters", GRA.parameters );

}

