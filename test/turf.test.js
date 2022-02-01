const de9im = require('./de9im.loader').default;
const fs = require('fs');
const glob = require('glob');
const path = require('path');
const tap = require('tap');

const ext = '*.geojson';

// Test each predicate function
Object.keys(de9im).forEach((predicate) => {
  tap.test('turf-' + predicate, (t) => {
    // Test true and false fixtures
    ['true', 'false'].forEach((type) => {
      const pattern = path.join(__dirname, 'data', 'turf', predicate, type,
          '**', ext);
      glob.sync(pattern).forEach((filepath) => {
        // Extract fixtures
        const name = path.parse(filepath).name;
        const geojson = JSON.parse(fs.readFileSync(filepath));
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
        const assertion = type=='true' ? t.ok : t.notOk;
        assertion(result, message);
      });
    });
    t.end();
  });
});
