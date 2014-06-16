'use strict';

function getData() {
  var json = require('fs').readFileSync(__dirname + '/test/fixtures/sample-data.json', 'utf8');
  return JSON.parse(json);
}

function inspect(obj, depth) {
  console.error(require('util').inspect(obj, false, depth || 5, true));
}

var go = module.exports = function () {
  
}

// Test
if (!module.parent && typeof window === 'undefined') {
  var data = getData();
  inspect(data);
}
