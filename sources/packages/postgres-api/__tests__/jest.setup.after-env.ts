jest.mock('aws-sdk');
jest.useFakeTimers();
jest.setTimeout(30000);
module.exports = async () => {
  console.log('setup after env');
};
