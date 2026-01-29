const http = require('http');

// Helper function to make HTTP requests
function makeRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch (e) {
          resolve(body);
        }
      });
    });

    req.on('error', reject);
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

async function testZoomInfoMockAPI() {
  console.log('='.repeat(70));
  console.log('ZoomInfo Mock API - Test Suite');
  console.log('='.repeat(70));

  let authToken = '';

  // Test 1: Authentication
  console.log('\n📌 Test 1: Authentication');
  console.log('-'.repeat(70));
  try {
    const authResponse = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/authenticate',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }, {
      username: 'test@example.com',
      password: 'password123'
    });

    console.log('✅ Authentication successful');
    console.log(`Token: ${authResponse.jwt.substring(0, 30)}...`);
    console.log(`Expires in: ${authResponse.expiresIn} seconds`);
    authToken = authResponse.jwt;
  } catch (error) {
    console.error('❌ Authentication failed:', error.message);
    return;
  }

  // Test 2: Search companies by name
  console.log('\n📌 Test 2: Search Companies by Name');
  console.log('-'.repeat(70));
  try {
    const searchResponse = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/search/company',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      }
    }, {
      companyName: 'salesforce',
      page: 1,
      pageSize: 10
    });

    console.log('✅ Search successful');
    console.log(`Total results: ${searchResponse.pagination.totalResults}`);
    console.log(`Companies found:`);
    searchResponse.data.forEach((company, index) => {
      console.log(`  ${index + 1}. ${company.companyName} - ${company.website}`);
    });
  } catch (error) {
    console.error('❌ Search failed:', error.message);
  }

  // Test 3: Search with filters
  console.log('\n📌 Test 3: Search with Revenue and Employee Filters');
  console.log('-'.repeat(70));
  try {
    const filterSearchResponse = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/search/company',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      }
    }, {
      revenueMin: 1000000000,
      employeesMin: 5000,
      page: 1,
      pageSize: 10
    });

    console.log('✅ Filtered search successful');
    console.log(`Total results: ${filterSearchResponse.pagination.totalResults}`);
    console.log(`Companies with revenue > $1B and employees > 5000:`);
    filterSearchResponse.data.forEach((company, index) => {
      console.log(`  ${index + 1}. ${company.companyName}`);
      console.log(`     Revenue: $${(company.revenue / 1000000000).toFixed(2)}B`);
      console.log(`     Employees: ${company.employees.toLocaleString()}`);
    });
  } catch (error) {
    console.error('❌ Filtered search failed:', error.message);
  }

  // Test 4: Search by location
  console.log('\n📌 Test 4: Search by Location');
  console.log('-'.repeat(70));
  try {
    const locationSearchResponse = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/search/company',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      }
    }, {
      state: 'WA',
      country: 'United States',
      page: 1,
      pageSize: 10
    });

    console.log('✅ Location search successful');
    console.log(`Total results: ${locationSearchResponse.pagination.totalResults}`);
    console.log(`Companies in Washington State:`);
    locationSearchResponse.data.forEach((company, index) => {
      console.log(`  ${index + 1}. ${company.companyName} - ${company.address.city}, ${company.address.state}`);
    });
  } catch (error) {
    console.error('❌ Location search failed:', error.message);
  }

  // Test 5: Enrich company by ID
  console.log('\n📌 Test 5: Enrich Company by ID');
  console.log('-'.repeat(70));
  try {
    const enrichResponse = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/enrich/company',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      }
    }, {
      companyId: '344589814'
    });

    console.log('✅ Enrichment successful');
    const company = enrichResponse.data;
    console.log(`\nCompany Details:`);
    console.log(`  Name: ${company.companyName}`);
    console.log(`  Website: ${company.website}`);
    console.log(`  Phone: ${company.phone}`);
    console.log(`  Email: ${company.email}`);
    console.log(`  Industry: ${company.primaryIndustry}`);
    console.log(`  Revenue: $${(company.revenue / 1000000000).toFixed(2)}B`);
    console.log(`  Employees: ${company.employees.toLocaleString()}`);
    console.log(`  Founded: ${company.founded}`);
    console.log(`  Address: ${company.address.street}, ${company.address.city}, ${company.address.state} ${company.address.zipCode}`);
    console.log(`  Technologies: ${company.technologies.join(', ')}`);
  } catch (error) {
    console.error('❌ Enrichment failed:', error.message);
  }

  // Test 6: Enrich with specific output fields
  console.log('\n📌 Test 6: Enrich with Specific Output Fields');
  console.log('-'.repeat(70));
  try {
    const partialEnrichResponse = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/enrich/company',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      }
    }, {
      companyName: 'Microsoft Corporation',
      outputFields: ['companyName', 'website', 'revenue', 'employees', 'technologies']
    });

    console.log('✅ Partial enrichment successful');
    console.log(`Requested fields only:`);
    console.log(JSON.stringify(partialEnrichResponse.data, null, 2));
  } catch (error) {
    console.error('❌ Partial enrichment failed:', error.message);
  }

  // Test 7: Bulk search
  console.log('\n📌 Test 7: Bulk Company Search');
  console.log('-'.repeat(70));
  try {
    const bulkSearchResponse = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/search/company/bulk',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      }
    }, {
      jobName: 'Software Companies Search',
      searchCriteria: {
        industry: 'Software & Technology',
        employeesMin: 1000
      },
      maxResults: 50000
    });

    console.log('✅ Bulk search job submitted');
    console.log(`Job ID: ${bulkSearchResponse.jobId}`);
    console.log(`Status: ${bulkSearchResponse.status}`);
    console.log(`Estimated completion: ${bulkSearchResponse.estimatedCompletionTime}`);

    // Get job status
    const jobStatus = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: `/search/company/bulk/${bulkSearchResponse.jobId}`,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });

    console.log('\n✅ Bulk job status retrieved');
    console.log(`Status: ${jobStatus.status}`);
    console.log(`Total results: ${jobStatus.totalResults}`);
    console.log(`Download URL: ${jobStatus.downloadUrl}`);
  } catch (error) {
    console.error('❌ Bulk search failed:', error.message);
  }

  // Test 8: Lookup search fields
  console.log('\n📌 Test 8: Lookup Available Search Fields');
  console.log('-'.repeat(70));
  try {
    const searchFieldsResponse = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/lookup/search/company',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });

    console.log('✅ Search fields lookup successful');
    console.log(`Available search fields (${searchFieldsResponse.searchFields.length}):`);
    searchFieldsResponse.searchFields.slice(0, 5).forEach(field => {
      console.log(`  - ${field.field} (${field.type}): ${field.description}`);
    });
    console.log(`  ... and ${searchFieldsResponse.searchFields.length - 5} more`);
  } catch (error) {
    console.error('❌ Search fields lookup failed:', error.message);
  }

  // Test 9: Lookup enrich fields
  console.log('\n📌 Test 9: Lookup Available Enrich Fields');
  console.log('-'.repeat(70));
  try {
    const enrichFieldsResponse = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/lookup/enrich/company',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });

    console.log('✅ Enrich fields lookup successful');
    console.log(`Available output fields (${enrichFieldsResponse.outputFields.length}):`);
    enrichFieldsResponse.outputFields.slice(0, 5).forEach(field => {
      console.log(`  - ${field.field} (${field.type}): ${field.description}`);
    });
    console.log(`  ... and ${enrichFieldsResponse.outputFields.length - 5} more`);
  } catch (error) {
    console.error('❌ Enrich fields lookup failed:', error.message);
  }

  // Test 10: Usage statistics
  console.log('\n📌 Test 10: Get Usage Statistics');
  console.log('-'.repeat(70));
  try {
    const usageResponse = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/user/usage',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });

    console.log('✅ Usage statistics retrieved');
    console.log(`Credits:`);
    console.log(`  Used: ${usageResponse.usage.creditsUsed.toLocaleString()}`);
    console.log(`  Remaining: ${usageResponse.usage.creditsRemaining.toLocaleString()}`);
    console.log(`  Total: ${usageResponse.usage.creditsTotal.toLocaleString()}`);
    console.log(`\nRate Limits:`);
    console.log(`  Requests this minute: ${usageResponse.usage.requestsThisMinute}`);
    console.log(`  Limit: ${usageResponse.usage.requestsPerMinuteLimit}`);
    console.log(`\nRecords Enriched: ${usageResponse.usage.recordsEnriched} / ${usageResponse.usage.recordsEnrichedLimit}`);
  } catch (error) {
    console.error('❌ Usage statistics failed:', error.message);
  }

  console.log('\n' + '='.repeat(70));
  console.log('All tests completed!');
  console.log('='.repeat(70));
}

// Run tests
testZoomInfoMockAPI().catch(console.error);
