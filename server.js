const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;
const JWT_SECRET = 'mock-zoominfo-secret-key';

// Middleware
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

// Import mock company and contact databases
const mockCompanies = require('./mock-data');
const mockContacts = require('./mock-contacts');

// Authentication endpoint
app.post('/authenticate', (req, res) => {
  const { username, password, clientId, privateKey } = req.body;

  // Mock authentication - accept any credentials
  if ((username && password) || (username && clientId && privateKey)) {
    const token = jwt.sign(
      { username: username || 'mock-user', exp: Math.floor(Date.now() / 1000) + 3600 },
      JWT_SECRET
    );

    return res.json({
      success: true,
      jwt: token,
      expiresIn: 3600,
      tokenType: 'Bearer'
    });
  }

  return res.status(401).json({
    success: false,
    error: 'Invalid credentials',
    errorCode: 'INVALID_CREDENTIALS'
  });
});

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: 'Missing or invalid authorization header',
      errorCode: 'UNAUTHORIZED'
    });
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      error: 'Invalid or expired token',
      errorCode: 'TOKEN_EXPIRED'
    });
  }
};

// Company Search endpoint
app.post('/search/company', verifyToken, (req, res) => {
  const {
    companyName,
    website,
    phone,
    city,
    state,
    zipCode,
    country,
    revenueMin,
    revenueMax,
    employeesMin,
    employeesMax,
    industry,
    sicCode,
    naicsCode,
    ticker,
    ownership,
    technologies,
    page = 1,
    pageSize = 10,
    sortBy = 'companyName',
    sortOrder = 'asc',
    outputFields = []
  } = req.body;

  // Filter companies based on search criteria
  let filteredCompanies = mockCompanies.filter(company => {
    if (companyName && !company.companyName.toLowerCase().includes(companyName.toLowerCase())) {
      return false;
    }
    if (website && !company.website.toLowerCase().includes(website.toLowerCase())) {
      return false;
    }
    if (phone && company.phone !== phone) {
      return false;
    }
    if (city && company.address.city.toLowerCase() !== city.toLowerCase()) {
      return false;
    }
    if (state && company.address.state.toLowerCase() !== state.toLowerCase()) {
      return false;
    }
    if (zipCode && company.address.zipCode !== zipCode) {
      return false;
    }
    if (country && company.address.country.toLowerCase() !== country.toLowerCase()) {
      return false;
    }
    if (revenueMin && company.revenue < revenueMin) {
      return false;
    }
    if (revenueMax && company.revenue > revenueMax) {
      return false;
    }
    if (employeesMin && company.employees < employeesMin) {
      return false;
    }
    if (employeesMax && company.employees > employeesMax) {
      return false;
    }
    if (industry && !company.primaryIndustry.toLowerCase().includes(industry.toLowerCase())) {
      return false;
    }
    if (sicCode && !company.sicCodes.includes(sicCode)) {
      return false;
    }
    if (naicsCode && !company.naicsCodes.includes(naicsCode)) {
      return false;
    }
    if (ticker && company.ticker !== ticker) {
      return false;
    }
    if (ownership && company.ownership.toLowerCase() !== ownership.toLowerCase()) {
      return false;
    }
    if (technologies && technologies.length > 0) {
      const hasTech = technologies.some(tech => 
        company.technologies.some(ct => ct.toLowerCase().includes(tech.toLowerCase()))
      );
      if (!hasTech) return false;
    }
    return true;
  });

  // Sort results
  filteredCompanies.sort((a, b) => {
    const aVal = a[sortBy];
    const bVal = b[sortBy];
    
    if (sortOrder === 'asc') {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });

  // Paginate results
  const totalResults = filteredCompanies.length;
  const totalPages = Math.ceil(totalResults / pageSize);
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedResults = filteredCompanies.slice(startIndex, endIndex);

  // Filter output fields if specified
  let results = paginatedResults;
  if (outputFields && outputFields.length > 0) {
    results = paginatedResults.map(company => {
      const filteredCompany = { id: company.id };
      outputFields.forEach(field => {
        if (company[field] !== undefined) {
          filteredCompany[field] = company[field];
        }
      });
      return filteredCompany;
    });
  }

  res.json({
    success: true,
    data: results,
    pagination: {
      currentPage: page,
      pageSize: pageSize,
      totalResults: totalResults,
      totalPages: totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1
    },
    query: req.body
  });
});

// Company Enrich endpoint (get full company details by ID)
app.post('/enrich/company', verifyToken, (req, res) => {
  const {
    companyId,
    companyName,
    website,
    outputFields = [],
    includeContacts = false,
    contactFields = [],
    contactsLimit = 10
  } = req.body;

  let company = null;
  let matchType = 'full_match';

  // Find company by ID, name, or website
  if (companyId) {
    company = mockCompanies.find(c => c.id === companyId);
  } else if (companyName) {
    const normalizedName = companyName.toLowerCase();
    company = mockCompanies.find(c => c.companyName.toLowerCase() === normalizedName);
    if (!company) {
      company = mockCompanies.find(c => c.companyName.toLowerCase().includes(normalizedName));
      if (company) {
        matchType = 'partial_match';
      }
    }
  } else if (website) {
    company = mockCompanies.find(c => 
      c.website.toLowerCase() === website.toLowerCase()
    );
  }

  if (!company) {
    return res.status(404).json({
      success: false,
      error: 'Company not found',
      errorCode: 'COMPANY_NOT_FOUND',
      matchType: 'no_match'
    });
  }

  const shouldIncludeContacts = includeContacts || outputFields.includes('contacts');

  const filterContacts = (contacts, fields) => {
    if (!fields || fields.length === 0) return contacts;
    return contacts.map(contact => {
      const filteredContact = { id: contact.id };
      fields.forEach(field => {
        if (contact[field] !== undefined) {
          filteredContact[field] = contact[field];
        }
      });
      return filteredContact;
    });
  };

  // Filter output fields if specified
  let result = company;
  if (outputFields && outputFields.length > 0) {
    result = { id: company.id };
    outputFields.forEach(field => {
      if (company[field] !== undefined) {
        result[field] = company[field];
      }
    });
  }

  if (shouldIncludeContacts) {
    const contacts = mockContacts
      .filter(contact => contact.companyId === company.id)
      .slice(0, Math.max(0, contactsLimit));
    const filteredContacts = filterContacts(contacts, contactFields);
    result = { ...result, contacts: filteredContacts };
  }

  res.json({
    success: true,
    data: result,
    matchType: matchType,
    creditUsed: true
  });
});

// Contact Search endpoint
app.post('/search/contact', verifyToken, (req, res) => {
  const {
    firstName,
    lastName,
    fullName,
    jobTitle,
    department,
    managementLevel,
    email,
    city,
    state,
    country,
    companyId,
    companyName,
    page = 1,
    pageSize = 10,
    sortBy = 'fullName',
    sortOrder = 'asc',
    outputFields = []
  } = req.body;

  let filteredContacts = mockContacts.filter(contact => {
    if (firstName && !contact.firstName.toLowerCase().includes(firstName.toLowerCase())) {
      return false;
    }
    if (lastName && !contact.lastName.toLowerCase().includes(lastName.toLowerCase())) {
      return false;
    }
    if (fullName && !contact.fullName.toLowerCase().includes(fullName.toLowerCase())) {
      return false;
    }
    if (jobTitle && !contact.jobTitle.toLowerCase().includes(jobTitle.toLowerCase())) {
      return false;
    }
    if (department && !contact.department.toLowerCase().includes(department.toLowerCase())) {
      return false;
    }
    if (managementLevel && contact.managementLevel.toLowerCase() !== managementLevel.toLowerCase()) {
      return false;
    }
    if (email && contact.email.toLowerCase() !== email.toLowerCase()) {
      return false;
    }
    if (city && contact.address.city.toLowerCase() !== city.toLowerCase()) {
      return false;
    }
    if (state && contact.address.state.toLowerCase() !== state.toLowerCase()) {
      return false;
    }
    if (country && contact.address.country.toLowerCase() !== country.toLowerCase()) {
      return false;
    }
    if (companyId && contact.companyId !== companyId) {
      return false;
    }
    if (companyName && !contact.companyName.toLowerCase().includes(companyName.toLowerCase())) {
      return false;
    }
    return true;
  });

  // Sort results
  filteredContacts.sort((a, b) => {
    const aVal = a[sortBy];
    const bVal = b[sortBy];
    if (sortOrder === 'asc') {
      return aVal > bVal ? 1 : -1;
    }
    return aVal < bVal ? 1 : -1;
  });

  // Paginate results
  const totalResults = filteredContacts.length;
  const totalPages = Math.ceil(totalResults / pageSize);
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedResults = filteredContacts.slice(startIndex, endIndex);

  // Filter output fields if specified
  let results = paginatedResults;
  if (outputFields && outputFields.length > 0) {
    results = paginatedResults.map(contact => {
      const filteredContact = { id: contact.id };
      outputFields.forEach(field => {
        if (contact[field] !== undefined) {
          filteredContact[field] = contact[field];
        }
      });
      return filteredContact;
    });
  }

  res.json({
    success: true,
    data: results,
    pagination: {
      currentPage: page,
      pageSize: pageSize,
      totalResults: totalResults,
      totalPages: totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1
    },
    query: req.body
  });
});

// Contact Enrich endpoint (get full contact details by ID or email)
app.post('/enrich/contact', verifyToken, (req, res) => {
  const { contactId, email, fullName, companyId, outputFields = [] } = req.body;

  let contact = null;

  if (contactId) {
    contact = mockContacts.find(c => c.id === contactId);
  } else if (email) {
    contact = mockContacts.find(c => c.email.toLowerCase() === email.toLowerCase());
  } else if (fullName && companyId) {
    contact = mockContacts.find(c =>
      c.fullName.toLowerCase() === fullName.toLowerCase() && c.companyId === companyId
    );
  }

  if (!contact) {
    return res.status(404).json({
      success: false,
      error: 'Contact not found',
      errorCode: 'CONTACT_NOT_FOUND',
      matchType: 'no_match'
    });
  }

  let result = contact;
  if (outputFields && outputFields.length > 0) {
    result = { id: contact.id };
    outputFields.forEach(field => {
      if (contact[field] !== undefined) {
        result[field] = contact[field];
      }
    });
  }

  res.json({
    success: true,
    data: result,
    matchType: 'full_match',
    creditUsed: true
  });
});

// Bulk Company Search endpoint
app.post('/search/company/bulk', verifyToken, (req, res) => {
  const { jobName, searchCriteria, maxResults = 10000 } = req.body;

  // Create a mock job ID
  const jobId = `job_${Date.now()}_${Math.random().toString(36).substring(7)}`;

  // In a real implementation, this would be asynchronous
  res.json({
    success: true,
    jobId: jobId,
    jobName: jobName || 'Bulk Company Search',
    status: 'processing',
    submittedAt: new Date().toISOString(),
    estimatedCompletionTime: new Date(Date.now() + 300000).toISOString(),
    maxResults: maxResults,
    message: 'Bulk search job submitted successfully. Use GET /search/company/bulk/{jobId} to check status.'
  });
});

// Get Bulk Job Status
app.get('/search/company/bulk/:jobId', verifyToken, (req, res) => {
  const { jobId } = req.params;

  // Mock job status response
  res.json({
    success: true,
    jobId: jobId,
    status: 'completed',
    submittedAt: new Date(Date.now() - 600000).toISOString(),
    completedAt: new Date().toISOString(),
    totalResults: mockCompanies.length,
    downloadUrl: `https://api.zoominfo.com/download/${jobId}`,
    expiresAt: new Date(Date.now() + 86400000).toISOString()
  });
});

// Lookup available search fields
app.get('/lookup/search/company', verifyToken, (req, res) => {
  res.json({
    success: true,
    searchFields: [
      { field: 'companyName', type: 'string', description: 'Company name' },
      { field: 'website', type: 'string', description: 'Company website' },
      { field: 'phone', type: 'string', description: 'Company phone number' },
      { field: 'city', type: 'string', description: 'City' },
      { field: 'state', type: 'string', description: 'State/Province' },
      { field: 'zipCode', type: 'string', description: 'Zip/Postal code' },
      { field: 'country', type: 'string', description: 'Country' },
      { field: 'revenueMin', type: 'number', description: 'Minimum revenue' },
      { field: 'revenueMax', type: 'number', description: 'Maximum revenue' },
      { field: 'employeesMin', type: 'number', description: 'Minimum employees' },
      { field: 'employeesMax', type: 'number', description: 'Maximum employees' },
      { field: 'industry', type: 'string', description: 'Industry' },
      { field: 'sicCode', type: 'string', description: 'SIC code' },
      { field: 'naicsCode', type: 'string', description: 'NAICS code' },
      { field: 'ticker', type: 'string', description: 'Stock ticker symbol' },
      { field: 'ownership', type: 'string', description: 'Ownership type (Public/Private)' },
      { field: 'technologies', type: 'array', description: 'Technologies used' }
    ]
  });
});

// Lookup available contact search fields
app.get('/lookup/search/contact', verifyToken, (req, res) => {
  res.json({
    success: true,
    searchFields: [
      { field: 'firstName', type: 'string', description: 'First name' },
      { field: 'lastName', type: 'string', description: 'Last name' },
      { field: 'fullName', type: 'string', description: 'Full name' },
      { field: 'jobTitle', type: 'string', description: 'Job title' },
      { field: 'department', type: 'string', description: 'Department' },
      { field: 'managementLevel', type: 'string', description: 'Management level' },
      { field: 'email', type: 'string', description: 'Work email' },
      { field: 'city', type: 'string', description: 'City' },
      { field: 'state', type: 'string', description: 'State/Province' },
      { field: 'country', type: 'string', description: 'Country' },
      { field: 'companyId', type: 'string', description: 'Company ID' },
      { field: 'companyName', type: 'string', description: 'Company name' }
    ]
  });
});

// Lookup available output fields
app.get('/lookup/enrich/company', verifyToken, (req, res) => {
  res.json({
    success: true,
    outputFields: [
      { field: 'id', type: 'string', description: 'Unique company identifier' },
      { field: 'companyName', type: 'string', description: 'Company name' },
      { field: 'website', type: 'string', description: 'Company website' },
      { field: 'phone', type: 'string', description: 'Company phone number' },
      { field: 'fax', type: 'string', description: 'Company fax number' },
      { field: 'email', type: 'string', description: 'Company email' },
      { field: 'ticker', type: 'string', description: 'Stock ticker symbol' },
      { field: 'revenue', type: 'number', description: 'Annual revenue' },
      { field: 'revenueRange', type: 'string', description: 'Revenue range' },
      { field: 'employees', type: 'number', description: 'Number of employees' },
      { field: 'employeesRange', type: 'string', description: 'Employee count range' },
      { field: 'sicCodes', type: 'array', description: 'SIC codes' },
      { field: 'naicsCodes', type: 'array', description: 'NAICS codes' },
      { field: 'primaryIndustry', type: 'string', description: 'Primary industry' },
      { field: 'subIndustries', type: 'array', description: 'Sub-industries' },
      { field: 'address', type: 'object', description: 'Company address' },
      { field: 'founded', type: 'number', description: 'Year founded' },
      { field: 'description', type: 'string', description: 'Company description' },
      { field: 'companyType', type: 'string', description: 'Company type' },
      { field: 'ownership', type: 'string', description: 'Ownership type' },
      { field: 'stockExchange', type: 'string', description: 'Stock exchange' },
      { field: 'logoUrl', type: 'string', description: 'Logo URL' },
      { field: 'linkedInUrl', type: 'string', description: 'LinkedIn URL' },
      { field: 'facebookUrl', type: 'string', description: 'Facebook URL' },
      { field: 'twitterUrl', type: 'string', description: 'Twitter URL' },
      { field: 'technologies', type: 'array', description: 'Technologies used' },
      { field: 'lastUpdated', type: 'string', description: 'Last updated date' },
      { field: 'validDate', type: 'string', description: 'Valid date' },
      { field: 'contacts', type: 'array', description: 'Associated contacts' }
    ]
  });
});

// Lookup available output fields for contacts
app.get('/lookup/enrich/contact', verifyToken, (req, res) => {
  res.json({
    success: true,
    outputFields: [
      { field: 'id', type: 'string', description: 'Unique contact identifier' },
      { field: 'firstName', type: 'string', description: 'First name' },
      { field: 'lastName', type: 'string', description: 'Last name' },
      { field: 'fullName', type: 'string', description: 'Full name' },
      { field: 'jobTitle', type: 'string', description: 'Job title' },
      { field: 'jobFunction', type: 'string', description: 'Job function' },
      { field: 'department', type: 'string', description: 'Department' },
      { field: 'managementLevel', type: 'string', description: 'Management level' },
      { field: 'email', type: 'string', description: 'Work email' },
      { field: 'emailStatus', type: 'string', description: 'Email status' },
      { field: 'directPhone', type: 'string', description: 'Direct phone' },
      { field: 'mobilePhone', type: 'string', description: 'Mobile phone' },
      { field: 'officePhone', type: 'string', description: 'Office phone' },
      { field: 'linkedInUrl', type: 'string', description: 'LinkedIn profile URL' },
      { field: 'address', type: 'object', description: 'Contact location' },
      { field: 'companyId', type: 'string', description: 'Company ID' },
      { field: 'companyName', type: 'string', description: 'Company name' },
      { field: 'companyWebsite', type: 'string', description: 'Company website' },
      { field: 'companyPhone', type: 'string', description: 'Company phone' },
      { field: 'lastUpdated', type: 'string', description: 'Last updated date' },
      { field: 'validDate', type: 'string', description: 'Valid date' }
    ]
  });
});

// Usage endpoint
app.get('/user/usage', verifyToken, (req, res) => {
  res.json({
    success: true,
    usage: {
      creditsUsed: 1250,
      creditsRemaining: 8750,
      creditsTotal: 10000,
      requestsThisMinute: 15,
      requestsPerMinuteLimit: 1500,
      currentPeriodStart: '2025-01-01T00:00:00Z',
      currentPeriodEnd: '2025-01-31T23:59:59Z',
      recordsEnriched: 450,
      recordsEnrichedLimit: 25000
    }
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    errorCode: 'INTERNAL_ERROR',
    message: err.message
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    errorCode: 'NOT_FOUND'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`ZoomInfo Mock API Server running on http://localhost:${PORT}`);
  console.log('\nAvailable endpoints:');
  console.log('POST   /authenticate');
  console.log('POST   /search/company');
  console.log('POST   /search/contact');
  console.log('POST   /enrich/company');
  console.log('POST   /enrich/contact');
  console.log('POST   /search/company/bulk');
  console.log('GET    /search/company/bulk/:jobId');
  console.log('GET    /lookup/search/company');
  console.log('GET    /lookup/search/contact');
  console.log('GET    /lookup/enrich/company');
  console.log('GET    /lookup/enrich/contact');
  console.log('GET    /user/usage');
});