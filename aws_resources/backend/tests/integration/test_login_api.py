"""
Integration tests for the authentication API endpoints.
Tests the deployed login and register endpoints.
"""
import os
import pytest
import requests
import json
import time
import random
import string


@pytest.fixture
def api_base_url():
    """Get the API base URL from environment variable."""
    url = os.getenv("API_BASE_URL")
    if not url:
        pytest.skip("API_BASE_URL environment variable not set")
    # Remove trailing slash if present
    return url.rstrip("/")


@pytest.fixture
def test_user_credentials():
    """Generate unique test user credentials for each test run."""
    timestamp = int(time.time())
    random_suffix = ''.join(random.choices(string.ascii_lowercase, k=4))
    return {
        "username": f"testuser_{timestamp}_{random_suffix}",
        "password": "TestPass123!",
        "email": f"test_{timestamp}_{random_suffix}@example.com"
    }


def test_register_success(api_base_url, test_user_credentials):
    """Test successful user registration."""
    response = requests.post(
        f"{api_base_url}/register",
        json={
            "username": test_user_credentials["username"],
            "password": test_user_credentials["password"],
            "email": test_user_credentials["email"]
        },
        headers={"Content-Type": "application/json"},
        timeout=10
    )

    assert response.status_code == 201, f"Expected 201, got {response.status_code}: {response.text}"
    data = response.json()
    assert "message" in data
    assert "User registered successfully" in data["message"]


def test_register_missing_fields(api_base_url):
    """Test registration with missing required fields."""
    # Missing email
    response = requests.post(
        f"{api_base_url}/register",
        json={
            "username": "testuser",
            "password": "TestPass123!"
        },
        headers={"Content-Type": "application/json"},
        timeout=10
    )

    assert response.status_code == 400, f"Expected 400, got {response.status_code}: {response.text}"
    data = response.json()
    assert "error" in data
    assert "required" in data["error"].lower()


def test_register_invalid_json(api_base_url):
    """Test registration with invalid JSON."""
    response = requests.post(
        f"{api_base_url}/register",
        data="invalid json",
        headers={"Content-Type": "application/json"},
        timeout=10
    )

    assert response.status_code == 400, f"Expected 400, got {response.status_code}: {response.text}"
    data = response.json()
    assert "error" in data


def test_register_duplicate_username(api_base_url, test_user_credentials):
    """Test registration with existing username."""
    # Register first time
    response1 = requests.post(
        f"{api_base_url}/register",
        json={
            "username": test_user_credentials["username"],
            "password": test_user_credentials["password"],
            "email": test_user_credentials["email"]
        },
        headers={"Content-Type": "application/json"},
        timeout=10
    )
    assert response1.status_code == 201

    # Try to register again with same username
    response2 = requests.post(
        f"{api_base_url}/register",
        json={
            "username": test_user_credentials["username"],
            "password": "DifferentPass123!",
            "email": "different@example.com"
        },
        headers={"Content-Type": "application/json"},
        timeout=10
    )

    assert response2.status_code == 400, f"Expected 400, got {response2.status_code}: {response2.text}"
    data = response2.json()
    assert "error" in data
    assert "already exists" in data["error"].lower()


def test_login_success(api_base_url, test_user_credentials):
    """Test successful login after registration."""
    # First register a user
    register_response = requests.post(
        f"{api_base_url}/register",
        json={
            "username": test_user_credentials["username"],
            "password": test_user_credentials["password"],
            "email": test_user_credentials["email"]
        },
        headers={"Content-Type": "application/json"},
        timeout=10
    )
    assert register_response.status_code == 201

    # Now login
    response = requests.post(
        f"{api_base_url}/login",
        json={
            "username": test_user_credentials["username"],
            "password": test_user_credentials["password"]
        },
        headers={"Content-Type": "application/json"},
        timeout=10
    )

    assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
    data = response.json()
    assert "accessToken" in data
    assert "idToken" in data
    assert "refreshToken" in data
    assert "expiresIn" in data
    assert "tokenType" in data
    assert data["tokenType"] == "Bearer"


def test_login_invalid_credentials(api_base_url):
    """Test login with invalid credentials."""
    response = requests.post(
        f"{api_base_url}/login",
        json={
            "username": "nonexistentuser",
            "password": "WrongPassword123!"
        },
        headers={"Content-Type": "application/json"},
        timeout=10
    )

    assert response.status_code == 401, f"Expected 401, got {response.status_code}: {response.text}"
    data = response.json()
    assert "error" in data
    assert "invalid" in data["error"].lower() or "not found" in data["error"].lower()


def test_login_missing_fields(api_base_url):
    """Test login with missing required fields."""
    # Missing password
    response = requests.post(
        f"{api_base_url}/login",
        json={
            "username": "testuser"
        },
        headers={"Content-Type": "application/json"},
        timeout=10
    )

    assert response.status_code == 400, f"Expected 400, got {response.status_code}: {response.text}"
    data = response.json()
    assert "error" in data
    assert "required" in data["error"].lower()


def test_login_invalid_json(api_base_url):
    """Test login with invalid JSON."""
    response = requests.post(
        f"{api_base_url}/login",
        data="invalid json",
        headers={"Content-Type": "application/json"},
        timeout=10
    )

    assert response.status_code == 400, f"Expected 400, got {response.status_code}: {response.text}"
    data = response.json()
    assert "error" in data


def test_login_whitespace_normalization(api_base_url, test_user_credentials):
    """Test that whitespace in username/password is trimmed."""
    # Register a user
    register_response = requests.post(
        f"{api_base_url}/register",
        json={
            "username": test_user_credentials["username"],
            "password": test_user_credentials["password"],
            "email": test_user_credentials["email"]
        },
        headers={"Content-Type": "application/json"},
        timeout=10
    )
    assert register_response.status_code == 201

    # Login with whitespace in username (should be trimmed)
    response = requests.post(
        f"{api_base_url}/login",
        json={
            "username": f"  {test_user_credentials['username']}  ",
            "password": test_user_credentials["password"]
        },
        headers={"Content-Type": "application/json"},
        timeout=10
    )

    # Should succeed (whitespace trimmed)
    assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"


def test_register_email_lowercase_normalization(api_base_url, test_user_credentials):
    """Test that email is converted to lowercase."""
    timestamp = int(time.time())
    random_suffix = ''.join(random.choices(string.ascii_lowercase, k=4))
    uppercase_email = f"TEST_{timestamp}_{random_suffix}@EXAMPLE.COM"

    response = requests.post(
        f"{api_base_url}/register",
        json={
            "username": test_user_credentials["username"],
            "password": test_user_credentials["password"],
            "email": uppercase_email
        },
        headers={"Content-Type": "application/json"},
        timeout=10
    )

    # Should succeed (email normalized to lowercase)
    assert response.status_code == 201, f"Expected 201, got {response.status_code}: {response.text}"


def test_register_whitespace_normalization(api_base_url, test_user_credentials):
    """Test that whitespace in fields is trimmed."""
    timestamp = int(time.time())
    random_suffix = ''.join(random.choices(string.ascii_lowercase, k=4))

    response = requests.post(
        f"{api_base_url}/register",
        json={
            "username": f"  {test_user_credentials['username']}  ",
            "password": f"  {test_user_credentials['password']}  ",
            "email": f"  {test_user_credentials['email']}  "
        },
        headers={"Content-Type": "application/json"},
        timeout=10
    )

    # Should succeed (whitespace trimmed)
    assert response.status_code == 201, f"Expected 201, got {response.status_code}: {response.text}"


def test_invalid_endpoint(api_base_url):
    """Test that invalid endpoints return 404."""
    response = requests.post(
        f"{api_base_url}/invalid",
        json={"username": "test", "password": "test"},
        headers={"Content-Type": "application/json"},
        timeout=10
    )

    assert response.status_code == 404, f"Expected 404, got {response.status_code}: {response.text}"
    data = response.json()
    assert "error" in data
    assert "not found" in data["error"].lower()
