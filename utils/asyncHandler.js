// utils/asyncHandler.js

module.exports = (fn) => {
  return (req, res, next) => {
    // Executes your async controller function and catches any rejected promises,
    // passing the error seamlessly to the global error middleware via next()
    fn(req, res, next).catch(next);
  };
};