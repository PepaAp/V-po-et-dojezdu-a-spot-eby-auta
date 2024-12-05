const API_KEY = 'yGKz_swsy5jUIAmEEWLR5iCutHf2EN4MVvsJysWYMZE';

const map = L.map('map').setView([49.8729317, 14.8981184], 16);

/*
Then we add a raster tile layer with REST API Mapy.cz tiles
See https://leafletjs.com/reference.html#tilelayer
*/
L.tileLayer(`https://api.mapy.cz/v1/maptiles/basic/256/{z}/{x}/{y}?apikey=${API_KEY}`, {
  minZoom: 0,
  maxZoom: 19,
  attribution: '<a href="https://api.mapy.cz/copyright" target="_blank">&copy; Seznam.cz a.s. a další</a>',
}).addTo(map);

/*
We also require you to include our logo somewhere over the map.
We create our own map control implementing a documented interface,
that shows a clickable logo.
See https://leafletjs.com/reference.html#control
*/
const LogoControl = L.Control.extend({
  options: {
    position: 'bottomleft',
  },

  onAdd: function (map) {
    const container = L.DomUtil.create('div');
    const link = L.DomUtil.create('a', '', container);

    link.setAttribute('href', 'http://mapy.cz/');
    link.setAttribute('target', '_blank');
    link.innerHTML = '<img src="https://api.mapy.cz/img/api/logo.svg" />';
    L.DomEvent.disableClickPropagation(link);

    return container;
  },
});

// finally we add our LogoControl to the map
new LogoControl().addTo(map);