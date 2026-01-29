"""
ZoomInfo Mock API - Python Client Example

This example demonstrates how to interact with the ZoomInfo Mock API using Python.
"""

import requests
import json
from typing import Dict, List, Optional


class ZoomInfoClient:
    """Client for interacting with the ZoomInfo Mock API"""
    
    def __init__(self, base_url: str = "http://localhost:3000"):
        """
        Initialize the ZoomInfo client
        
        Args:
            base_url: Base URL of the mock API server
        """
        self.base_url = base_url
        self.token = None
    
    def authenticate(self, username: str, password: str) -> bool:
        """
        Authenticate and obtain JWT token
        
        Args:
            username: ZoomInfo username
            password: ZoomInfo password
            
        Returns:
            True if authentication successful, False otherwise
        """
        try:
            response = requests.post(
                f"{self.base_url}/authenticate",
                json={"username": username, "password": password}
            )
            response.raise_for_status()
            
            data = response.json()
            self.token = data["jwt"]
            print(f"✅ Authentication successful! Token expires in {data['expiresIn']} seconds")
            return True
            
        except requests.exceptions.RequestException as e:
            print(f"❌ Authentication failed: {e}")
            return False
    
    def _get_headers(self) -> Dict[str, str]:
        """Get headers with authorization token"""
        if not self.token:
            raise ValueError("Not authenticated. Call authenticate() first.")
        return {"Authorization": f"Bearer {self.token}"}
    
    def search_companies(
        self,
        company_name: Optional[str] = None,
        city: Optional[str] = None,
        state: Optional[str] = None,
        country: Optional[str] = None,
        revenue_min: Optional[int] = None,
        revenue_max: Optional[int] = None,
        employees_min: Optional[int] = None,
        employees_max: Optional[int] = None,
        industry: Optional[str] = None,
        technologies: Optional[List[str]] = None,
        page: int = 1,
        page_size: int = 10,
        output_fields: Optional[List[str]] = None
    ) -> Dict:
        """
        Search for companies
        
        Args:
            company_name: Company name to search for
            city: City filter
            state: State/Province filter
            country: Country filter
            revenue_min: Minimum revenue
            revenue_max: Maximum revenue
            employees_min: Minimum employees
            employees_max: Maximum employees
            industry: Industry filter
            technologies: List of technologies
            page: Page number
            page_size: Results per page
            output_fields: Specific fields to return
            
        Returns:
            Search results with pagination info
        """
        payload = {
            "page": page,
            "pageSize": page_size
        }
        
        # Add optional parameters
        if company_name:
            payload["companyName"] = company_name
        if city:
            payload["city"] = city
        if state:
            payload["state"] = state
        if country:
            payload["country"] = country
        if revenue_min:
            payload["revenueMin"] = revenue_min
        if revenue_max:
            payload["revenueMax"] = revenue_max
        if employees_min:
            payload["employeesMin"] = employees_min
        if employees_max:
            payload["employeesMax"] = employees_max
        if industry:
            payload["industry"] = industry
        if technologies:
            payload["technologies"] = technologies
        if output_fields:
            payload["outputFields"] = output_fields
        
        try:
            response = requests.post(
                f"{self.base_url}/search/company",
                json=payload,
                headers=self._get_headers()
            )
            response.raise_for_status()
            return response.json()
            
        except requests.exceptions.RequestException as e:
            print(f"❌ Search failed: {e}")
            return {"success": False, "error": str(e)}
    
    def enrich_company(
        self,
        company_id: Optional[str] = None,
        company_name: Optional[str] = None,
        website: Optional[str] = None,
        output_fields: Optional[List[str]] = None
    ) -> Dict:
        """
        Enrich company data
        
        Args:
            company_id: ZoomInfo company ID
            company_name: Company name
            website: Company website
            output_fields: Specific fields to return
            
        Returns:
            Enriched company data
        """
        payload = {}
        
        if company_id:
            payload["companyId"] = company_id
        elif company_name:
            payload["companyName"] = company_name
        elif website:
            payload["website"] = website
        else:
            raise ValueError("Must provide company_id, company_name, or website")
        
        if output_fields:
            payload["outputFields"] = output_fields
        
        try:
            response = requests.post(
                f"{self.base_url}/enrich/company",
                json=payload,
                headers=self._get_headers()
            )
            response.raise_for_status()
            return response.json()
            
        except requests.exceptions.RequestException as e:
            print(f"❌ Enrichment failed: {e}")
            return {"success": False, "error": str(e)}
    
    def submit_bulk_search(
        self,
        job_name: str,
        search_criteria: Dict,
        max_results: int = 10000
    ) -> Dict:
        """
        Submit a bulk search job
        
        Args:
            job_name: Name for the job
            search_criteria: Search criteria dictionary
            max_results: Maximum results to return
            
        Returns:
            Job submission response with job ID
        """
        payload = {
            "jobName": job_name,
            "searchCriteria": search_criteria,
            "maxResults": max_results
        }
        
        try:
            response = requests.post(
                f"{self.base_url}/search/company/bulk",
                json=payload,
                headers=self._get_headers()
            )
            response.raise_for_status()
            return response.json()
            
        except requests.exceptions.RequestException as e:
            print(f"❌ Bulk search submission failed: {e}")
            return {"success": False, "error": str(e)}
    
    def get_bulk_job_status(self, job_id: str) -> Dict:
        """
        Get status of a bulk search job
        
        Args:
            job_id: Job ID from submit_bulk_search
            
        Returns:
            Job status information
        """
        try:
            response = requests.get(
                f"{self.base_url}/search/company/bulk/{job_id}",
                headers=self._get_headers()
            )
            response.raise_for_status()
            return response.json()
            
        except requests.exceptions.RequestException as e:
            print(f"❌ Failed to get job status: {e}")
            return {"success": False, "error": str(e)}
    
    def get_search_fields(self) -> Dict:
        """Get available search fields"""
        try:
            response = requests.get(
                f"{self.base_url}/lookup/search/company",
                headers=self._get_headers()
            )
            response.raise_for_status()
            return response.json()
            
        except requests.exceptions.RequestException as e:
            print(f"❌ Failed to get search fields: {e}")
            return {"success": False, "error": str(e)}
    
    def get_enrich_fields(self) -> Dict:
        """Get available output fields for enrichment"""
        try:
            response = requests.get(
                f"{self.base_url}/lookup/enrich/company",
                headers=self._get_headers()
            )
            response.raise_for_status()
            return response.json()
            
        except requests.exceptions.RequestException as e:
            print(f"❌ Failed to get enrich fields: {e}")
            return {"success": False, "error": str(e)}
    
    def get_usage(self) -> Dict:
        """Get current API usage and limits"""
        try:
            response = requests.get(
                f"{self.base_url}/user/usage",
                headers=self._get_headers()
            )
            response.raise_for_status()
            return response.json()
            
        except requests.exceptions.RequestException as e:
            print(f"❌ Failed to get usage: {e}")
            return {"success": False, "error": str(e)}


def main():
    """Example usage of the ZoomInfo client"""
    
    print("=" * 70)
    print("ZoomInfo Mock API - Python Client Example")
    print("=" * 70)
    
    # Initialize client
    client = ZoomInfoClient()
    
    # Authenticate
    print("\n🔐 Authenticating...")
    if not client.authenticate("test@example.com", "password123"):
        return
    
    # Example 1: Search by company name
    print("\n📊 Example 1: Search by company name")
    print("-" * 70)
    results = client.search_companies(company_name="Microsoft")
    if results.get("success"):
        print(f"Found {results['pagination']['totalResults']} companies")
        for company in results["data"]:
            print(f"  • {company['companyName']} - {company['website']}")
    
    # Example 2: Search with filters
    print("\n📊 Example 2: Search with revenue and employee filters")
    print("-" * 70)
    results = client.search_companies(
        revenue_min=1_000_000_000,
        employees_min=5000
    )
    if results.get("success"):
        print(f"Found {results['pagination']['totalResults']} large companies")
        for company in results["data"]:
            revenue_b = company['revenue'] / 1_000_000_000
            print(f"  • {company['companyName']}")
            print(f"    Revenue: ${revenue_b:.2f}B | Employees: {company['employees']:,}")
    
    # Example 3: Enrich a company
    print("\n📋 Example 3: Enrich company by ID")
    print("-" * 70)
    result = client.enrich_company(company_id="344589814")
    if result.get("success"):
        company = result["data"]
        print(f"Company: {company['companyName']}")
        print(f"Website: {company['website']}")
        print(f"Industry: {company['primaryIndustry']}")
        print(f"Revenue: ${company['revenue']:,}")
        print(f"Employees: {company['employees']:,}")
        print(f"Technologies: {', '.join(company['technologies'])}")
    
    # Example 4: Partial enrichment
    print("\n📋 Example 4: Enrich with specific fields only")
    print("-" * 70)
    result = client.enrich_company(
        company_name="Salesforce Inc",
        output_fields=["companyName", "website", "revenue", "employees"]
    )
    if result.get("success"):
        print(json.dumps(result["data"], indent=2))
    
    # Example 5: Bulk search
    print("\n📦 Example 5: Submit bulk search job")
    print("-" * 70)
    result = client.submit_bulk_search(
        job_name="Tech Companies Search",
        search_criteria={
            "industry": "Software & Technology",
            "employeesMin": 1000
        },
        max_results=50000
    )
    if result.get("success"):
        print(f"Job submitted: {result['jobId']}")
        print(f"Status: {result['status']}")
        
        # Check job status
        status = client.get_bulk_job_status(result['jobId'])
        if status.get("success"):
            print(f"Job status: {status['status']}")
            print(f"Total results: {status.get('totalResults', 'N/A')}")
    
    # Example 6: Get usage
    print("\n📈 Example 6: Get API usage statistics")
    print("-" * 70)
    result = client.get_usage()
    if result.get("success"):
        usage = result["usage"]
        print(f"Credits: {usage['creditsUsed']:,} / {usage['creditsTotal']:,}")
        print(f"Remaining: {usage['creditsRemaining']:,}")
        print(f"Requests this minute: {usage['requestsThisMinute']} / {usage['requestsPerMinuteLimit']}")
    
    print("\n" + "=" * 70)
    print("✅ All examples completed successfully!")
    print("=" * 70)


if __name__ == "__main__":
    main()
