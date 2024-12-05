const API_KEY = 'yGKz_swsy5jUIAmEEWLR5iCutHf2EN4MVvsJysWYMZE';


/*
We create a map with initial coordinates zoom, a raster tile source, a layer using that source, a geojson source and a layer using that source
See https://maplibre.org/maplibre-gl-js-docs/example/map-tiles/
See https://maplibre.org/maplibre-gl-js-docs/style-spec/sources/#raster
See https://maplibre.org/maplibre-gl-js-docs/style-spec/layers/
*/
const map = new maplibregl.Map({
	container: 'map',
	center: [15.335, 49.741],
	zoom: 7,
	style: {
		version: 8,
		sources: {
    	// style for map tiles
			'basic-tiles': {
				type: 'raster',
				url: `https://api.mapy.cz/v1/maptiles/basic/tiles.json?apikey=${API_KEY}`,
				tileSize: 256,
			},
      // style for our geometry
      'route-geometry': {
        type: 'geojson',
        data: {
          type: "LineString",
          coordinates: [],
        },
      },
		},
		layers: [{
			id: 'tiles',
			type: 'raster',
			source: 'basic-tiles',
		}, {
      id: 'route-geometry',
      type: 'line',
      source: 'route-geometry',
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
      paint: {
        'line-color': '#0033ff',
        'line-width': 8,
        'line-opacity': 0.6,
      },
    }],
	},
});

/*
We also require you to include our logo somewhere over the map.
We create our own map control implementing a documented interface,
that shows a clickable logo.
See https://maplibre.org/maplibre-gl-js-docs/api/markers/#icontrol
*/
class LogoControl {
	onAdd(map) {
		this._map = map;
		this._container = document.createElement('div');
		this._container.className = 'maplibregl-ctrl';
		this._container.innerHTML = '<a href="http://mapy.cz/" target="_blank"><img  width="100px" src="https://api.mapy.cz/img/api/logo.svg" ></a>';

		return this._container;
	}
 
	onRemove() {
		this._container.parentNode.removeChild(this._container);
		this._map = undefined;
	}
}

// we add our LogoControl to the map
map.addControl(new LogoControl(), 'bottom-left');

// function for calculating a bbox from an array of coordinates
function bbox(coords) {
	let minLatitude = Infinity;
	let minLongitude = Infinity;
	let maxLatitude = -Infinity;
	let maxLongitude = -Infinity;

	coords.forEach(coor => {
		minLongitude = Math.min(coor[0], minLongitude);
		maxLongitude = Math.max(coor[0], maxLongitude);
		minLatitude = Math.min(coor[1], minLatitude);
		maxLatitude = Math.max(coor[1], maxLatitude);
	});

	return [
		[minLongitude, minLatitude],
		[maxLongitude, maxLatitude],
	];
}

// coordinates somewhere in Prague
const coordsPrague = [14.4009399, 50.0711206];
// coordinates somewhere in Brno
const coordsBrno = [16.5661545, 49.1747438];

// This is an asynchronous function for querying a route between the two points defined above
// See https://api.mapy.cz/v1/docs/routing/#/routing/basic_route_v1_routing_route_get
async function route() {
  try {
    const url = new URL(`https://api.mapy.cz/v1/routing/route`);

    url.searchParams.set('apikey', API_KEY);
    url.searchParams.set('lang', 'cs');
    url.searchParams.set('start', coordsPrague.join(','));
    url.searchParams.set('end', coordsBrno.join(','));
    // other possible routeType values include: car_fast, car_fast_traffic, car_short, foot_fast, bike_road, bike_mountain
    url.searchParams.set('routeType', 'car_fast_traffic');
    // if you want to avoid paid routes (eg. highways) set this to true
    url.searchParams.set('avoidToll', 'false');

    const response = await fetch(url.toString(), {
      mode: 'cors',
    });
    const json = await response.json();

    // we output the length and duration of the result route to the console
    console.log(`length: ${json.length / 1000} km`, `duration: ${Math.floor(json.duration / 60)}m ${json.duration % 60}s`);
    
    // then we set the retrieved data as the geometry of our geojson layer
    const source = map.getSource('route-geometry');

		if (source && json.geometry) {
			source.setData(json.geometry);
      // finally we set the map to show the whole geometry in the viewport
      map.jumpTo(map.cameraForBounds(bbox(json.geometry.geometry.coordinates), {
        padding: 40,
      }));
    }
  } catch (ex) {
    console.log(ex);
  }
}

map.on('load', () => {
	// we can route only after the map is fully loaded so that the results do not arrive sooner
  route();
});