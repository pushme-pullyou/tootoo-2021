
TMP = {};

TMP.init = () => {

	TMP.title = document.title ? document.title : location.href.split( "/" ).pop().slice( 0, - 5 ).replace( /-/g, " " );
	TMP.user = COR.user || "pushme-pullyou";
	TMP.repo = COR.repo || "tootoo-2021";
	TMP.branch = COR.branch || "main";
	TMP.path = COR.path || "../../../";
	TMP.source = COR.source;
	TMP.version = COR.version;
	TMP.description = COR.description;

	TMPdivTemplate.innerHTML = `

<details id=TMPdetTemplate>

	<summary class="summary-primary gmd-1" title="View selected items">

		Template Menu

		<span class="info">
			<img class=infoImg src="${ TMP.path }//lib/assets/icons/noun_Information_585560.svg">
			<div class="infoTooltip gmd-5">
			<div>${ TMP.description }</div>
			version <span>${ TMP.version }</span>
			</div>
		</span>


	</summary>

	<div class=divNavResize>

		<p>
			Do it here!
		</p>

	</div>

	<div id=TMPdivLog></div>

</details>`;


};