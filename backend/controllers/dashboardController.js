// Dashboard Controller (Serving structured metrics matching docs/05_API_LIST.md)
const getDashboardMetrics = (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      totalLeads: 128,
      totalCustomers: 45,
      pendingFollowups: 18,
      conversionRate: 35.2,
      recentActivities: [
        { id: 1, type: 'lead_created', title: 'New lead John Doe created', time: '10 mins ago' },
        { id: 2, type: 'followup_scheduled', title: 'Follow-up scheduled with Acme Corp', time: '1 hour ago' },
        { id: 3, type: 'customer_converted', title: 'Global Tech converted to Customer', time: '3 hours ago' },
      ]
    }
  });
};

module.exports = {
  getDashboardMetrics
};
