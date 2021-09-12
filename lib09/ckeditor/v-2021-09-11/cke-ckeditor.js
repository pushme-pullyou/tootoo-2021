// copyright 2021 Theo Armour. MIT license.
/* global COR, main, divMainContent, showdown, detNavMenu, sumNavMenu */
// jshint esversion: 6
// jshint loopfunc: true


const CKE = {}


CKE.init = function () {


	const htm = `
<details id=detFile>

	<summary class="summary-primary gmd-1" title="Open files on your device: ">
		CKE Editor
		<span id=MNUspnFile ></span>
		${ MNU.addInfoBox( "Files to try" ) }
	</summary>

	<div id=FRdivMenuFileReader></div>


	<div id=FOOdivLog>to be reset</div>

	<div id=FOZdivFileOpenZip></div>

	<div id=divLog></div>

</details>`

	CKEdivCkeditor.innerHTML = htm;


}

