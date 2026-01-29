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

// Import mock company database from external file
const mockCompanies = require('./mock-data');

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
  const { companyId, companyName, website, outputFields = [] } = req.body;

  let company = null;

  // Find company by ID, name, or website
  if (companyId) {
    company = mockCompanies.find(c => c.id === companyId);
  } else if (companyName) {
    company = mockCompanies.find(c => 
      c.companyName.toLowerCase() === companyName.toLowerCase()
    );
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
  console.log('POST   /enrich/company');
  console.log('POST   /search/company/bulk');
  console.log('GET    /search/company/bulk/:jobId');
  console.log('GET    /lookup/search/company');
  console.log('GET    /lookup/enrich/company');
  console.log('GET    /user/usage');
});