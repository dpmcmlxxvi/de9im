// Perform timing bench tests
import benny from 'benny';
import de9im from '../index.js';
import fs from 'fs';
import glob from 'glob';
import pkg from "./package.json" with { type: "json" };
import path from 'path';

// Read all data in bench directory
const pattern = path.join(__dirname, 'data', 'bench', '**', '*.geojson');
glob.sync(pattern).forEach((filepath) => {
  let cases = [];

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
    } catch (_) {
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
