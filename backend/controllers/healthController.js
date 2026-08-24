// Health Controller
const getHealthStatus = (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'AI-Agentix-CRM Backend Service is operational',
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
};

module.exports = {
  getHealthStatus
};
