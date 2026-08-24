// Lead Controller (Mock data matching docs/05_API_LIST.md)
const mockLeads = [
  { id: '1', name: 'John Doe', email: 'john.doe@acme.com', company: 'Acme Corp', status: 'New', score: 85, phone: '+1 (555) 234-5678' },
  { id: '2', name: 'Sarah Smith', email: 'sarah@technova.io', company: 'TechNova', status: 'Contacted', score: 92, phone: '+1 (555) 876-5432' },
  { id: '3', name: 'Michael Brown', email: 'mbrown@globallogistics.com', company: 'Global Logistics', status: 'Qualified', score: 78, phone: '+1 (555) 345-6789' },
];

const getLeads = (req, res) => {
  res.status(200).json({
    success: true,
    leads: mockLeads
  });
};

const getLeadById = (req, res) => {
  const { id } = req.params;
  const lead = mockLeads.find(l => l.id === id) || mockLeads[0];
  
  res.status(200).json({
    success: true,
    lead,
    followups: [
      { id: 'f101', notes: 'Initial discovery call completed', date: '2026-08-20', status: 'Completed' }
    ]
  });
};

module.exports = {
  getLeads,
  getLeadById
};
