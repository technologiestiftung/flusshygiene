process.env.PG_PORT = '5432';
import PG, { pgOptions } from '../src/lib/old/postgres';
jest.useFakeTimers();

describe.skip('testing the postgres singleton class', ()=>{
  it('should alwas be the same object that gets returned', ()=>{
    expect(PG).toBeDefined();
    expect(PG.getInstance).toBeDefined();
    const pgClientOne = PG.getInstance();
    expect(pgClientOne).toBe(PG.getInstance());
  });
});

describe.skip('testing the postgres options', ()=>{
  it('should be a number', ()=>{
    expect(pgOptions.port).toBeDefined();
    expect(typeof pgOptions.port).toBe('number');
  });
});

describe.skip('testing the postgres error handler', ()=>{
  it('should write to stderr', ()=>{
    const spy = jest.spyOn(process.stderr, 'write');
    const pgClient = PG.getInstance();
    pgClient.emit('error');
    expect(spy).toHaveBeenCalled();
  });
});
