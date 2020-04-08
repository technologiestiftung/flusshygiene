module.exports = {
  createTransport: jest.fn(() => {
    return { sendMail: jest.fn(), verify: jest.fn(), close: jest.fn() };
  }),
};
