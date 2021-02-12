let sha;
let url;

function setLocalStorage( that = inpAccessToken) {

	localStorage.setItem( `github${ that.id.slice( 3 ) }`, that.value );

}



function getFileFromGitHub () {

	url = `https://api.github.com/repos/${ inpUser.value }/${ inpRepo.value }/contents/${ inpPath.value }`;


	const xhr = new XMLHttpRequest();
	xhr.open( "GET", url, true );
	xhr.setRequestHeader( "Authorization", "token " + inpAccessToken.value );
	xhr.responseType = "json";
	xhr.onerror = ( xhr ) => console.log( "error:", xhr );
	//xhr.onprogress = ( xhr ) => console.log( "bytes loaded:", xhr.loaded );
	xhr.onload = onLoad;
	xhr.send( null );

};

function onLoad ( xhr ) {

	//console.log( "response", xhr );

	sha = xhr.target.response.sha;

	const content = atob( xhr.target.response.content );

	textareaMain.value = content;

	divMessage.innerText = `Get:${ new Date().toLocaleString() } bytes:${ content.length } sha:${ sha }`;

};



function putFileToGitHub () {


	requestSha();
	// if ( !sha ) { requestSha(); return; }

	// putFile();

}

function requestSha () {

	xhr = new XMLHttpRequest();
	xhr.open( "GET", url, true );
	xhr.setRequestHeader( "Authorization", "token " + inpAccessToken.value  );
	xhr.responseType = "json";
	xhr.onerror = ( xhr ) => console.log( "error:", xhr );
	//xhr.onprogress = ( xhr ) => console.log( "bytes loaded:", xhr.loaded );
	xhr.onload = ( xhr ) => {
		//console.log( "", xhr );
		sha = xhr.target.response.sha;
		putFile();
	};
	xhr.send( null );

};


function putFile () {

	const content = textareaMain.value;

	const codedData = window.btoa( content ); // encode the string

	const body = JSON.stringify( {
		"branch": inpBranch.value,
		"content": codedData,
		"message": `add to file`,
		"sha": sha

	} );

	const xhr = new XMLHttpRequest();
	xhr.open( "PUT", url, true );
	xhr.setRequestHeader( "Authorization", "token " + inpAccessToken.value );
	xhr.setRequestHeader( "Content-Type", "application/json" );
	xhr.onerror = ( xhr ) => console.log( "error:", xhr );
	xhr.onprogress = ( xhr ) => console.log( "bytes loaded:", xhr.loaded, xhr );
	xhr.send( body );

	divMessage.innerText = `Put: ${ new Date().toLocaleString() } bytes:${ content.length } sha:${ sha }`;

}