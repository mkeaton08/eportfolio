// Request logging middleware
const requestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const route = req.originalUrl || req.url;

  // Log the incoming request
  console.log(`[${timestamp}] ${method} ${route}`);

  // Capture the original res.json to log response status
  const originalJson = res.json.bind(res);
  res.json = function(body) {
    console.log(`[${timestamp}] ${method} ${route} - Status: ${res.statusCode}`);
    return originalJson(body);
  };

  next();
};

module.exports = {
  requestLogger
};
