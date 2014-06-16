'use strict';

function pad(n, s, left) {
  var spaces = new Array(n).join(' ');
  return left 
    ? (spaces + s).slice(-n)
    : (s + spaces).slice(0, n)
}

//  #define PAGES_TO_KB(n)  (unsigned long)( (n) << page_to_kb_shift )
//  (float)PAGES_TO_KB(p->resident) * 100 / kb_main_total)
function percentMem(proctab) {

}

var table = {
    PID: 'tid'  
  , USER: 'euser' // or any other user
  , PR: 'priority'
  , NI: 'nice'
  , VIRT: 'vsize'
  // scale_num(PAGES_TO_KB(p->resident), w, s));
  , RES: 'resident'
  , SHR: 'share'
  , '%CPU': function (x) { return Math.round(x.pcpu * 10) / 10 }
  //, '%MEM':  percentMem
  // , 'TIME+':  
  , COMMAND: 'cmd'
}

function mapProc(proc, table) {
  return Object.keys(table)
    .reduce(function (acc, k) {
      var map = table[k];
      if (typeof map === 'undefined') throw new Error('bad map ' + k);
      acc[k] = typeof map === 'function'
        ? acc[k] = table[k](proc)
        : acc[k] = proc[map];
      return acc;
    }, {})
}

function renderMappedProc(mapped, pad) {
  return Object.keys(mapped)
    .reduce(function (acc, k) {
      acc += pad(mapped[k])
      return acc;
    }, '');
}

function renderHeader(table, pad) {
  return Object.keys(table)
    .reduce(function (acc, k) {
      acc += pad(k)
      return acc;
    }, '');
}

function mapProctab(proctab, table) {
  return proctab
    .map(function (x) { return mapProc(x, table) })
}

function sortMapped(proctab, by) {
  return proctab.sort(function (a, b) {
    return a[by] < b[by] ? 1 : -1;
  })
}

function renderMapped(mapped, pad) {
  return mapped
    .map(function (x) { return renderMappedProc(x, pad) })
    .join('\n')
}

function renderProctab(proctab, table, pad, sortBy, rows) {
  var mapped = mapProctab(proctab, table);
  if (sortBy) mapped = sortMapped(mapped, sortBy);
  if (rows) mapped = mapped.slice(0, rows);
  return renderMapped(mapped, pad);
}

function inspect(obj, depth) {
  console.error(require('util').inspect(obj, false, depth || 5, true));
}

// PID USER      PR  NI    VIRT    RES    SHR S  %CPU %MEM     TIME+ COMMAND
// 634 vagrant   20   0   36652  18592   1340 S   0.7  0.5   1:52.00 tmux
function refresh() {
  var queryData = require('../utils/query-data');

  console.log('\x1bc')
  console.log(renderHeader(table, pad.bind(null, 10)));

  var proctab = queryData().proctab;
  var tab = renderProctab(proctab, table, pad.bind(null, 10), '%CPU', 30);
  console.log(tab);
}

setInterval(refresh, 1000);



