'use strict';

function queryData() {
  var procps = require('procps');
  var flags = procps.readproctab.flagsFillAll ^ procps.readproctab.PROC_FILLENV;
  var sysinfo = procps.sysinfo;
  return {
      proctab     : procps.readproctab(flags)
    , diskstat    : sysinfo.getdiskstat()
    , stat        : sysinfo.getstat()
    , loadavg     : sysinfo.loadavg()
    , meminfo     : sysinfo.meminfo()
    , vminfo      : sysinfo.vminfo()
    , uptime      : sysinfo.uptime()
    , uptimeSince : sysinfo.uptimeSince()
  }
}

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
