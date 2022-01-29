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

  // ==================================================
  // Geometry rendering styles
  // --------------------------------------------------
  const styleFeature1 = {
    LineString: new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: [255, 0, 0],
        width: 5
      })
    }),
    MultiPoint: new ol.style.Style({
      image: new ol.style.Circle({
        radius: 5,
        fill: null,
        stroke: new ol.style.Stroke({color: 'red', width: 5})
      })
    }),
    Polygon: new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: [255, 0, 0],
        width: 5
      })
    })
  };

  const styleFeature2 = {
    LineString: new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: [0, 255, 0],
        width: 5
      })
    }),
    MultiPoint: new ol.style.Style({
      image: new ol.style.Circle({
        radius: 5,
        fill: null,
        stroke: new ol.style.Stroke({color: 'green', width: 5})
      })
    }),
    Polygon: new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: [0, 255, 0],
        width: 5
      })
    })
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
    const name1 = names[0];
    const name2 = names[1];
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
        const options1 = {
          source: new ol.source.Vector({
            features: features1,
          }),
          style: styleFeature1[name1]
        };

        const vector1 = new ol.layer.Vector(options1);
        vector1.set('name', name1 + ' #1');
        vector1.setVisible(false);

        // Feature #2
        const features2 = geojson.readFeatures(data.features[1], {
          dataProjection: 'EPSG:4326',
          featureProjection: explorer.map.getView().getProjection()
        });
        const options2 = {
          source: new ol.source.Vector({
            features: features2,
          }),
          style: styleFeature2[name2]
        };

        const vector2 = new ol.layer.Vector(options2);
        vector2.set('name', name2 + ' #2');
        vector2.setVisible(false);

        // ==================================================
        // Add predicate group
        // --------------------------------------------------
        const group = new ol.layer.Group({
          layers: [vector2, vector1],
        });
        group.set('name', predicate);
        layers[geometry].push(group);

      }).fail(function() {
        console.log(`${name1} ${predicate} ${name2} not found.`);
      });
      requestsPredicates.push(request);
    });

    // ==================================================
    // Add layers to group when layers resolve.
    // --------------------------------------------------
    const request = $.when(...requestsPredicates).then(data => {

      // Add geometry pair group
      layers[geometry].sort((a,b) => (a.get('name') > b.get('name')) ? -1 : ((b.get('name') > a.get('name')) ? 1 : 0))
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
