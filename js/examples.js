/**
 * Run de9im examples
 * @param {string} id Explorer DOM id
 * @return {Explorer} OpenLayer Explorer instance
 */
const loadExamples = function(id) {
  // ==================================================
  // Layers Example
  // --------------------------------------------------

  const explorer = new olexp.Explorer(id);

  // ==================================================
  // Add OSM map
  // --------------------------------------------------
  const layerosm = new ol.layer.Tile({
    source: new ol.source.OSM(),
  });
  layerosm.set('name', 'OpenStreetMap');

  // ==================================================
  // Add Stamen map
  // --------------------------------------------------
  const layerstm = new ol.layer.Tile({
    source: new ol.source.Stamen({layer: 'watercolor'}),
  });
  layerstm.set('name', 'Stamen');

  // ==================================================
  // Add tiles group
  // --------------------------------------------------

  const tiles = new ol.layer.Group({
    layers: [layerosm, layerstm],
  });
  tiles.set('name', 'Tiles');
  explorer.map.addLayer(tiles);

  // ==================================================
  // Center display
  // --------------------------------------------------
  const position = ol.proj.transform([0, 0],
      'EPSG:4326',
      'EPSG:3857');

  explorer.map.getView().setCenter(position);

  // ==================================================
  // Datasets to display
  // --------------------------------------------------
  const datasets = {
    "LineString/LineString": [
      "contains",
      "coveredby",
      "covers",
      "crosses",
      "disjoint",
      "equals",
      "intersects",
      "overlaps",
      "touches",
      "within"
    ],
    "LineString/Polygon": [
      "coveredby",
      "crosses",
      "disjoint",
      "intersects",
      "touches",
      "within"
    ],
    "MultiPoint/LineString": [
      "coveredby",
      "crosses",
      "disjoint",
      "intersects",
      "touches",
      "within"
    ],
    "MultiPoint/MultiPoint": [
      "contains",
      "coveredby",
      "covers",
      "disjoint",
      "equals",
      "intersects",
      "overlaps",
      "within"
    ],
    "MultiPoint/Polygon": [
      "coveredby",
      "disjoint",
      "intersects",
      "touches",
      "within"
    ],
    "Polygon/Polygon": [
      "contains",
      "coveredby",
      "covers",
      "disjoint",
      "equals",
      "intersects",
      "overlaps",
      "touches",
      "within"
    ]
  };

  // Container for layers added for each geometry combination
  const layers = {};
  const groups = {};
  const requestsGeometries = [];

  // ==================================================
  // Add each geometry and predicate combination
  // --------------------------------------------------
  const geometries = Object.keys(datasets).sort();
  geometries.forEach(geometry => {

    layers[geometry] = [];

    const names = geometry.split("/");
    const predicates = datasets[geometry];
    const requestsPredicates = [];

    predicates.forEach(predicate => {

      const filename = `./data/${geometry}/${predicate}.geojson`;
      const request = $.getJSON(filename, data => {

        // ==================================================
        // Add geojson features separately
        // --------------------------------------------------
        const geojson = new ol.format.GeoJSON();

        // Feature #1
        const features1 = geojson.readFeatures(data.features[0], {
          dataProjection: 'EPSG:4326',
          featureProjection: explorer.map.getView().getProjection()
        });
        const vector1 = new ol.layer.Vector({
          source: new ol.source.Vector({
            features: features1,
          }),
          style: new ol.style.Style({
            stroke: new ol.style.Stroke({
              color: [255, 0, 0],
              width: 5
            })
          })
        });
        vector1.set('name', names[0] + ' #1');
        vector1.setVisible(false);

        // Feature #2
        const features2 = geojson.readFeatures(data.features[1], {
          dataProjection: 'EPSG:4326',
          featureProjection: explorer.map.getView().getProjection()
        });
        const vector2 = new ol.layer.Vector({
          source: new ol.source.Vector({
            features: features2,
          }),
          style: new ol.style.Style({
            stroke: new ol.style.Stroke({
              color: [0, 255, 0],
              width: 5
            })
          })
        });
        vector2.set('name', names[1] + ' #1');
        vector2.setVisible(false);

        // ==================================================
        // Add predicate group
        // --------------------------------------------------
        const group = new ol.layer.Group({
          layers: [vector1, vector2],
        });
        group.set('name', predicate);
        layers[geometry].push(group);

      }).fail(function() {
        console.log(`${names[0]} ${predicate} ${names[1]} not found.`);
      });
      requestsPredicates.push(request);
    });

    // ==================================================
    // Add layers to group when layers resolve.
    // --------------------------------------------------
    const request = $.when(...requestsPredicates).then(data => {

      // Add geometry pair group
      const group = new ol.layer.Group({
        layers: layers[geometry],
      });
      group.set('name', geometry);
      groups[geometry] = group;

    });
    requestsGeometries.push(request);
  
  });

  $.when(...requestsGeometries).then(data => {
    const geometries = Object.keys(groups).sort().reverse();
    geometries.forEach(geometry => {
      explorer.map.addLayer(groups[geometry]);
    });

  });

  return explorer;
};
