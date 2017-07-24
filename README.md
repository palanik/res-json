# res-json

Node.js middleware to send JSON/JSONP responses.

Adds `json()` & `jsonp()` methods to response object.

This middleware is primarily created for [router](https://www.npmjs.com/package/router) module.
Unlike [express](https://www.npmjs.com/package/express), which supports [json method](https://expressjs.com/en/4x/api.html#res.json) natively, router [does not provide](https://github.com/pillarjs/router/issues/39) such method to output json.

## Installation
```sh
$ npm install res-json --save
```

## Usage
```js
const json = require('res-json');

const router = Router();
router.use(json());

router.get('/', (req, res) => {
  res.json({id: 1, message: 'Hello, World!'})
});
```

## API
The middleware can be initialized optionally with a `replacer` and a `space` value.
For more info. refer to [JSON.stringify()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify).

You can also provide a third argument as callback name for jsonp to override default callback name - `callback`

```js
router.use(json(null, '\t'));  // indent with tabs
```
### res.json(obj)
Write a JSON response, using `JSON.stringify()` with the content-type `application/json`.

### res.jsonp(obj)
Write a JSON response with JSONP support.

```js
router.use(json(null, '', 'cb')); // callback name is cb

router.get('/', (req, res) => {
  res.jsonp({id: 1, message: 'Hello, World!'})
});
```

## License

  [MIT](LICENSE)
