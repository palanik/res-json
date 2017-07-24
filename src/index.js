function json(replacer, space, callback = 'callback') {
  const stringify = (replacer || space)
    ? (val => JSON.stringify(val, replacer, space))
    : (val => JSON.stringify(val));

  return ((req, res, next) => {
    res.json = ((val) => {
      const body = stringify(val);
      if (!res.getHeader('Content-Type')) {
        res.setHeader('Content-Type', 'application/json');
      }

      res.end(body);
    });

    res.jsonp = ((val) => {
      const body = stringify(val);
      if (!res.getHeader('Content-Type')) {
        res.setHeader('Content-Type', 'text/javascript');
      }

      res.end(`typeof ${callback} === 'function' && ${callback}(${body});`);
    });

    next();
  });
}

export default json;
