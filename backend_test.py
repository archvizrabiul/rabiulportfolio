#!/usr/bin/env python3
"""
Comprehensive Backend API Testing for Architectural Visualization Portfolio
Tests all API endpoints including CRUD operations, error handling, and data validation
"""

import requests
import json
import sys
from datetime import datetime
from typing import Dict, Any, List

class ArchVizAPITester:
    def __init__(self, base_url: str = "https://c2fa639b-4096-408e-84c7-427f597cf0f6.preview.emergentagent.com"):
        self.base_url = base_url.rstrip('/')
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def log_test(self, test_name: str, success: bool, details: str = ""):
        """Log test results"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            status = "✅ PASS"
        else:
            status = "❌ FAIL"
        
        result = f"{status} - {test_name}"
        if details:
            result += f" | {details}"
        
        print(result)
        self.test_results.append({
            'test': test_name,
            'success': success,
            'details': details
        })
        return success

    def make_request(self, method: str, endpoint: str, data: Dict = None, expected_status: int = 200) -> tuple:
        """Make HTTP request and return success status and response data"""
        url = f"{self.base_url}/{endpoint.lstrip('/')}"
        headers = {'Content-Type': 'application/json'}
        
        try:
            if method.upper() == 'GET':
                response = requests.get(url, headers=headers, timeout=10)
            elif method.upper() == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)
            elif method.upper() == 'PUT':
                response = requests.put(url, json=data, headers=headers, timeout=10)
            elif method.upper() == 'DELETE':
                response = requests.delete(url, headers=headers, timeout=10)
            else:
                return False, f"Unsupported method: {method}"

            success = response.status_code == expected_status
            
            try:
                response_data = response.json()
            except:
                response_data = {"raw_response": response.text}
            
            details = f"Status: {response.status_code}"
            if not success:
                details += f" (Expected: {expected_status})"
                if response.text:
                    details += f" | Response: {response.text[:200]}"
            
            return success, response_data, details
            
        except requests.exceptions.RequestException as e:
            return False, {}, f"Request failed: {str(e)}"

    def test_root_endpoint(self):
        """Test root API endpoint"""
        success, data, details = self.make_request('GET', '/')
        return self.log_test("Root Endpoint", success, details)

    def test_get_projects(self):
        """Test GET /api/projects"""
        success, data, details = self.make_request('GET', '/api/projects')
        if success and isinstance(data, list):
            details += f" | Found {len(data)} projects"
            # Validate project structure
            if data and all(key in data[0] for key in ['id', 'title', 'category', 'image_url']):
                details += " | Valid project structure"
            else:
                success = False
                details += " | Invalid project structure"
        return self.log_test("GET Projects", success, details)

    def test_get_project_categories(self):
        """Test GET /api/projects/categories"""
        success, data, details = self.make_request('GET', '/api/projects/categories')
        if success and isinstance(data, list):
            details += f" | Found {len(data)} categories: {data}"
        return self.log_test("GET Project Categories", success, details)

    def test_get_blog_posts(self):
        """Test GET /api/blog"""
        success, data, details = self.make_request('GET', '/api/blog')
        if success and isinstance(data, list):
            details += f" | Found {len(data)} blog posts"
            # Validate blog post structure
            if data and all(key in data[0] for key in ['id', 'title', 'content', 'category']):
                details += " | Valid blog post structure"
            else:
                success = False
                details += " | Invalid blog post structure"
        return self.log_test("GET Blog Posts", success, details)

    def test_get_testimonials(self):
        """Test GET /api/testimonials"""
        success, data, details = self.make_request('GET', '/api/testimonials')
        if success and isinstance(data, list):
            details += f" | Found {len(data)} testimonials"
            # Validate testimonial structure
            if data and all(key in data[0] for key in ['id', 'name', 'company', 'content']):
                details += " | Valid testimonial structure"
            else:
                success = False
                details += " | Invalid testimonial structure"
        return self.log_test("GET Testimonials", success, details)

    def test_get_settings(self):
        """Test GET /api/settings"""
        success, data, details = self.make_request('GET', '/api/settings')
        if success and isinstance(data, dict):
            required_fields = ['name', 'title', 'bio', 'email']
            if all(field in data for field in required_fields):
                details += " | Valid settings structure"
            else:
                success = False
                details += " | Missing required settings fields"
        return self.log_test("GET Settings", success, details)

    def test_contact_form_submission(self):
        """Test POST /api/contact"""
        contact_data = {
            "name": "Test User",
            "email": "test@example.com",
            "message": "This is a test message from the API testing suite."
        }
        success, data, details = self.make_request('POST', '/api/contact', contact_data)
        if success and isinstance(data, dict) and 'message' in data:
            details += f" | Response: {data['message']}"
        return self.log_test("POST Contact Form", success, details)

    def test_contact_form_validation(self):
        """Test contact form validation with invalid data"""
        # Test with missing required fields
        invalid_data = {"name": "Test User"}  # Missing email and message
        success, data, details = self.make_request('POST', '/api/contact', invalid_data, expected_status=422)
        return self.log_test("Contact Form Validation", success, details)

    def test_create_project(self):
        """Test POST /api/projects"""
        project_data = {
            "title": "Test Project",
            "description": "A test project created by the API testing suite",
            "category": "Test Category",
            "image_url": "https://example.com/test-image.jpg",
            "gallery_images": ["https://example.com/gallery1.jpg"],
            "software_used": ["Test Software"]
        }
        success, data, details = self.make_request('POST', '/api/projects', project_data, expected_status=200)
        if success and 'id' in data:
            self.test_project_id = data['id']
            details += f" | Created project ID: {self.test_project_id}"
        return self.log_test("POST Create Project", success, details)

    def test_get_single_project(self):
        """Test GET /api/projects/{id}"""
        if hasattr(self, 'test_project_id'):
            success, data, details = self.make_request('GET', f'/api/projects/{self.test_project_id}')
            if success and data.get('title') == 'Test Project':
                details += " | Retrieved correct project"
            return self.log_test("GET Single Project", success, details)
        else:
            return self.log_test("GET Single Project", False, "No test project ID available")

    def test_update_project(self):
        """Test PUT /api/projects/{id}"""
        if hasattr(self, 'test_project_id'):
            update_data = {
                "title": "Updated Test Project",
                "description": "Updated description",
                "category": "Updated Category",
                "image_url": "https://example.com/updated-image.jpg",
                "gallery_images": [],
                "software_used": ["Updated Software"]
            }
            success, data, details = self.make_request('PUT', f'/api/projects/{self.test_project_id}', update_data)
            return self.log_test("PUT Update Project", success, details)
        else:
            return self.log_test("PUT Update Project", False, "No test project ID available")

    def test_delete_project(self):
        """Test DELETE /api/projects/{id}"""
        if hasattr(self, 'test_project_id'):
            success, data, details = self.make_request('DELETE', f'/api/projects/{self.test_project_id}')
            return self.log_test("DELETE Project", success, details)
        else:
            return self.log_test("DELETE Project", False, "No test project ID available")

    def test_create_blog_post(self):
        """Test POST /api/blog"""
        blog_data = {
            "title": "Test Blog Post",
            "content": "This is a test blog post created by the API testing suite.",
            "excerpt": "Test excerpt",
            "image_url": "https://example.com/blog-image.jpg",
            "category": "Test",
            "tags": ["test", "api"],
            "read_time": 5
        }
        success, data, details = self.make_request('POST', '/api/blog', blog_data, expected_status=200)
        if success and 'id' in data:
            self.test_blog_id = data['id']
            details += f" | Created blog post ID: {self.test_blog_id}"
        return self.log_test("POST Create Blog Post", success, details)

    def test_delete_blog_post(self):
        """Test DELETE /api/blog/{id}"""
        if hasattr(self, 'test_blog_id'):
            success, data, details = self.make_request('DELETE', f'/api/blog/{self.test_blog_id}')
            return self.log_test("DELETE Blog Post", success, details)
        else:
            return self.log_test("DELETE Blog Post", False, "No test blog ID available")

    def test_create_testimonial(self):
        """Test POST /api/testimonials"""
        testimonial_data = {
            "name": "Test Client",
            "company": "Test Company",
            "role": "Test Role",
            "content": "This is a test testimonial.",
            "image_url": "https://example.com/client.jpg",
            "rating": 5
        }
        success, data, details = self.make_request('POST', '/api/testimonials', testimonial_data, expected_status=200)
        if success and 'id' in data:
            self.test_testimonial_id = data['id']
            details += f" | Created testimonial ID: {self.test_testimonial_id}"
        return self.log_test("POST Create Testimonial", success, details)

    def test_delete_testimonial(self):
        """Test DELETE /api/testimonials/{id}"""
        if hasattr(self, 'test_testimonial_id'):
            success, data, details = self.make_request('DELETE', f'/api/testimonials/{self.test_testimonial_id}')
            return self.log_test("DELETE Testimonial", success, details)
        else:
            return self.log_test("DELETE Testimonial", False, "No test testimonial ID available")

    def test_update_settings(self):
        """Test PUT /api/settings"""
        settings_data = {
            "name": "Test Name",
            "title": "Test Title",
            "bio": "Test bio",
            "profile_image": "https://example.com/profile.jpg",
            "cv_url": "/test-cv.pdf",
            "email": "test@example.com",
            "phone": "+1234567890",
            "location": "Test Location",
            "social_links": {"linkedin": "https://linkedin.com/test"}
        }
        success, data, details = self.make_request('PUT', '/api/settings', settings_data)
        return self.log_test("PUT Update Settings", success, details)

    def test_get_contacts(self):
        """Test GET /api/contacts"""
        success, data, details = self.make_request('GET', '/api/contacts')
        if success and isinstance(data, list):
            details += f" | Found {len(data)} contacts"
        return self.log_test("GET Contacts", success, details)

    def test_invalid_endpoints(self):
        """Test invalid endpoints return 404"""
        success, data, details = self.make_request('GET', '/api/nonexistent', expected_status=404)
        return self.log_test("Invalid Endpoint 404", success, details)

    def run_all_tests(self):
        """Run all API tests"""
        print(f"🚀 Starting API Tests for: {self.base_url}")
        print("=" * 60)
        
        # Basic endpoint tests
        self.test_root_endpoint()
        self.test_get_projects()
        self.test_get_project_categories()
        self.test_get_blog_posts()
        self.test_get_testimonials()
        self.test_get_settings()
        self.test_get_contacts()
        
        # Contact form tests
        self.test_contact_form_submission()
        self.test_contact_form_validation()
        
        # CRUD operations tests
        self.test_create_project()
        self.test_get_single_project()
        self.test_update_project()
        self.test_delete_project()
        
        self.test_create_blog_post()
        self.test_delete_blog_post()
        
        self.test_create_testimonial()
        self.test_delete_testimonial()
        
        self.test_update_settings()
        
        # Error handling tests
        self.test_invalid_endpoints()
        
        # Print summary
        print("=" * 60)
        print(f"📊 Test Summary:")
        print(f"   Total Tests: {self.tests_run}")
        print(f"   Passed: {self.tests_passed}")
        print(f"   Failed: {self.tests_run - self.tests_passed}")
        print(f"   Success Rate: {(self.tests_passed/self.tests_run)*100:.1f}%")
        
        if self.tests_passed == self.tests_run:
            print("🎉 All tests passed!")
            return 0
        else:
            print("⚠️  Some tests failed. Check the details above.")
            return 1

def main():
    """Main function to run the tests"""
    tester = ArchVizAPITester()
    return tester.run_all_tests()

if __name__ == "__main__":
    sys.exit(main())