# MapBox


## Useful Lng, Lat

* USA: center: [ -96, 38 ],
* me: map.setCenter([-122.431,37.803])


## Useful MapBox Links

* https://docs.mapbox.com/mapbox-gl-js/api/
* https://docs.mapbox.com/api/maps/
* https://docs.mapbox.com/playground/static/
* https://docs.mapbox.com/playground/tilequery/

## Lessons Learned

Turn off logo

* logoPosition: 'top-right',
* .mapboxgl-ctrl-top-right { display: none; }

Three.js
* Y-axis is up
* World is a 1 x 1 x 1 cube with origin at bottom upper right
* Null Island is at ( 0.5, 0.5, 0 )
* Because it is a box of size 1 unit, there may be THREE.camera.near issues.
* Need several meshes in order to start a render
* Cannot use a controller

## keyboard shortcuts:

* = / +: Increase the zoom level by 1.
* Shift-= / Shift-+: Increase the zoom level by 2.
* -: Decrease the zoom level by 1.
* Shift--: Decrease the zoom level by 2.
* Arrow keys: Pan by 100 pixels.
* Shift+⇢: Increase the rotation by 15 degrees.
* Shift+⇠: Decrease the rotation by 15 degrees.
* Shift+⇡: Increase the pitch by 10 degrees.
* Shift+⇣: Decrease the pitch by 10 degrees.*



## Articles

* https://curiosio.medium.com/how-to-upgrade-to-new-mapbox-12ce6e95e7b1
* https://vakila.github.io/mapbox-concatenate-workshop/part-2.html
* https://www.usgs.gov/centers/fort/science/mapbox-innovating-landsat?qt-science_center_objects=0#qt-science_center_objects
* https://observablehq.com/search?query=mapbox
* https://pointsunknown.nyc/qgis/web%20mapping/mapbox/2019/11/07/09_WebmappingElectionData.html

geoJSON

* https://uscensusbureau.github.io/citysdk/examples/mapbox-choropleth/

## Change Log

### 2021-01-11

* MapBox-threejs with a 1000 sticks with lootAt works!

