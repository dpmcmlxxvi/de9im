// Perform timing bench tests
const benny = require('benny');
const de9im = require('../de9im');
const fs = require('fs');
const glob = require('glob');
const pkg = require('../package');
const path = require('path');

// Read all data in bench directory
const pattern = path.join(__dirname, 'data', 'bench', '**', '*.geojson');
glob.sync(pattern).forEach((filepath) => {
  cases = [];

  // Extract fixtures
  const name = path.parse(filepath).name;
  const geojson = JSON.parse(fs.readFileSync(filepath));
  const feature1 = geojson.features[0];
  const feature2 = geojson.features[1];
  const geometry1 = feature1.geometry.type;
  const geometry2 = feature2.geometry.type;
  const type = geometry1 + '-' + name + '-' + geometry2;

  // Test each predicate function
  Object.keys(de9im).forEach((predicate) => {
    try {
      de9im[predicate](feature1, feature2);
      cases.push(benny.add(predicate, () => {
        de9im[predicate](feature1, feature2);
      }));
    } catch (error) {
      console.log('Skipping (' + type + ') with predicate ' + predicate +
                  '. Not supported.');
    }
  });

  benny.suite(
      type,
      ...cases,
      benny.cycle(),
      benny.complete(),
      benny.save({file: type, format: 'json', version: pkg.version}));
});
