/**
 * Mock Company Data for ZoomInfo API
 * 
 * This file contains mock company records that simulate real ZoomInfo data.
 * Add your own companies here following the same structure.
 */

const mockCompanies = [
    // ========================================
    // BURGER KING
    // ========================================
    {
      id: '100111222',
      companyName: 'Burger King Corporation',
      website: 'www.burgerking.com',
      phone: '+1 (305) 378-3535',
      fax: '+1 (305) 378-3001',
      email: 'info@burgerking.com',
      ticker: null,  // Owned by Restaurant Brands International (QSR)
      revenue: 1800000000,  // $1.8 billion
      revenueRange: '$1B - $5B',
      employees: 34000,
      employeesRange: '10,001+',
      sicCodes: ['5812'],  // Eating Places
      naicsCodes: ['722513'],  // Limited-Service Restaurants
      primaryIndustry: 'Food & Beverage',
      subIndustries: ['Fast Food', 'Quick Service Restaurants', 'Franchising'],
      address: {
        street: '5707 Blue Lagoon Drive',
        city: 'Miami',
        state: 'FL',
        zipCode: '33126',
        country: 'United States'
      },
      founded: 1954,
      description: 'Burger King Corporation is one of the world\'s largest fast food hamburger restaurant chains. The company operates through a franchise model with thousands of locations worldwide, serving flame-grilled burgers, chicken, salads, and breakfast items.',
      companyType: 'Private Company',
      ownership: 'Private',  // Subsidiary of Restaurant Brands International
      stockExchange: null,
      logoUrl: 'https://example.com/logos/burgerking.png',
      linkedInUrl: 'https://www.linkedin.com/company/burger-king',
      facebookUrl: 'https://www.facebook.com/burgerking',
      twitterUrl: 'https://twitter.com/BurgerKing',
      technologies: ['Oracle', 'SAP', 'Salesforce', 'Microsoft Azure'],
      lastUpdated: '2025-01-29T10:00:00Z',
      validDate: '2025-01-29'
    },
  
    // ========================================
    // WALMART
    // ========================================
    {
      id: '200222333',
      companyName: 'Walmart Inc',
      website: 'www.walmart.com',
      phone: '+1 (479) 273-4000',
      fax: '+1 (479) 277-1830',
      email: 'corporate.communications@walmart.com',
      ticker: 'WMT',
      revenue: 611000000000,  // $611 billion
      revenueRange: '$10B+',
      employees: 2100000,  // 2.1 million employees
      employeesRange: '10,001+',
      sicCodes: ['5311', '5331', '5411'],  // Department Stores, Variety Stores, Grocery Stores
      naicsCodes: ['452311', '445110'],  // Warehouse Clubs and Supercenters, Supermarkets
      primaryIndustry: 'Retail',
      subIndustries: ['Discount Stores', 'Supermarkets', 'E-commerce', 'Grocery'],
      address: {
        street: '702 Southwest 8th Street',
        city: 'Bentonville',
        state: 'AR',
        zipCode: '72716',
        country: 'United States'
      },
      founded: 1962,
      description: 'Walmart Inc is a multinational retail corporation that operates a chain of hypermarkets, discount department stores, and grocery stores. It is the world\'s largest company by revenue and the largest private employer globally. Walmart serves millions of customers through physical stores and e-commerce platforms.',
      companyType: 'Public Company',
      ownership: 'Public',
      stockExchange: 'NYSE',
      logoUrl: 'https://example.com/logos/walmart.png',
      linkedInUrl: 'https://www.linkedin.com/company/walmart',
      facebookUrl: 'https://www.facebook.com/walmart',
      twitterUrl: 'https://twitter.com/Walmart',
      technologies: ['Azure', 'Google Cloud', 'Hadoop', 'Spark', 'Kafka', 'Node.js', 'React'],
      lastUpdated: '2025-01-29T10:00:00Z',
      validDate: '2025-01-29'
    },
  
    // ========================================
    // COMPANY A (Generic Company)
    // ========================================
    {
      id: '300333444',
      companyName: 'Company A',
      website: 'www.companya.com',
      phone: '+1 (555) 100-2000',
      fax: '+1 (555) 100-2001',
      email: 'contact@companya.com',
      ticker: 'CMPA',
      revenue: 250000000,  // $250 million
      revenueRange: '$100M - $500M',
      employees: 850,
      employeesRange: '501 - 1,000',
      sicCodes: ['7372', '7373'],  // Software, Computer Integrated Systems Design
      naicsCodes: ['511210', '541512'],  // Software Publishers, Computer Systems Design Services
      primaryIndustry: 'Technology',
      subIndustries: ['Software Development', 'Cloud Services', 'SaaS'],
      address: {
        street: '1000 Innovation Way',
        city: 'San Jose',
        state: 'CA',
        zipCode: '95110',
        country: 'United States'
      },
      founded: 2010,
      description: 'Company A is a mid-sized technology company specializing in enterprise software solutions and cloud services. The company provides innovative SaaS products that help businesses streamline operations, improve productivity, and drive digital transformation across various industries.',
      companyType: 'Public Company',
      ownership: 'Public',
      stockExchange: 'NASDAQ',
      logoUrl: 'https://example.com/logos/companya.png',
      linkedInUrl: 'https://www.linkedin.com/company/companya',
      facebookUrl: 'https://www.facebook.com/companya',
      twitterUrl: 'https://twitter.com/CompanyA',
      technologies: ['AWS', 'React', 'Node.js', 'Python', 'PostgreSQL', 'Docker', 'Kubernetes'],
      lastUpdated: '2025-01-29T10:00:00Z',
      validDate: '2025-01-29'
    },
  
    // ========================================
    // ORIGINAL MOCK COMPANIES (from the base API)
    // ========================================
    {
      id: '344589814',
      companyName: 'ZoomInfo Technologies LLC',
      website: 'www.zoominfo.com',
      phone: '+1 (800) 914-1220',
      fax: null,
      email: 'info@zoominfo.com',
      ticker: 'ZI',
      revenue: 1200000000,
      revenueRange: '$1B - $5B',
      employees: 3500,
      employeesRange: '1,001 - 5,000',
      sicCodes: ['7372', '7374'],
      naicsCodes: ['511210', '518210'],
      primaryIndustry: 'Software & Technology',
      subIndustries: ['Computer Software', 'Data Processing Services'],
      address: {
        street: '805 Broadway Street',
        city: 'Vancouver',
        state: 'WA',
        zipCode: '98660',
        country: 'United States'
      },
      founded: 2000,
      description: 'ZoomInfo is a leading B2B data and software company that provides a comprehensive platform for sales and marketing professionals.',
      companyType: 'Public Company',
      ownership: 'Public',
      stockExchange: 'NASDAQ',
      logoUrl: 'https://example.com/logos/zoominfo.png',
      linkedInUrl: 'https://www.linkedin.com/company/zoominfo',
      facebookUrl: 'https://www.facebook.com/zoominfo',
      twitterUrl: 'https://twitter.com/zoominfo',
      technologies: ['Salesforce', 'AWS', 'React', 'Node.js'],
      lastUpdated: '2025-01-15T10:30:00Z',
      validDate: '2025-01-15'
    },
    {
      id: '100234567',
      companyName: 'Salesforce Inc',
      website: 'www.salesforce.com',
      phone: '+1 (415) 901-7000',
      fax: null,
      email: 'info@salesforce.com',
      ticker: 'CRM',
      revenue: 31000000000,
      revenueRange: '$10B+',
      employees: 73000,
      employeesRange: '10,001+',
      sicCodes: ['7372'],
      naicsCodes: ['511210'],
      primaryIndustry: 'Software & Technology',
      subIndustries: ['Computer Software', 'Cloud Computing'],
      address: {
        street: 'Salesforce Tower, 415 Mission Street',
        city: 'San Francisco',
        state: 'CA',
        zipCode: '94105',
        country: 'United States'
      },
      founded: 1999,
      description: 'Salesforce is a cloud-based software company that provides customer relationship management (CRM) service and enterprise applications.',
      companyType: 'Public Company',
      ownership: 'Public',
      stockExchange: 'NYSE',
      logoUrl: 'https://example.com/logos/salesforce.png',
      linkedInUrl: 'https://www.linkedin.com/company/salesforce',
      facebookUrl: 'https://www.facebook.com/salesforce',
      twitterUrl: 'https://twitter.com/salesforce',
      technologies: ['Heroku', 'AWS', 'Tableau'],
      lastUpdated: '2025-01-20T14:22:00Z',
      validDate: '2025-01-20'
    },
    {
      id: '200345678',
      companyName: 'Microsoft Corporation',
      website: 'www.microsoft.com',
      phone: '+1 (425) 882-8080',
      fax: null,
      email: 'msinfo@microsoft.com',
      ticker: 'MSFT',
      revenue: 211000000000,
      revenueRange: '$10B+',
      employees: 221000,
      employeesRange: '10,001+',
      sicCodes: ['7372', '3571'],
      naicsCodes: ['511210', '334111'],
      primaryIndustry: 'Software & Technology',
      subIndustries: ['Computer Software', 'Cloud Computing', 'Hardware'],
      address: {
        street: 'One Microsoft Way',
        city: 'Redmond',
        state: 'WA',
        zipCode: '98052',
        country: 'United States'
      },
      founded: 1975,
      description: 'Microsoft is a multinational technology corporation that develops, manufactures, licenses, supports, and sells computer software, consumer electronics, and personal computers.',
      companyType: 'Public Company',
      ownership: 'Public',
      stockExchange: 'NASDAQ',
      logoUrl: 'https://example.com/logos/microsoft.png',
      linkedInUrl: 'https://www.linkedin.com/company/microsoft',
      facebookUrl: 'https://www.facebook.com/Microsoft',
      twitterUrl: 'https://twitter.com/Microsoft',
      technologies: ['Azure', '.NET', 'TypeScript'],
      lastUpdated: '2025-01-18T09:15:00Z',
      validDate: '2025-01-18'
    },
    {
      id: '300456789',
      companyName: 'HubSpot Inc',
      website: 'www.hubspot.com',
      phone: '+1 (888) 482-7768',
      fax: null,
      email: 'info@hubspot.com',
      ticker: 'HUBS',
      revenue: 1800000000,
      revenueRange: '$1B - $5B',
      employees: 7000,
      employeesRange: '5,001 - 10,000',
      sicCodes: ['7372'],
      naicsCodes: ['511210'],
      primaryIndustry: 'Software & Technology',
      subIndustries: ['Marketing Software', 'CRM'],
      address: {
        street: '25 First Street',
        city: 'Cambridge',
        state: 'MA',
        zipCode: '02141',
        country: 'United States'
      },
      founded: 2006,
      description: 'HubSpot is a developer and marketer of software products for inbound marketing, sales, and customer service.',
      companyType: 'Public Company',
      ownership: 'Public',
      stockExchange: 'NYSE',
      logoUrl: 'https://example.com/logos/hubspot.png',
      linkedInUrl: 'https://www.linkedin.com/company/hubspot',
      facebookUrl: 'https://www.facebook.com/hubspot',
      twitterUrl: 'https://twitter.com/HubSpot',
      technologies: ['React', 'AWS', 'MySQL'],
      lastUpdated: '2025-01-22T11:45:00Z',
      validDate: '2025-01-22'
    },
    {
      id: '400567890',
      companyName: 'Acme Corporation',
      website: 'www.acmecorp.com',
      phone: '+1 (555) 123-4567',
      fax: '+1 (555) 123-4568',
      email: 'contact@acmecorp.com',
      ticker: null,
      revenue: 50000000,
      revenueRange: '$10M - $50M',
      employees: 250,
      employeesRange: '201 - 500',
      sicCodes: ['5065'],
      naicsCodes: ['423430'],
      primaryIndustry: 'Manufacturing',
      subIndustries: ['Electronics Manufacturing'],
      address: {
        street: '123 Main Street',
        city: 'Austin',
        state: 'TX',
        zipCode: '78701',
        country: 'United States'
      },
      founded: 1995,
      description: 'Acme Corporation is a mid-sized electronics manufacturer specializing in consumer electronics and components.',
      companyType: 'Private Company',
      ownership: 'Private',
      stockExchange: null,
      logoUrl: 'https://example.com/logos/acme.png',
      linkedInUrl: 'https://www.linkedin.com/company/acme-corp',
      facebookUrl: null,
      twitterUrl: null,
      technologies: ['SAP', 'Oracle'],
      lastUpdated: '2025-01-10T16:30:00Z',
      validDate: '2025-01-10'
    }
  ];
  
  module.exports = mockCompanies;