const app = require('../../src/app');

describe('\'search\' service', () => {
  it('registered the service', () => {
    const service = app.service('search');
    expect(service).toBeTruthy();
  });
});
