mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
    container: 'map',
    center: coordinates, // coordinates must be [lng, lat]
    zoom: 9
});

// Add default marker
new mapboxgl.Marker()
    .setLngLat(coordinates)
    .addTo(map);

