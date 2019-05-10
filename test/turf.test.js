const de9im = require('..');
const glob = require('glob');
const load = require('load-json-file');
const path = require('path');
const test = require('tape');

const ext = '*.geojson';

// Test each predicate function
Object.keys(de9im).forEach((predicate) => {
  test('turf-' + predicate, (t) => {
    // Test true and false fixtures
    ['true', 'false'].forEach((type) => {
      const pattern = path.join(__dirname, 'data', 'turf', predicate, type,
          '**', ext);
      glob.sync(pattern).forEach((filepath) => {
        // Extract fixtures
        const name = path.parse(filepath).name;
        const geojson = load.sync(filepath);
        const feature1 = geojson.features[0];
        const feature2 = geojson.features[1];

        let result = null;
        try {
          result = de9im[predicate](feature1, feature2);
        } catch (e) {
          if (e.message.includes('not supported')) {
            result = false;
          }
        }

        // Test for given true/false type.
        const message = '[' + type + '] ' + name;
        const ok = t[type];
        ok(result, message);
      });
    });
    t.end();
  });
});
