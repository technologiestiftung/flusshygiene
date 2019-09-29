// jest.useFakeTimers();
// import http from 'http';
// const server = http.createServer((req, res) => {
//   res.writeHead(201, { 'Content-Type': 'text/plain' });
//   res.end('okay');
// });
// server.listen(65535);

// afterAll(() => {
//   server.close();
// });
import { postPassThrough } from '../src/post-pass-through';
describe.skip('post pass through tests', () => {
  test('should return error  due to missing server', async (done) => {
    postPassThrough('http://localhost:65535', {})
      .then((res) => {})
      .catch((err) => {
        expect(err).toBeInstanceOf(Error);
        done();
      });
  });
});
