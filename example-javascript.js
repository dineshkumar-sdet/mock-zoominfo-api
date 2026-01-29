/**
 * ZoomInfo Mock API - JavaScript/Node.js Client Example
 * 
 * This example demonstrates how to interact with the ZoomInfo Mock API using JavaScript.
 * 
 * Install axios first: npm install axios
 */

const axios = require('axios');

class ZoomInfoClient {
  /**
   * Initialize the ZoomInfo client
   * @param {string} baseUrl - Base URL of the mock API server
   */
  constructor(baseUrl = 'http://localhost:3000') {
    this.baseUrl = baseUrl;
    this.token = null;
  }

  /**
   * Authenticate and obtain JWT token
   * @param {string} username - ZoomInfo username
   * @param {string} password - ZoomInfo password
   * @returns {Promise<boolean>} True if authentication successful
   */
  async authenticate(username, password) {
    try {
      const response = await axios.post(`${this.baseUrl}/authenticate`, {
        username,
        password
      });

      this.token = response.data.jwt;
      console.log(`✅ Authentication successful! Token expires in ${response.data.expiresIn} seconds`);
      return true;

    } catch (error) {
      console.error('❌ Authentication failed:', error.message);
      return false;
    }
  }

  /**
   * Get headers with authorization token
   * @private
   */
  _getHeaders() {
    if (!this.token) {
      throw new Error('Not authenticated. Call authenticate() first.');
    }
    return {
      Authorization: `Bearer ${this.token}`
    };
  }

  /**
   * Search for companies
   * @param {Object} params - Search parameters
   * @returns {Promise<Object>} Search results with pagination info
   */
  async searchCompanies({
    companyName = null,
    city = null,
    state = null,
    country = null,
    revenueMin = null,
    revenueMax = null,
    employeesMin = null,
    employeesMax = null,
    industry = null,
    technologies = null,
    page = 1,
    pageSize = 10,
    outputFields = null
  } = {}) {
    const payload = { page, pageSize };

    // Add optional parameters
    if (companyName) payload.companyName = companyName;
    if (city) payload.city = city;
    if (state) payload.state = state;
    if (country) payload.country = country;
    if (revenueMin) payload.revenueMin = revenueMin;
    if (revenueMax) payload.revenueMax = revenueMax;
    if (employeesMin) payload.employeesMin = employeesMin;
    if (employeesMax) payload.employeesMax = employeesMax;
    if (industry) payload.industry = industry;
    if (technologies) payload.technologies = technologies;
    if (outputFields) payload.outputFields = outputFields;

    try {
      const response = await axios.post(
        `${this.baseUrl}/search/company`,
        payload,
        { headers: this._getHeaders() }
      );
      return response.data;

    } catch (error) {
      console.error('❌ Search failed:', error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Enrich company data
   * @param {Object} params - Enrichment parameters
   * @returns {Promise<Object>} Enriched company data
   */
  async enrichCompany({
    companyId = null,
    companyName = null,
    website = null,
    outputFields = null
  } = {}) {
    const payload = {};

    if (companyId) {
      payload.companyId = companyId;
    } else if (companyName) {
      payload.companyName = companyName;
    } else if (website) {
      payload.website = website;
    } else {
      throw new Error('Must provide companyId, companyName, or website');
    }

    if (outputFields) payload.outputFields = outputFields;

    try {
      const response = await axios.post(
        `${this.baseUrl}/enrich/company`,
        payload,
        { headers: this._getHeaders() }
      );
      return response.data;

    } catch (error) {
      console.error('❌ Enrichment failed:', error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Submit a bulk search job
   * @param {string} jobName - Name for the job
   * @param {Object} searchCriteria - Search criteria
   * @param {number} maxResults - Maximum results to return
   * @returns {Promise<Object>} Job submission response with job ID
   */
  async submitBulkSearch(jobName, searchCriteria, maxResults = 10000) {
    const payload = {
      jobName,
      searchCriteria,
      maxResults
    };

    try {
      const response = await axios.post(
        `${this.baseUrl}/search/company/bulk`,
        payload,
        { headers: this._getHeaders() }
      );
      return response.data;

    } catch (error) {
      console.error('❌ Bulk search submission failed:', error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get status of a bulk search job
   * @param {string} jobId - Job ID from submitBulkSearch
   * @returns {Promise<Object>} Job status information
   */
  async getBulkJobStatus(jobId) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/search/company/bulk/${jobId}`,
        { headers: this._getHeaders() }
      );
      return response.data;

    } catch (error) {
      console.error('❌ Failed to get job status:', error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get available search fields
   * @returns {Promise<Object>} Available search fields
   */
  async getSearchFields() {
    try {
      const response = await axios.get(
        `${this.baseUrl}/lookup/search/company`,
        { headers: this._getHeaders() }
      );
      return response.data;

    } catch (error) {
      console.error('❌ Failed to get search fields:', error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get available output fields for enrichment
   * @returns {Promise<Object>} Available output fields
   */
  async getEnrichFields() {
    try {
      const response = await axios.get(
        `${this.baseUrl}/lookup/enrich/company`,
        { headers: this._getHeaders() }
      );
      return response.data;

    } catch (error) {
      console.error('❌ Failed to get enrich fields:', error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get current API usage and limits
   * @returns {Promise<Object>} Usage statistics
   */
  async getUsage() {
    try {
      const response = await axios.get(
        `${this.baseUrl}/user/usage`,
        { headers: this._getHeaders() }
      );
      return response.data;

    } catch (error) {
      console.error('❌ Failed to get usage:', error.message);
      return { success: false, error: error.message };
    }
  }
}

/**
 * Example usage of the ZoomInfo client
 */
async function main() {
  console.log('='.repeat(70));
  console.log('ZoomInfo Mock API - JavaScript/Node.js Client Example');
  console.log('='.repeat(70));

  // Initialize client
  const client = new ZoomInfoClient();

  // Authenticate
  console.log('\n🔐 Authenticating...');
  if (!await client.authenticate('test@example.com', 'password123')) {
    return;
  }

  // Example 1: Search by company name
  console.log('\n📊 Example 1: Search by company name');
  console.log('-'.repeat(70));
  let results = await client.searchCompanies({ companyName: 'Microsoft' });
  if (results.success) {
    console.log(`Found ${results.pagination.totalResults} companies`);
    results.data.forEach(company => {
      console.log(`  • ${company.companyName} - ${company.website}`);
    });
  }

  // Example 2: Search with filters
  console.log('\n📊 Example 2: Search with revenue and employee filters');
  console.log('-'.repeat(70));
  results = await client.searchCompanies({
    revenueMin: 1_000_000_000,
    employeesMin: 5000
  });
  if (results.success) {
    console.log(`Found ${results.pagination.totalResults} large companies`);
    results.data.forEach(company => {
      const revenueB = (company.revenue / 1_000_000_000).toFixed(2);
      console.log(`  • ${company.companyName}`);
      console.log(`    Revenue: $${revenueB}B | Employees: ${company.employees.toLocaleString()}`);
    });
  }

  // Example 3: Enrich a company
  console.log('\n📋 Example 3: Enrich company by ID');
  console.log('-'.repeat(70));
  let result = await client.enrichCompany({ companyId: '344589814' });
  if (result.success) {
    const company = result.data;
    console.log(`Company: ${company.companyName}`);
    console.log(`Website: ${company.website}`);
    console.log(`Industry: ${company.primaryIndustry}`);
    console.log(`Revenue: $${company.revenue.toLocaleString()}`);
    console.log(`Employees: ${company.employees.toLocaleString()}`);
    console.log(`Technologies: ${company.technologies.join(', ')}`);
  }

  // Example 4: Partial enrichment
  console.log('\n📋 Example 4: Enrich with specific fields only');
  console.log('-'.repeat(70));
  result = await client.enrichCompany({
    companyName: 'Salesforce Inc',
    outputFields: ['companyName', 'website', 'revenue', 'employees']
  });
  if (result.success) {
    console.log(JSON.stringify(result.data, null, 2));
  }

  // Example 5: Bulk search
  console.log('\n📦 Example 5: Submit bulk search job');
  console.log('-'.repeat(70));
  result = await client.submitBulkSearch(
    'Tech Companies Search',
    {
      industry: 'Software & Technology',
      employeesMin: 1000
    },
    50000
  );
  if (result.success) {
    console.log(`Job submitted: ${result.jobId}`);
    console.log(`Status: ${result.status}`);

    // Check job status
    const status = await client.getBulkJobStatus(result.jobId);
    if (status.success) {
      console.log(`Job status: ${status.status}`);
      console.log(`Total results: ${status.totalResults || 'N/A'}`);
    }
  }

  // Example 6: Get usage
  console.log('\n📈 Example 6: Get API usage statistics');
  console.log('-'.repeat(70));
  result = await client.getUsage();
  if (result.success) {
    const usage = result.usage;
    console.log(`Credits: ${usage.creditsUsed.toLocaleString()} / ${usage.creditsTotal.toLocaleString()}`);
    console.log(`Remaining: ${usage.creditsRemaining.toLocaleString()}`);
    console.log(`Requests this minute: ${usage.requestsThisMinute} / ${usage.requestsPerMinuteLimit}`);
  }

  console.log('\n' + '='.repeat(70));
  console.log('✅ All examples completed successfully!');
  console.log('='.repeat(70));
}

// Run examples
if (require.main === module) {
  main().catch(console.error);
}

// Export for use as a module
module.exports = ZoomInfoClient;
