const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');

require('dotenv').config({ path: path.join(__dirname, '../.env') });

const User = require('../models/User');
const Lead = require('../models/Lead');
const Customer = require('../models/Customer');
const Followup = require('../models/Followup');
const Conversation = require('../models/Conversation');
const Chatbot = require('../models/Chatbot');
const Activity = require('../models/Activity');
const Note = require('../models/Note');

const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/ai-agentix-crm';

const seedDatabase = async () => {
  try {
    console.log('Connecting to MongoDB Atlas / Database...');
    await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 5000 });
    console.log('MongoDB Connected successfully!');

    // 1. SEED USERS
    console.log('Seeding Users...');
    const salt = await bcrypt.genSalt(10);
    const defaultPasswordHash = await bcrypt.hash('admin123', salt);

    const userSeedData = [
      { first_name: 'Rajesh', last_name: 'Sharma', email: 'admin@aiagentix.com', password_hash: defaultPasswordHash, role: 'admin' },
      { first_name: 'Priya', last_name: 'Patel', email: 'priya.patel@aiagentix.com', password_hash: defaultPasswordHash, role: 'sales_rep' },
      { first_name: 'Amit', last_name: 'Verma', email: 'amit.verma@aiagentix.com', password_hash: defaultPasswordHash, role: 'sales_rep' },
      { first_name: 'AI Bot', last_name: 'Agent', email: 'bot.agent@aiagentix.com', password_hash: defaultPasswordHash, role: 'agent' },
    ];

    let users = [];
    for (const u of userSeedData) {
      let existing = await User.findOne({ email: u.email });
      if (!existing) {
        existing = await User.create(u);
      }
      users.push(existing);
    }
    const adminUser = users[0];
    const priyaUser = users[1];
    const amitUser = users[2];

    // 2. SEED CHATBOTS
    console.log('Seeding Chatbots...');
    const chatbotSeedData = [
      {
        name: 'Website Assistant Bot',
        clientName: 'Enterprise Global Portal',
        website: 'https://ai-agentix-crm.com',
        platform: 'Website',
        aiModel: 'GPT-4o',
        description: 'Primary web lead capture and AI customer inquiry bot.',
        version: 'v2.4',
        status: 'Active',
        totalConversations: 1420,
        todaysConversations: 45,
        resolutionRate: '94.2%',
        avgResponseTime: '1.1s',
        successRate: '96.5%',
        escalations: 14,
      },
      {
        name: 'WhatsApp Business Automator',
        clientName: 'Omnichannel Connect',
        website: 'https://wa.me/919876500123',
        platform: 'WhatsApp',
        aiModel: 'Gemini 1.5 Pro',
        description: 'Instant WhatsApp lead qualifying & automated booking assistant.',
        version: 'v1.8',
        status: 'Active',
        totalConversations: 980,
        todaysConversations: 32,
        resolutionRate: '91.8%',
        avgResponseTime: '0.8s',
        successRate: '94.2%',
        escalations: 18,
      },
      {
        name: 'Social Media AI Concierge',
        clientName: 'Meta Marketing Suite',
        website: 'https://facebook.com/aiagentix',
        platform: 'Facebook',
        aiModel: 'Claude 3.5 Sonnet',
        description: 'Facebook & Instagram DM AI responder for campaign leads.',
        version: 'v1.2',
        status: 'Active',
        totalConversations: 410,
        todaysConversations: 12,
        resolutionRate: '88.5%',
        avgResponseTime: '1.5s',
        successRate: '90.0%',
        escalations: 8,
      },
    ];

    let chatbots = [];
    for (const b of chatbotSeedData) {
      let existing = await Chatbot.findOne({ name: b.name });
      if (!existing) {
        existing = await Chatbot.create(b);
      }
      chatbots.push(existing);
    }

    // 3. SEED LEADS (50 Realistic Business Leads)
    console.log('Seeding 50 Business Leads...');
    const leadCount = await Lead.countDocuments();
    let leads = [];

    if (leadCount < 50) {
      const services = [
        'AI Chatbot', 'Website Development', 'Web Application', 'CRM Development',
        'WhatsApp Automation', 'AI Image Generation', 'AI Video Generation',
        'Business Automation', 'Social Media Automation', 'AI Content Creation'
      ];

      const industries = ['Healthcare', 'FinTech', 'E-Commerce', 'Real Estate', 'Logistics', 'EdTech', 'Automotive', 'Software', 'Manufacturing', 'Hospitality'];
      const cities = ['Mumbai', 'Bengaluru', 'Delhi NCR', 'Hyderabad', 'Pune', 'Chennai', 'Kolkata', 'Ahmedabad', 'Dubai', 'Singapore'];
      const sources = ['Website Form', 'WhatsApp Bot', 'LinkedIn Ad', 'Google Search', 'Referral', 'Email Campaign', 'Facebook Lead Ad', 'Organic Search'];

      const leadRawNames = [
        { name: 'Aarav Sharma', company: 'Apex Tech Solutions' },
        { name: 'Ananya Iyer', company: 'Bright Media Works' },
        { name: 'Vikram Malhotra', company: 'CloudNet Systems' },
        { name: 'Sunita Rao', company: 'Delta Corp Infra' },
        { name: 'Rohan Gupta', company: 'Elevate Health Care' },
        { name: 'Kavya Nair', company: 'FinSmart Capital' },
        { name: 'Aditya Verma', company: 'GreenEarth Energy' },
        { name: 'Pooja Joshi', company: 'Horizon Logistics' },
        { name: 'Siddharth Deshmukh', company: 'Impulse Retail Kraft' },
        { name: 'Meera Mukherjee', company: 'Jupiter Digital Labs' },
        { name: 'Amit Bhatia', company: 'Kuber Financials' },
        { name: 'Riya Kapoor', company: 'Luxe Living Real Estate' },
        { name: 'Rahul Agarwal', company: 'Matrix AI Global' },
        { name: 'Divya Kulkarni', company: 'NextGen Motors' },
        { name: 'Arjun Mehta', company: 'OmniSphere Cloud' },
        { name: 'Neha Choudhury', company: 'Paramount EduWorks' },
        { name: 'Vivek Saxena', company: 'Quantum Pharma' },
        { name: 'Ishita Roy', company: 'RedCoral Hospitality' },
        { name: 'Karthik Menon', company: 'Sterling Staffing' },
        { name: 'Shreya Das', company: 'TrueNorth Analytics' },
        { name: 'Tarun Pillai', company: 'UrbanStay Stays' },
        { name: 'Tanvi Bansal', company: 'Vistara Builders' },
        { name: 'Abhinav Rao', company: 'WaveTech Softwares' },
        { name: 'Swati Pandey', company: 'Xenon BioCare' },
        { name: 'Varun Hegde', company: 'YieldMax Agrotech' },
        { name: 'Deepika Malhotra', company: 'Zenith E-Commerce' },
        { name: 'Gaurav Mishra', company: 'Astra BioPharma' },
        { name: 'Roshni Trivedi', company: 'BlueSky Air Logistics' },
        { name: 'Kunal Sen', company: 'CoreKraft Design Studio' },
        { name: 'Anjali Shetty', company: 'Dynamic FinTech' },
        { name: 'Nikhil Jain', company: 'Everest Infra Tech' },
        { name: 'Radhika Thakur', company: 'FutureLeap Learning' },
        { name: 'Suresh Nambiar', company: 'GlobalCare Diagnostics' },
        { name: 'Aarti Mahajan', company: 'HyperDrive Motors' },
        { name: 'Manish Tiwari', company: 'Infinite Byte Labs' },
        { name: 'Bhavna Solanki', company: 'JetSet Travelworks' },
        { name: 'Harish Nanda', company: 'Kinetix Robotics' },
        { name: 'Simran Ahuja', company: 'Lotus Spark Media' },
        { name: 'Alok Srivastava', company: 'MetroMart Retail' },
        { name: 'Pallavi Sundaram', company: 'NexaWave AI Solutions' },
        { name: 'Deepak Gill', company: 'Orion Cloud Security' },
        { name: 'Sonam Wagh', company: 'Peak Performance GYM' },
        { name: 'Chirag Sethi', company: 'QuadTech Systems' },
        { name: 'Monalisa Dutta', company: 'Royal Palms Resort' },
        { name: 'Yashraj Chauhan', company: 'SilkRoute International' },
        { name: 'Preeti Mittal', company: 'Trident Energy Solutions' },
        { name: 'Sandeep Dubhashi', company: 'UltraClean Agrotech' },
        { name: 'Smriti Bhattacharya', company: 'Vanguard CyberSec' },
        { name: 'Harsh Vardhan', company: 'WellSpring Fitness' },
        { name: 'Nandini Sen', company: 'Zephyr Gaming Studios' },
      ];

      const statuses = [
        'New', 'New', 'New', 'New', 'New', 'New', 'New', 'New', 'New', 'New',
        'Contacted', 'Contacted', 'Contacted', 'Contacted', 'Contacted', 'Contacted', 'Contacted', 'Contacted',
        'Qualified', 'Qualified', 'Qualified', 'Qualified', 'Qualified', 'Qualified', 'Qualified', 'Qualified',
        'In Negotiation', 'In Negotiation', 'In Negotiation', 'In Negotiation', 'In Negotiation', 'In Negotiation',
        'Converted', 'Converted', 'Converted', 'Converted', 'Converted', 'Converted', 'Converted', 'Converted', 'Converted', 'Converted', 'Converted', 'Converted', 'Converted', 'Converted', 'Converted', 'Converted', 'Converted', 'Converted',
      ];

      for (let i = 0; i < leadRawNames.length; i++) {
        const item = leadRawNames[i];
        const email = `${item.name.toLowerCase().replace(/\s+/g, '.')}@${item.company.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`;
        const phone = `+91 ${9810000000 + i * 1357}`;
        const serviceInterested = services[i % services.length];
        const industry = industries[i % industries.length];
        const city = cities[i % cities.length];
        const country = i < 42 ? 'India' : (i % 2 === 0 ? 'UAE' : 'Singapore');
        const leadSource = sources[i % sources.length];
        const status = statuses[i % statuses.length];
        const score = Math.floor(65 + (i * 7) % 35);
        const assignedUser = users[i % users.length]._id;

        const pastDays = Math.floor((50 - i) * 1.8);
        const createdAt = new Date(Date.now() - pastDays * 86400000);

        let existingLead = await Lead.findOne({ email });
        if (!existingLead) {
          existingLead = await Lead.create({
            name: item.name,
            email,
            phone,
            company: item.company,
            industry,
            city,
            country,
            leadSource,
            serviceInterested,
            status,
            score,
            assignedUser,
            createdAt,
            updatedAt: createdAt,
          });
        }
        leads.push(existingLead);
      }
    } else {
      leads = await Lead.find();
    }

    // 4. SEED CUSTOMERS (20 Converted Customers)
    console.log('Seeding 20 Converted Customers...');
    const customerCount = await Customer.countDocuments();
    let customers = [];

    if (customerCount < 20) {
      const convertedLeads = leads.filter(l => l.status === 'Converted');
      const packages = ['Enterprise AI Suite', 'Growth CRM Platform', 'Omnichannel WhatsApp Pro', 'Custom Web Application', 'AI Content Engine'];
      const plans = ['Annual Enterprise', 'Bi-Annual Growth', 'Custom SLA Plan', 'Monthly Professional'];

      for (let i = 0; i < Math.min(20, convertedLeads.length); i++) {
        const lead = convertedLeads[i];
        const rev = Math.floor(15000 + (i * 4500) % 80000);
        const joinedDate = new Date(Date.now() - (20 - i) * 5 * 86400000);

        let existingCustomer = await Customer.findOne({ email: lead.email });
        if (!existingCustomer) {
          existingCustomer = await Customer.create({
            name: lead.name,
            email: lead.email,
            phone: lead.phone,
            company: lead.company,
            servicePurchased: lead.serviceInterested,
            package: packages[i % packages.length],
            revenue: rev,
            plan: plans[i % plans.length],
            joinedDate,
            owner: 'Rajesh Sharma',
            convertedFromLead: lead._id,
            createdAt: joinedDate,
            updatedAt: joinedDate,
          });
        }
        customers.push(existingCustomer);
      }
    } else {
      customers = await Customer.find();
    }

    // 5. SEED FOLLOWUPS (40 Followups)
    console.log('Seeding 40 Followups...');
    const followupCount = await Followup.countDocuments();
    if (followupCount < 40) {
      const tasks = [
        'Follow up on custom AI Chatbot pricing proposal',
        'Demonstrate CRM lead scoring and automation workflow',
        'Review WhatsApp API rate limits and SLA agreement',
        'Send revised GST compliant quote & architecture design',
        'Schedule technical alignment meeting with CTO',
        'Quarterly account performance review call',
        'Present AI Content Creation engine demo to marketing team',
        'Finalize contract sign-off and onboard team',
      ];

      const statuses = ['Pending', 'Completed', 'Overdue', 'Upcoming'];
      const priorities = ['High', 'Medium', 'Low'];
      const types = ['Call', 'Email', 'Meeting', 'Demo'];

      for (let i = 0; i < 40; i++) {
        const lead = leads[i % leads.length];
        const task = tasks[i % tasks.length];
        const status = statuses[i % statuses.length];
        const priority = priorities[i % priorities.length];
        const followupType = types[i % types.length];

        let offset = 0;
        if (status === 'Overdue') offset = - (i % 5 + 1);
        else if (status === 'Completed') offset = - (i % 10 + 2);
        else if (i % 4 === 0) offset = 0; // Today
        else offset = (i % 7) + 1; // Future

        const date = new Date(Date.now() + offset * 86400000);

        await Followup.create({
          task,
          clientName: lead.company,
          customerName: lead.name,
          company: lead.company,
          followupType,
          priority,
          remarks: `Key focus: verify ${lead.serviceInterested} requirements and decision timeline.`,
          leadId: lead._id,
          assignedUser: lead.assignedUser || adminUser._id,
          date,
          time: '11:30 AM',
          notes: `Followup scheduled via ${followupType}`,
          status: status === 'Overdue' ? 'Pending' : status,
          createdAt: date,
        });
      }
    }

    // 6. SEED CONVERSATIONS (150 Conversations)
    console.log('Seeding 150 Chatbot Conversations...');
    const convCount = await Conversation.countDocuments();
    if (convCount < 150) {
      const platforms = ['Website', 'WhatsApp', 'Facebook', 'Instagram'];
      const intents = ['Pricing Inquiry', 'Product Demo', 'Support Request', 'Enterprise Plan', 'Integration Question', 'Partnership Inquiry'];
      const convStatuses = ['Resolved', 'Resolved', 'Resolved', 'Escalated', 'Pending', 'Closed'];

      const sampleDialogues = [
        {
          q: 'Hi, what are the pricing plans for AI Chatbot integration?',
          a: 'Hello! Our AI Chatbot plans start at ₹15,000/month with custom LLM training included. Would you like a demo?',
        },
        {
          q: 'Can your CRM connect with WhatsApp Business API?',
          a: 'Yes! We support native 2-way WhatsApp automation and automatic lead syncing directly in AI-Agentix CRM.',
        },
        {
          q: 'Do you offer custom Web Application development with AI features?',
          a: 'Absolutely. We build scalable Full-Stack MERN applications integrated with Gemini 1.5 & OpenAI models.',
        },
        {
          q: 'Can I schedule a call with a Sales Executive for enterprise pricing?',
          a: 'Of course! I have assigned Senior Executive Rajesh Sharma to get in touch with you right away.',
        },
      ];

      for (let i = 0; i < 150; i++) {
        const lead = leads[i % leads.length];
        const platform = platforms[i % platforms.length];
        const intent = intents[i % intents.length];
        const status = convStatuses[i % convStatuses.length];
        const dialogue = sampleDialogues[i % sampleDialogues.length];
        const bot = chatbots[i % chatbots.length];

        const pastDays = Math.floor((150 - i) * 0.2);
        const conversationTime = new Date(Date.now() - pastDays * 86400000);

        await Conversation.create({
          visitorName: lead.name,
          visitorEmail: lead.email,
          company: lead.company,
          platform,
          intent,
          message: dialogue.q,
          question: dialogue.q,
          botResponse: dialogue.a,
          status,
          assignedAgent: 'AI Bot Agent',
          chatbotId: bot._id,
          conversationTime,
          createdAt: conversationTime,
        });
      }
    }

    // 7. SEED ACTIVITIES (100 Timeline Activities)
    console.log('Seeding 100 Timeline Activities...');
    const actCount = await Activity.countDocuments();
    if (actCount < 100) {
      const actions = [
        'Lead Created', 'Lead Updated', 'Customer Converted',
        'Followup Completed', 'Bot Conversation', 'AI Generated Quote', 'Meeting Scheduled'
      ];

      for (let i = 0; i < 100; i++) {
        const lead = leads[i % leads.length];
        const action = actions[i % actions.length];
        const user = users[i % users.length].first_name + ' ' + users[i % users.length].last_name;
        const pastDays = Math.floor((100 - i) * 0.3);
        const timestamp = new Date(Date.now() - pastDays * 86400000);

        await Activity.create({
          leadId: lead._id,
          targetCompany: lead.company,
          action,
          description: `${user} performed action [${action}] for ${lead.name} (${lead.company})`,
          type: action.toLowerCase().replace(/\s+/g, '_'),
          user,
          createdAt: timestamp,
          updatedAt: timestamp,
        });
      }
    }

    // 8. SEED NOTES
    console.log('Seeding Notes attached to Leads...');
    const noteCount = await Note.countDocuments();
    if (noteCount < 30) {
      const noteTexts = [
        'Client expressed strong interest in WhatsApp Automation + CRM integration.',
        'Initial discovery call completed. Requested detailed architectural breakdown.',
        'Budget approved by board for Q3 rollout. Finalizing SLA documentation.',
        'Requested custom AI demo focusing on lead scoring and auto-assignment.',
        'Followed up on proposal. Awaiting legal team review on data privacy compliance.',
      ];

      for (let i = 0; i < 35; i++) {
        const lead = leads[i % leads.length];
        const author = users[i % users.length].first_name + ' ' + users[i % users.length].last_name;

        await Note.create({
          leadId: lead._id,
          note: noteTexts[i % noteTexts.length],
          createdBy: author,
          createdAt: new Date(Date.now() - (35 - i) * 86400000),
        });
      }
    }

    console.log('ENTERPRISE DEMO DATA SEEDED SUCCESSFULLY TO MONGODB!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding demo data:', error);
    process.exit(1);
  }
};

seedDatabase();
