const express = require('express');
const router = express.Router();
const {
  getDashboardMetrics,
  getLeadTrend,
  getStatusDistribution,
  getServiceDistribution,
  getLeadSourceDistribution,
  getConversationTrend,
  getDailyChatbotUsage,
  getChatbotAnalytics,
  getRevenueTrend,
  getFollowupSummary,
  getConversionFunnel,
} = require('../controllers/dashboardController');

router.get('/', getDashboardMetrics);
router.get('/lead-trend', getLeadTrend);
router.get('/status-distribution', getStatusDistribution);
router.get('/service-distribution', getServiceDistribution);
router.get('/lead-source', getLeadSourceDistribution);
router.get('/conversation-trend', getConversationTrend);
router.get('/daily-chatbot-usage', getDailyChatbotUsage);
router.get('/chatbot-analytics', getChatbotAnalytics);
router.get('/revenue', getRevenueTrend);
router.get('/followup-summary', getFollowupSummary);
router.get('/conversion-funnel', getConversionFunnel);

module.exports = router;
