const { statusCodes } = require("../config/statusConstants");

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode ? err.statusCode : 500;
  // console.log("Status", statusCode);
  res.status(statusCode);

  if(statusCode >= 400) {
    console.log("Error", err.message, err.stack);
  }
  switch(statusCode) {
    case statusCodes.VALIDATION_ERROR: res.json({title: "Validation Error", message: err.message, stackTrace: err.stack})
      break;
    case statusCodes.NOT_FOUND: res.json({title: "Not Found", message: err.message, stackTrace: err.stack});
      break;
    case statusCodes.UNAUTHORIZED: res.json({title: "Not Authorized", message: err.message, stackTrace: err.stack});
      break;
    case statusCodes.FORBIDDER: res.json({title: "Forbidden", message: err.message, stackTrace: err.stack});
      break;
    case statusCodes.SERVER_ERROR: res.json({title: "Server Error", message: err.message, stackTrace: err.stack});
      break;
    default:
      console.log("No error! All good!");
    break;
  }
  // res.status(statusCode).json({
  //   status: statusCode,
  //   message: err.message || 'Internal Server Error',
  // });
};

module.exports = errorHandler;
