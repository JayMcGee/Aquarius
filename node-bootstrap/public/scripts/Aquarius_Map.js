////////////////////////////////////////////////////////////////////////////////
/**
 * @brief 	Aquarius_Map
 * 
 * @details A series a function to integrate MapBox 
 * @details https://www.mapbox.com/, to modify the look of the map
 * @details Signin with User: Aquarius-Station pass:snoopy42
 * 
 * @author  Jean-Pascal McGee
 * @date    20 MAR 2015
 * @version 1.0 : First Version, only manage boxCalibrate display
 * @version 2.0 : Added calibration point buttons manager
 * @version 3.0 : Added communication with server and enable button logic
*/

var map;
var myLayers;
var features = [];


function createMap()
{
	L.mapbox.accessToken = 'pk.eyJ1IjoiamF5bWNnZWUiLCJhIjoiOVZ5U1NtNCJ9.FQQeoEnRBCDeb8CBH-GZow';
	map = L.mapbox.map('map', 'aquarius-station.48fb864a');
	myLayer = L.mapbox.featureLayer().addTo(map);
	features = [];
}

function addMarker(aLat,aLong,Title,Desc)
{
	features.push(	{
		    // this feature is in the GeoJSON format: see geojson.org
		    // for the full specification
		    type: 'Feature',
		    geometry: {
		        type: 'Point',
		        // coordinates here are in longitude, latitude order because
		        // x, y is the standard for GeoJSON and many formats
		        coordinates: [aLong,aLat]
		    },
		    properties: {
		        title: Title,
		        description: Desc,
		        'marker-size': 'large',
		        'marker-color': '#2D89EF',
		        'marker-symbol': 'water'
		    }
		}
	);

	myLayer.setGeoJSON({
	    type: 'FeatureCollection',
	    features: features
	});
	
	map.setView([aLat,aLong], 15);
}
