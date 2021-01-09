<span style=display:none; >[You are now in a GitHub source code view - click this link to view Read Me file as a web page]( https://theo-armour.github.io/2021/sandbox/us-county-votes/readme.html  "View file as a web page." ) </span>

<div><input type=button onclick=window.top.location.href="https://github.com/theo-armour/2020/tree/master/sandbox/us-county-votes/";
value='You are now in a GitHub web page view - Click this button to view this read me file as source code' ></div>


# [US County Votes Read Me]( https://github.com/theo-armour/2020/tree/master/sandbox/us-county-votes/ )

<!--@@@
<div style=height:500px;overflow:hidden;width:100%;resize:both; ><iframe src="https://theo-armour.github.io/2021/sandbox/us-county-votes/" height=100% width=100% ></iframe></div>
_US County Votes in a resizable window. One finger to rotate. Two to zoom. Three to pan._
@@@-->

### Full Screen: [US County Votes]( https://theo-armour.github.io/2021/sandbox/us-county-votes/ )


## Team

Brian M Hamlin <maplabs@light42.com>,
John Head <jfhead@headlawyers.com>,
Cynthia Burrage Armour <armour.cb@gmail.com>,
Don Mesa <donmesa@sbcglobal.net>,
John Maeck <mwfarmcsa@gmail.com>,
Jose Leos <joseleos@gmail.com>

## Concept

Mission

* To display the changes in voting margins by political parties over a series of elections for every county in the USA
* Display the relative importance of each county by indicating the size of the margin and the number of voters distinctly for each county
* Provide the numbers behind each visual on demand in real time
* Compare visually the margins for a series of elections



Vision

* Where do we want this to go? and why?
* Provide a rationale with demographic evidence as to the variety of outcomes
* Enable access to demographics such as income, education and health for each county
* Create charts useful to people with great domain expertise in politics and economics and the the social sciences
* Help them identify and catalog nuances in huge data sets
* Build charts that may challenge common understandings by making hitherto unseen trends apparent and and measurable

Features

* bar charts compressed into overlaid 3D [proportional symbols]( https://wiki.gis.com/wiki/index.php/Proportional_symbol_map ) enabling a instance or location to represent multiple values
* pop-up windows provide instant access to the actual numbers
* Zoom, rotate and pan enable detailed exploration of both laregest and tiniest symbols


## To Do / Wish List

* Indicate the swing of each county in relation to previous election
* Use arrows and direction to indicate magnitude of swing
* Increase the curvature??
* Enable toggles to linear anf exponential height of bars
* Streamline the data wrangler
	* Make it produce a single file to load
* Add display of multiple-flip states
* Animate the year updates
* Add color shading
* Highlight county winning party in pop-up
* Show state boundaries and shade slightly with winning color
* Add education, health and wealth characteristics
* Tidy the code
* Show geoJSON in 3D


## Issues


* 2020-11-06 ~ The software is un-optimized amd may run quite slowly on a non-gaming computer


## Links of Interest

* https://www.fastcompany.com/90572489/u-s-election-maps-are-wildly-misleading-so-this-designer-fixed-them
* https://www.foxnews.com/politics/forget-traditional-election-maps-this-is-what-the-us-vote-really-looks-like
* https://www.reddit.com/r/Maps/comments/jplarw/counties_that_flipped_in_the_2020_us_presidential/
* https://www.latimes.com/projects/trump-biden-election-results-california
* https://www.reddit.com/r/dataisbeautiful/comments/jrkoze/3d_map_of_covid_cases_by_population_march_through/
* https://www.reddit.com/r/bigdata/comments/jvdl6u/in_this_video_you_can_see_which_political_party/
* https://www.reddit.com/r/Maps/comments/jyb33n/as_a_nonamerican_this_was_pretty_eye_opening/


### Election data

* https://www.geoffmcghee.com/projects/tu/legacy/data/us-states-west-metadata.js
* https://armsp.github.io/talks/pydataglobal-2020/
* https://github.com/tonmcg/us-election-maps/tree/master/maps
* https://github.com/tonmcg/US_County_Level_Election_Results_08-20
* https://www.loc.gov/rr/program/bib//elections/statistics.html
* https://libguides.princeton.edu/elections
* https://electionlab.mit.edu/data


## Change Log

### 2021-01-06

* Fix broken icons in iframr
* update readme

### 2020-12-16

* Add updated geojson utility that works as expected - at last
* Add election  data for 2020
* Much refactoring and streamlining

Done

* Source and add authoritative 2020 numbers
* 2020-11-06 ~ The borders of some counties along the oceans are missing

### 2020-12-11

The chart you are looking at may be one of the most complex charts you have ever viewed. This chart is not for the faint-hearted. This is intentional. 

In five years time the same future chart will display twice the data in half the time. Fingers crossed they find better methods of visualization.


Welcome to the future.

The chart links to over 50,000 lines of records
The chart displays 3D proportional symbols for 3,114 counties
Each data point display its area
Each data point displays its geophysical characteristics
Each data point may display the data of five different date cohorts
Each data point displays three tallies scaled by the total numbers
Separate indicators display two sets of differences with previous cohorts

It would take 18,923 pie charts to display this data.

As you move your pointer over each data point a bunch more data points are displayed in a pop-up window next to the cursor
	* Includes likes to Google search results for the selected data point

In order to enable access to the data points, 1|2|3 finger interaction enables easy access to the data points

This chart is usable on phone, tablet and workstation.

This chart software is free and open-source

Future releases may

* Provide a more intuitive user experience
* Include 3D global terrain
* Display more variables simultaneously, including
	* Levels of education
	* Per capita income
	* Healthiness
	* Metrics of which I am as yet clueless
* Load and display faster
* Animate the display of the date data
* Expose more sophisticated shading rendering techniques

Done

* Add both Dem and Rep flips
	* As scaled ellipsoids
	* Pay attention to scaling and rendering
* Update legend


### 2020-12-09

* Add "voting stats" button

Code is getting messy. Needs a good clean-up

Done

* Stop globe redraws on year change
* More comprehensive cursor display
* Add indicators that show which counties have flipped since previous vote

### 2020-12-07

* Add sphere with texture reprsenting the Earth
* Change data to "County Presidential Election Returns 2000-2016" from MIT Election Data and Science Lab ~ https://electionlab.mit.edu/data
* Refactor code to display MIT data
	* Allow for "Democratic", "Republican" and "Other" categories
* Update display at cursor

Dealt with

* Add bitmap map underlay
* Better and more authoritative statistics

### 2020-12-02

The goal is to create a map that people can look at and - without reading instructions or looking at a legend - in a few seconds mostly "get the picture" know what is going on. It's taking time, but each release gets things a bit better,

The red and blue sticks kind of give the idea that this map is about US politics

The width of the sticks gives the idea that it's an indication of population

The height of the ticks representing party votes is less easy to get - stil a work-in-progress

Today:

* Rejigged the shape of the sticks (process was trickier than I thought )
* Rejigged pop-up text and menu text
* Slowed rotate speed

### 2020-12-01

Should load faster and use fewer resources ~ vbut lose variety of colors
Part way through adding a fuller user interface - should now work better on mobile phones
Starting to add usage text - see info button
3D experience needs a lot of work

Click setStats button to see how many frames per second
- Windows 10 with Nvidia graphics card - 60fps
- Chromebook ~ 23 fps
- Google Pixel 4 ~ 44 fps

### 2020-11-26

* Losers are dimmed
* Add links to links of interest
* Dems horizontal. Reps vertical
* Vertical scale set to logarithmic
* Colors are official party colors

Dealt with

* 2020-11-06 ~ Add buttons or sliders to select data from all the election years in the available data set
* 2020-11-06 ~ Add a range of colors to indicate the magnitude of the margins for the winning party in each county
* 2020-11-06 ~ Currently only shows party voting data for 2018 with no indication of margin magnitude
* 2020-11-06 ~ The map projection is set for a spherical projection - causing the map to not look like a more normal mercator projection

### 2020-11-25

* Shift to spherical coordinates
* Slow down rotate speed

### 2020-11-24

Differentiating the vote using color is problematic. Using geometry is preferred.
The over-arching goal always: you understand the map without having to look at the legend.

* height of bars is dem or rep vote - scaled exponentially
* top width of bar total number of votes in county - scaled exponentially
* Add lights
* Switch from basic to phong material
* Set focus to select year - enable easy use of cursor keys

### 2020-11-17

* Add color varies RGB( %rep, 0, %dem )
* Add years 2010 to 2018;


### 2020-11-06

* First commit


***

<center title="hello! Click me to go up to the top" ><a href=javascript:window.scrollTo(0,0); style=font-size:2ch;text-decoration:none; > ❦ </a></center>
