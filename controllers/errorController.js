const AppError = require('../utils/appError');

const handleCastErrorDB = error => {
  const message = `Invalid ${error.path} : ${error.value}`;
  return new AppError(message, 400);
};

const handleJWTError = error => {
  const message = 'Invalid token, please login again';
  return new AppError(message, 401);
};

const handleExpiredError = error => {
  const message = 'Token expired';
  return new AppError(message, 401);
};

const sendErrorDev = (error, res) => {
  res.status(error.statusCode).json({
    status: error.status,
    message: error.message,
    stack: error.stack,
    error: error
  });
};

const sendErrorProd = (error, res) => {
  if (error.isOperational) {
    res.status(error.statusCode).json({
      status: error.status,
      message: error.message
    });
  } else {
    console.log('Error 💥', error);
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong'
    });
  }
};

module.exports = (error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(error, res);
  } else {
    let err = { ...error };
    if (err.name === 'CastError') err = handleCastErrorDB(err);
    if ((err.name = 'JsonWebTokenError')) err = handleJWTError(err);
    if ((err.name = 'TokenExpiredError')) err = handleExpiredError(err);
    sendErrorProd(err, res);
  }
};
