import { expect } from 'chai';
import assert from 'assert';

import Router from 'router';
import request from 'supertest';
import serve from './fixtures/server.js';
import resjson from '../src/';

describe('json(object)', () => {

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
      res.json(data);
    });

    request(server)
    .get('/')
    .expect('Content-Type', 'application/json; charset=utf-8')
    .expect(200, JSON.stringify(data), done);

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
      res.json(data);
    });

    request(server)
    .get('/')
    .expect(200, JSON.stringify({a:1,c:{}}), done);

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
      res.json(data);
    });

    request(server)
    .get('/')
    .expect(200, JSON.stringify(data, null, '  '), done);

  });

  it('simple object - replacer & space', (done) => {
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

    router.use(resjson(replacer, '\t'));
    router.get('/', (req, res) => {
      res.json(data);
    });

    request(server)
    .get('/')
    .expect(200, JSON.stringify({a:1,c:{}}, null, '\t'), done);

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
      res.setHeader('Content-Type', 'not json');
      res.json(data);
    });

    request(server)
    .get('/')
    .expect('Content-Type', 'not json')
    .expect(200, JSON.stringify(data), done);
  });
});

describe('jsonp', () => {
  it('with callback still should not return jsonp', (done) => {
    const data = {
      a: 1,
      b: 'bb',
      c: {
        cc: 'ccc'
      }
    };

    const router = Router();
    const server = serve(router);

    router.use(resjson(null, null, 'jsonpInvoke'));
    router.get('/jsonp', (req, res) => {
      res.json(data);
    });

    request(server)
    .get('/jsonp?callback=callback')
    .expect('Content-Type', 'application/json; charset=utf-8')
    .expect(200, JSON.stringify(data), done);
  });
});
