import finalhandler from'finalhandler';
import http from 'http';

function serve(router) {
  return http.createServer((req, res) => {
    router(req, res, finalhandler(req, res))
  });
}

export default serve;
