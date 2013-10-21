var request = require('superagent');

function promise(getter, next) {
  var item = null, waiting = [];
  var superagent = getter instanceof request.Request;
  if (superagent) getter = getter.end;
  getter(function (err, res) {
    if (err) return next(err);
    if (superagent) { res = res.body; }
    item = res;
    waiting.forEach(function (fn) {
      fn(item);
    });
    next(null, item);
  });
  return function (fn) {
    if (item !== null) return fn(item, true);
    waiting.push(fn);
  };
}

module.exports = promise;
