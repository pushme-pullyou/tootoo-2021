// copyright 2021 Theo Armour. MIT license.
/* global COR, MNU, EXHdivDetails */
// jshint esversion: 6
// jshint loopfunc: true

const EXH = {};


EXH.init = function ( { user = COR.user, repo = COR.repo, branch = COR.branch } = {} ) {

	EXH.urlHome = ""; //COR.pathContent;

	EXH.info = "Save current text to a simple HTML file"

	const htm = `
<details id=EXHdet >

	<summary id=EXHsumRepo class="summary-primary gmd-1" title="View selected items">
		<span id=EXHsumTitle >Export HTML</span>
		${ MNU.addInfoBox( EXH.info ) }
	</summary>

	<button onclick=EXH.saveFile() >Save file</button>

`;

	EXHdivExportHtml.innerHTML = htm;

};



EXH.saveFile = function () {

	const blob = new Blob( [ divMainContent.innerHTML ] );
	let a = document.createElement( 'a' );
	a.href = window.URL.createObjectURL( blob );
	a.download = `${ document.title.split( "." ).shift() }.htm`;
	a.click();
	a = null;

};
