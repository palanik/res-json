import { expect } from 'chai';
import assert from 'assert';

import Router from 'router';
import request from 'supertest';
import serve from './fixtures/server.js';
import resjson from '../src/';

describe('jsonp(object)', () => {

  it('simple object - default', (done) => {
    const data = {
      a: 1,
      b: 'bb',
      c: {
        cc: 'ccc'
      }
    };

    const router = Router();
    const server = serve(router);

    router.use(resjson());
    router.get('/', (req, res) => {
      res.jsonp(data);
    });

    request(server)
    .get('/?callback=callback')
    .expect('Content-Type', 'text/javascript; charset=utf-8')
    .expect(200, `typeof callback === 'function' && callback(${JSON.stringify(data)});`, done);

  });

  it('simple object - replacer', (done) => {
    function replacer(key, value) {
      if (typeof value === 'string') {
        return undefined;
      }
      return value;
    }

    const data = {
      a: 1,
      b: 'bb',
      c: {
        cc: 'ccc'
      }
    };

    const router = Router();
    const server = serve(router);

    router.use(resjson(replacer));
    router.get('/', (req, res) => {
      res.jsonp(data);
    });

    request(server)
    .get('/?callback=callback')
    .expect('Content-Type', 'text/javascript; charset=utf-8')
    .expect(200, `typeof callback === 'function' && callback(${JSON.stringify({a:1,c:{}})});`, done);
  });

  it('simple object - space', (done) => {
    const data = {
      a: 1,
      b: 'bb',
      c: {
        cc: 'ccc'
      }
    };

    const router = Router();
    const server = serve(router);

    router.use(resjson(null, '  '));
    router.get('/', (req, res) => {
      res.jsonp(data);
    });

    request(server)
    .get('/?callback=callback')
    .expect('Content-Type', 'text/javascript; charset=utf-8')
    .expect(200, `typeof callback === 'function' && callback(${JSON.stringify(data, null, '  ')});`, done);
  });

  it('simple object - callback', (done) => {
    const data = {
      a: 1,
      b: 'bb',
      c: {
        cc: 'ccc'
      }
    };

    const router = Router();
    const server = serve(router);

    router.use(resjson(null, null, 'magic'));
    router.get('/', (req, res) => {
      res.jsonp(data);
    });

    request(server)
    .get('/?magic=callback')
    .expect('Content-Type', 'text/javascript; charset=utf-8')
    .expect(200, `typeof callback === 'function' && callback(${JSON.stringify(data)});`, done);
  });

  it('simple object - replacer, space & callback', (done) => {
    function replacer(key, value) {
      if (typeof value === 'string') {
        return undefined;
      }
      return value;
    }

    const data = {
      a: 1,
      b: 'bb',
      c: {
        cc: 'ccc'
      }
    };

    const router = Router();
    const server = serve(router);

    router.use(resjson(replacer, '\t', 'magic'));
    router.get('/', (req, res) => {
      res.jsonp(data);
    });

    request(server)
    .get('/?magic=hocus')
    .expect('Content-Type', 'text/javascript; charset=utf-8')
    .expect(200, `typeof hocus === 'function' && hocus(${JSON.stringify({a:1,c:{}}, null, '\t')});`, done);
  });
});

describe('content-type', () => {
  it('content-type already set', (done) => {
    const data = {
      a: 1,
      b: 'bb',
      c: {
        cc: 'ccc'
      }
    };

    const router = Router();
    const server = serve(router);

    router.use(resjson());
    router.get('/', (req, res) => {
      res.setHeader('Content-Type', 'not javascript');
      res.jsonp(data);
    });

    request(server)
    .get('/?callback=callback')
    .expect('Content-Type', 'not javascript')
    .expect(200, `typeof callback === 'function' && callback(${JSON.stringify(data)});`, done);
  });
});

describe('json', () => {
  it('without callback should return json', (done) => {
    const data = {
      a: 1,
      b: 'bb',
      c: {
        cc: 'ccc'
      }
    };

    const router = Router();
    const server = serve(router);

    router.use(resjson());
    router.get('/json', (req, res) => {
      res.jsonp(data);
    });

    request(server)
    .get('/json')
    .expect('Content-Type', 'application/json; charset=utf-8')
    .expect(200, JSON.stringify(data), done);
  });
});
