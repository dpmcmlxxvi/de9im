const de9im = require('..');
const glob = require('glob');
const load = require('load-json-file');
const path = require('path');
const test = require('tape');

const ext = '*.geojson';

// Test each predicate function
Object.keys(de9im).forEach((predicate) => {
  test('de9im-' + predicate, (t) => {
    // Test true, false, and throws fixtures
    ['true', 'false', 'throws'].forEach((type) => {
      const pattern = path.join(__dirname, 'data', 'de9im', predicate, type,
          '**', ext);
      glob.sync(pattern).forEach((filepath) => {
        // Extract fixtures
        const name = path.parse(filepath).name;
        const geojson = load.sync(filepath);
        const feature1 = geojson.features[0];
        const feature2 = geojson.features[1];

        // Test for given true/false/throws type.
        const message = '[' + type + '] ' + name;
        switch (type) {
          case 'true':
            t.ok(de9im[predicate](feature1, feature2), message);
            break;
          case 'false':
            t.notOk(de9im[predicate](feature1, feature2), message);
            break;
          case 'throws':
            t.throws(() => de9im[predicate](feature1, feature2), message);
            t.notOk(de9im[predicate](feature1, feature2, false), message);
            break;
        }
      });
    });
    t.end();
  });
});
