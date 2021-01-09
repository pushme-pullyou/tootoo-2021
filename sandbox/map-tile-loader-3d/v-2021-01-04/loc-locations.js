// copyright 2021 Theo Armour. MIT license.

const LOC = {}

LOC.locations =
[
['"title":"San Francisco Bay","latitude":37.796,"longitude":-122.398,"zoom":11',"San Francisco Bay"],
['"title":"Golden Gate Bridge","latitude":37.8199,"longitude":-122.4783,"zoom":14',"Golden Gate Bridge"],
['"title":"California","latitude":36.7783,"longitude":-119.4179,"zoom":7,"scale":50,"rows":6,"columns":3',"California"],
['"title":"Burning Man","latitude":40.786944,"longitude":-119.204444,"zoom":12',"Burning Man"],
['"title":"Half Dome - California USA","latitude":37.7459192,"longitude":-119.5331992,"zoom":14,"offsetUTC":-420',"Half Dome Yosemite"],
['"title":"Grand Canyon - Arizona USA","latitude":36.11276399999999,"longitude":-113.9960696,"zoom":11,"offsetUTC":-420',"The Grand Canyon"],
['"title":"Greenwich Observatory","latitude":51.4779,"longitude":-0.0015,"zoom":15',"Greenwich Observatory"],
['"title":"Skye - United Kingdom","latitude":57.2736277,"rows":5,"longitude":-6.2155023,"zoom":10,"offsetUTC":60',"Isles of Skye"],
['"title":"Tenzing Hillary Airport","latitude":27.6874,"longitude":86.7322,"zoom":12',"Tenzing Hillary Airport"],
['"title":"Hong Kong","latitude":22.3193039,"longitude":114.1693611,"zoom":11,"offsetUTC":480',"Hong Kong"],
['"title":"Sidney Harbour","latitude":-33.8675,"longitude":151.207,"zoom":13,"scale":80,"offsetUTC":-600',"Sydney Harbour"],
['"title":"Queenstown - New Zealand","latitude":-45.0301511,"longitude":168.6616206,"zoom":13,"index":3,"offsetUTC":720',"Queenstown New Zealand"],
['"title":"Moorea","latitude":-17.5388,"longitude":-149.8295,"zoom":13,"index":3',"Moorea"]
];

LOC.init = function() {

	options= LOC.locations.map( loc => `<option>${ loc[ 1 ]} `);

	const htm = `
<details open>

<summary>locations</summary>

<select oninput=location.hash=LOC.locations[this.selectedIndex][0] id=selLocation class=select-resize size=13 >${ options.join( "") }</select>

</details>`;

	LOCdivDetails.innerHTML = htm;

};