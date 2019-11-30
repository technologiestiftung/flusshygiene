// this adds jest-dom's custom assertions
import '@testing-library/jest-dom/extend-expect';
import { GlobalWithFetchMock } from 'jest-fetch-mock';
const customGlobal: GlobalWithFetchMock = global as GlobalWithFetchMock;
customGlobal.fetch = require('jest-fetch-mock');
customGlobal.fetchMock = customGlobal.fetch;
// import '@testing-library/react/cleanup-after-each';

// console.info('globel setup done');
