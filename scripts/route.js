const API_KEY = 'yGKz_swsy5jUIAmEEWLR5iCutHf2EN4MVvsJysWYMZE';


/*
We create a map with initial coordinates zoom, a raster tile source and a layer using that source.
See https://maplibre.org/maplibre-gl-js-docs/example/map-tiles/
See https://maplibre.org/maplibre-gl-js-docs/style-spec/sources/#raster
See https://maplibre.org/maplibre-gl-js-docs/style-spec/layers/
*/
const map = new maplibregl.Map({
	container: 'map',
	center: [14.8981184, 49.8729317],
	zoom: 6,
	style: {
		version: 8,
		sources: {
			'basic-tiles': {
				type: 'raster',
				url: `https://api.mapy.cz/v1/maptiles/basic/tiles.json?apikey=${API_KEY}`,
				tileSize: 256,
			},
      'markers': {
				type: 'geojson',
				data: {
					type: 'FeatureCollection',
					features: [],
				},
				generateId: true,
			},
		},
		layers: [
    	{
        id: 'tiles',
        type: 'raster',
        source: 'basic-tiles',
      },
      {
      	id: 'markers',
        type: 'symbol',
        source: 'markers',
        layout: {
          'icon-image': 'marker-icon',
          'icon-size': window.devicePixelRatio > 1 ? 0.5 : 1,
          'icon-allow-overlap': true,
        },
        paint: {},
        filter: ['==', '$type', 'Point'],
      },
    ],
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

// finally we add our LogoControl to the map
map.addControl(new LogoControl(), 'bottom-left');

const form = document.querySelector('#geocode-form');
const input = document.querySelector('#geocode-input');

form.addEventListener('submit', function(event) {
	event.preventDefault();
  geocode(input.value);
}, false);

const inputElem = document.querySelector("#autoComplete");
// cache - [key: query] = suggest items
const queryCache = {};
// get items by query
const getItems = async(query) => {
	if (queryCache[query]) {
  	return queryCache[query];
  }
  
	try {
    // you need to use your own api key!
  	const fetchData = await fetch(`https://api.mapy.cz/v1/suggest?lang=cs&limit=5&type=regional.address&apikey=${API_KEY}&query=${query}`);
    const jsonData = await fetchData.json();
    // map values to { value, data }
    const items = jsonData.items.map(item => ({
      value: item.name,
      data: item,
    }));
    
    // save to cache
    queryCache[query] = items;
    
    return items;
  } catch (exc) {
  	return [];
  }
};

const autoCompleteJS = new autoComplete({
	selector: () => inputElem,
	placeHolder: "Enter your address...",
  searchEngine: (query, record) => `<mark>${record}</mark>`,
	data: {
    keys: ["value"],
		src: async(query) => {
    	// get items for current query
      const items = await getItems(query);
      
      // cache hit? - there is a problem, because this provider needs to get items
      // for each query and cannot handle different timeouts for different query.
      // if previous query was completed - it's already in the cache, and some
      // old query is completed, we test it againts current query and returns correct items.
      if (queryCache[inputElem.value]) {
      	return queryCache[inputElem.value];
      }
      
      return items;
		},
		cache: false,
	},
	resultItem: {
  	element: (item, data) => {
    	const itemData = data.value.data;
    	const desc = document.createElement("div");
      
      desc.style = "overflow: hidden; white-space: nowrap; text-overflow: ellipsis;";
      desc.innerHTML = `${itemData.label}, ${itemData.location}`;
      item.append(
      	desc,
      );
    },
		highlight: true
	},
	resultsList: {
 		 element: (list, data) => {
     	list.style.maxHeight = "max-content";
    	list.style.overflow = "hidden";
    
       if (!data.results.length) {
         const message = document.createElement("div");
         
         message.setAttribute("class", "no_result");
         message.style = "padding: 5px";
         message.innerHTML = `<span>Found No Results for "${data.query}"</span>`;
         list.prepend(message);
       } else {
       	const logoHolder = document.createElement("div");
        const text = document.createElement("span");
        const img = new Image();
        
        logoHolder.style = "padding: 5px; display: flex; align-items: center; justify-content: end; gap: 5px; font-size: 12px;";
        text.textContent = "Powered by";
        img.src = "https://api.mapy.cz/img/api/logo-small.svg";
        img.style = "width: 60px";
        logoHolder.append(text, img);
       	list.append(logoHolder);
       }
     },
		noResults: true,
	},
});
inputElem.addEventListener("selection", event => {
    // "event.detail" carries the autoComplete.js "feedback" object
    // saved data from line 16 (mapping)
    const origData = event.detail.selection.value.data;
    // data to debug
    console.log(origData);
    inputElem.value = origData.name;
    
    // Extract latitude and longitude from origData
    const { lon, lat } = origData.position;

    // Jump to the coordinates of origData
    map.jumpTo({
        center: [lon, lat],
        zoom: 7 // Adjust the zoom level as needed
    });
    circle(lon, lat);

});

function circle(lon, lat) {
  const radius = car.calcMapDistance(); // radius in meters

  // Function to create a circle polygon
  function createCircle(center, radius, points = 64) {
    const coords = {
      latitude: center[1],
      longitude: center[0]
    };

    const km = radius / 100;
    const ret = [];
    const distanceX = km / (111.32 * Math.cos(coords.latitude * Math.PI / 180));
    const distanceY = km / 110.574;

    let theta, x, y;
    for (let i = 0; i < points; i++) {
      theta = (i / points) * (2 * Math.PI);
      x = distanceX * Math.cos(theta);
      y = distanceY * Math.sin(theta);

      ret.push([coords.longitude + x, coords.latitude + y]);
    }
    ret.push(ret[0]);

    return {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [ret]
      }
    };
  }

  // Create a GeoJSON source with the circle data
  const circleSource = {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: [createCircle([lon, lat], radius)],
    },
  };

  // Check if the source already exists
  if (map.getSource('circle-source')) {
    // Update the source data
    map.getSource('circle-source').setData(circleSource.data);
  } else {
    // Add the source to the map
    map.addSource('circle-source', circleSource);

    // Add a layer to visualize the circle
    map.addLayer({
      id: 'circle-layer',
      type: 'fill',
      source: 'circle-source',
      paint: {
        'fill-color': 'red',
        'fill-opacity': 0.5,
      },
    });
  }
}


map.on('load', function () {
	map.loadImage(
		'https://api.mapy.cz/img/api/marker/drop-red.png',
		function (error, image) {
			if (error) throw error;
			map.addImage('marker-icon', image);
    }
  );
});