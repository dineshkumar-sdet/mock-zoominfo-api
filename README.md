# Testing Guide: Burger King, Walmart, and Company A

This guide shows you how to search for and retrieve data for the newly added companies.

## Quick Start

1. **Start the server:**
   ```bash
   npm start
   ```

2. **Authenticate and save your token:**
   ```bash
   curl -X POST http://localhost:3000/authenticate \
     -H "Content-Type: application/json" \
     -d '{"username":"test@example.com","password":"password123"}'
   ```
   
   Save the JWT token from the response!

---

## Testing Burger King

### Search by Name
```bash
curl -X POST http://localhost:3000/search/company \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "companyName": "Burger King"
  }'
```

### Search by Industry (Food & Beverage)
```bash
curl -X POST http://localhost:3000/search/company \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "industry": "Food & Beverage"
  }'
```

### Search by Location (Miami, FL)
```bash
curl -X POST http://localhost:3000/search/company \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "city": "Miami",
    "state": "FL"
  }'
```

### Enrich Burger King by ID
```bash
curl -X POST http://localhost:3000/enrich/company \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "companyId": "100111222"
  }'
```

---

## Testing Walmart

### Search by Name
```bash
curl -X POST http://localhost:3000/search/company \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "companyName": "Walmart"
  }'
```

### Search by Revenue (Over $500 Billion)
```bash
curl -X POST http://localhost:3000/search/company \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "revenueMin": 500000000000
  }'
```

### Search by Employee Count (Over 1 Million)
```bash
curl -X POST http://localhost:3000/search/company \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "employeesMin": 1000000
  }'
```

### Search by Stock Ticker
```bash
curl -X POST http://localhost:3000/search/company \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "ticker": "WMT"
  }'
```

### Enrich Walmart by Website
```bash
curl -X POST http://localhost:3000/enrich/company \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "website": "www.walmart.com"
  }'
```

---

## Testing Company A

### Search by Name
```bash
curl -X POST http://localhost:3000/search/company \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "companyName": "Company A"
  }'
```

### Search by Technology Stack
```bash
curl -X POST http://localhost:3000/search/company \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "technologies": ["AWS", "React"]
  }'
```

### Search by Location (San Jose, CA)
```bash
curl -X POST http://localhost:3000/search/company \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "city": "San Jose",
    "state": "CA"
  }'
```

### Search Mid-Size Tech Companies
```bash
curl -X POST http://localhost:3000/search/company \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "industry": "Technology",
    "employeesMin": 500,
    "employeesMax": 1000
  }'
```

---

## Python Examples

```python
import requests

# Authenticate
auth_response = requests.post('http://localhost:3000/authenticate', json={
    'username': 'test@example.com',
    'password': 'password123'
})
token = auth_response.json()['jwt']
headers = {'Authorization': f'Bearer {token}'}

# Search for Burger King
burger_king = requests.post(
    'http://localhost:3000/search/company',
    json={'companyName': 'Burger King'},
    headers=headers
).json()

print(f"Found: {burger_king['data'][0]['companyName']}")
print(f"Location: {burger_king['data'][0]['address']['city']}, {burger_king['data'][0]['address']['state']}")
print(f"Employees: {burger_king['data'][0]['employees']:,}")

# Search for Walmart
walmart = requests.post(
    'http://localhost:3000/search/company',
    json={'ticker': 'WMT'},
    headers=headers
).json()

print(f"\nFound: {walmart['data'][0]['companyName']}")
print(f"Revenue: ${walmart['data'][0]['revenue']:,}")
print(f"Employees: {walmart['data'][0]['employees']:,}")

# Search for Company A by technology
tech_companies = requests.post(
    'http://localhost:3000/search/company',
    json={'technologies': ['AWS', 'React']},
    headers=headers
).json()

print(f"\nCompanies using AWS and React:")
for company in tech_companies['data']:
    print(f"  - {company['companyName']}")
```

---

## JavaScript/Node.js Examples

```javascript
const axios = require('axios');

async function testNewCompanies() {
  // Authenticate
  const authResponse = await axios.post('http://localhost:3000/authenticate', {
    username: 'test@example.com',
    password: 'password123'
  });
  
  const token = authResponse.data.jwt;
  const headers = { Authorization: `Bearer ${token}` };

  // Search for Burger King
  const burgerKing = await axios.post(
    'http://localhost:3000/search/company',
    { companyName: 'Burger King' },
    { headers }
  );
  
  console.log('Burger King:', burgerKing.data.data[0].companyName);
  console.log('Industry:', burgerKing.data.data[0].primaryIndustry);

  // Search for Walmart
  const walmart = await axios.post(
    'http://localhost:3000/search/company',
    { ticker: 'WMT' },
    { headers }
  );
  
  console.log('\nWalmart Revenue:', `$${walmart.data.data[0].revenue.toLocaleString()}`);

  // Search for Company A
  const companyA = await axios.post(
    'http://localhost:3000/search/company',
    { companyName: 'Company A' },
    { headers }
  );
  
  console.log('\nCompany A Founded:', companyA.data.data[0].founded);
  console.log('Technologies:', companyA.data.data[0].technologies.join(', '));
}

testNewCompanies();
```

---

## Combined Search Examples

### All Retail Companies
```bash
curl -X POST http://localhost:3000/search/company \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "industry": "Retail"
  }'
```

### All Florida Companies
```bash
curl -X POST http://localhost:3000/search/company \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "state": "FL"
  }'
```

### All Public Companies
```bash
curl -X POST http://localhost:3000/search/company \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "ownership": "Public"
  }'
```

### Companies with Over $1B Revenue
```bash
curl -X POST http://localhost:3000/search/company \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "revenueMin": 1000000000
  }'
```

---

## Company IDs Reference

For direct enrichment using company IDs:

- **Burger King**: `100111222`
- **Walmart**: `200222333`
- **Company A**: `300333444`

Example enrichment:
```bash
curl -X POST http://localhost:3000/enrich/company \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"companyId": "200222333"}'
```

---

## Expected Response Format

All searches return:
```json
{
  "success": true,
  "data": [
    {
      "id": "100111222",
      "companyName": "Burger King Corporation",
      "website": "www.burgerking.com",
      "revenue": 1800000000,
      "employees": 34000,
      "industry": "Food & Beverage",
      // ... full company details
    }
  ],
  "pagination": {
    "currentPage": 1,
    "pageSize": 10,
    "totalResults": 1,
    "totalPages": 1
  }
}
```

---

## Troubleshooting

**Issue**: "Company not found"
- Check that the server is running with the updated `mock-data.js`
- Verify your search criteria matches the company data
- Try a broader search (e.g., just company name without other filters)

**Issue**: "Unauthorized"
- Your JWT token may have expired (expires after 1 hour)
- Re-authenticate to get a new token

**Issue**: Empty results
- The search criteria might be too specific
- Try searching with just one filter at a time