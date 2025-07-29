export default (req, res, next) => {
  try {
    console.log('----- Incoming Request -----');
    console.log('Method:', req.method);
    console.log('URL:', req.originalUrl);
    console.log('Headers:', req.headers);
    console.log('Query:', req.query);
    console.log('Params:', req.params);
    console.log('Body:', req.body);
    console.log('----------------------------');

    next();
  } catch (err) {
    console.error('Logging Middleware Error:', err);
    next(err);
  }
};
