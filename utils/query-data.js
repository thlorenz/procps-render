'use strict';

var queryData = module.exports = exports = function queryData() {
  var procps = require('procps');
  var flags = procps.readproctab.flagsFillAll ^ procps.readproctab.PROC_FILLENV;
  var sysinfo = procps.sysinfo;
  return {
      proctab     : procps.readproctab(flags, true)
    , diskstat    : sysinfo.getdiskstat()
    , stat        : sysinfo.getstat()
    , loadavg     : sysinfo.loadavg()
    , meminfo     : sysinfo.meminfo()
    , vminfo      : sysinfo.vminfo()
    , uptime      : sysinfo.uptime()
    , uptimeSince : sysinfo.uptimeSince()
  }
}

exports.getCmd = function (cmd) {
  var data = queryData();
  var match = data.proctab.filter(function (x) { return x.cmd === cmd })[0];
  if (match) {
    // todo: why is it included ??
    delete match.environ;
  }
  return match;
}
