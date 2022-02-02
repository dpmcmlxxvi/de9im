// Generate report of timing bench tests
const de9im = require('../de9im');
const fs = require('fs');
const glob = require('glob');
const json2md = require('json2md');
const pkg = require('../package');
const path = require('path');

// Create report introduction
const title = 'Timing bench test results for `' + pkg.name + '`';
const introduction = 'The following presents the number of operations per ' +
  'second to process each\npair of geometries with the given relation by ' +
  'each predicate. An :x:\nindicates the predicate is not supported for ' +
  'those geometries. The fastest\nand slowest times are highlighted. The ' +
  'geometries tested are in\n`test/data/bench`.';

// Create report table
const predicates = Object.keys(de9im);
const headers = ['first', 'relation', 'second'].concat(predicates);

// Read all data in bench directory and create report rows
const rows = [];
const pattern = path.join(__dirname, '..', 'benchmark', 'results', '*.json');
glob.sync(pattern).forEach((filepath) => {
  // Extract 'name' and 'ops' for each result
  const json = JSON.parse(fs.readFileSync(filepath));
  const [first, relation, second] = json.name.split('-');
  const type = {'first': first, 'relation': relation, 'second': second};
  const results = json.results.map((result) => {
    return [result.name, parseInt(result.ops).toLocaleString()];
  });
  const row = Object.fromEntries(results);
  predicates.forEach((predicate) => {
    if (predicate in row) {
      return;
    }
    row[predicate] = ':x:';
  });

  // Highlight fastest and slowest 'ops'.
  const fastest = json.fastest.name;
  const slowest = json.slowest.name;
  row[fastest] = '<span style="color:green">**' + row[fastest] + '**</span>';
  row[slowest] = '<span style="color:red">**' + row[slowest] + '**</span>';
  rows.push({...type, ...row});
});

// Sort entries by geometries then predicates.
let sorter = rows.map((row, index) => {
  return [row['first'], row['second'], row['relation']].join('-');
});
sorter = sorter.sort().map((value, index) => {
  return [value, index];
});
sorter = Object.fromEntries(sorter);
rows.sort((a, b) => {
  const keya = [a['first'], a['second'], a['relation']].join('-');
  const keyb = [b['first'], b['second'], b['relation']].join('-');
  return sorter[keya] - sorter[keyb];
});

// Create report data
const data = [
  {
    'h1': title,
  },
  {
    'p': introduction,
  },
  {
    'p': '<!--lint disable maximum-line-length-->',
  },
  {
    'table': {
      'headers': headers,
      'rows': rows,
    },
  },
  {
    'p': '<!--lint enable maximum-line-length-->',
  },
];

// Generate report, center columns, and remove multiple newlines for linting.
let report = json2md(data);
report = report.replace(/\| \-/g, '|:-');
report = report.replace(/\- \|/g, '-:|');
report = report.replace(/\n\n/g, '\n');

// Export to file.
filename = path.join(__dirname, '..', 'bench.md');
fs.writeFileSync(filename, report);
