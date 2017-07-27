import url from 'url';

function json(replacer, space, callback = 'callback') {
  const stringify = (replacer || space)
    ? (val => JSON.stringify(val, replacer, space))
    : (val => JSON.stringify(val));

  return ((req, res, next) => {
    res.json = ((val) => {
      const body = stringify(val);
      if (!res.getHeader('content-type')) {
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
      }

      res.end(body, 'utf8');
    });

    res.jsonp = ((val) => {
      const reqUrl = url.parse(req.url, true);
      if (reqUrl.query[callback]) {
        const cb = reqUrl.query[callback];
        const body = stringify(val);
        if (!res.getHeader('content-type')) {
          res.setHeader('Content-Type', 'text/javascript; charset=utf-8');
        }

        res.end(`typeof ${cb} === 'function' && ${cb}(${body});`, 'utf8');
      } else {
        res.json(val); // No callback query string? Fallback to json
      }
    });

    next();
  });
}

export default json;
module.exports = json;
