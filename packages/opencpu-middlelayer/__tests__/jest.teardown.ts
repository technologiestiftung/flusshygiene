module.exports = function() {
  if (process.env.CI !== undefined) process.exit(0);
};
