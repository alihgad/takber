# Takbeer Authentication APIs Documentation

This collection contains all authentication-related APIs for the Takbeer e-commerce platform.

## Setup Instructions

1. Import the `Authentication_Collection.json` file into Postman
2. Set up the environment variables in your Postman environment:
   - `base_url`: Your API base URL (e.g., `http://localhost:3000`)
   - `admin_token`: JWT token for admin user (obtained after admin login)
   - `user_token`: JWT token for regular user (obtained after user login)
   - `verification_token`: Email verification token (received via email)
   - `reset_token`: Password reset token (received via email)

## API Endpoints

### 1. User Registration
- **Method**: POST
- **URL**: `{{base_url}}/user`
- **Description**: Register a new user account
- **Body**:
  ```json
  {
    "name": "testuser",
    "email": "test@example.com",
    "password": "Test123456",
    "phoneNumbers": ["01012345678"],
    "address": ["Cairo, Egypt"]
  }
  ```
- **Response**: User object with verification email sent

### 2. User Login
- **Method**: POST
- **URL**: `{{base_url}}/user/login`
- **Description**: Authenticate user and return access token
- **Body**:
  ```json
  {
    "email": "test@example.com",
    "password": "Test123456"
  }
  ```
- **Response**: JWT token for authentication

### 3. Google OAuth Login
- **Method**: POST
- **URL**: `{{base_url}}/user/googleLogin`
- **Description**: Authenticate user using Google OAuth
- **Body**:
  ```json
  {
    "idToken": "your_google_id_token_here"
  }
  ```
- **Response**: JWT token for authentication

### 4. Email Verification
- **Method**: GET
- **URL**: `{{base_url}}/user/verify/{{verification_token}}`
- **Description**: Verify user's email address using token from email
- **Response**: Success message

### 5. Update User Profile
- **Method**: PUT
- **URL**: `{{base_url}}/user/userUpdate`
- **Description**: Update authenticated user's profile information
- **Headers**: `Authorization: Bearer {{user_token}}`
- **Body**:
  ```json
  {
    "name": "Updated Name",
    "email": "updated@example.com",
    "phoneNumbers": ["01098765432"],
    "address": ["Alexandria, Egypt"]
  }
  ```

### 6. Update User Password
- **Method**: PUT
- **URL**: `{{base_url}}/user/userUpdatePassword`
- **Description**: Change authenticated user's password
- **Headers**: `Authorization: Bearer {{user_token}}`
- **Body**:
  ```json
  {
    "oldPassword": "Test123456",
    "newPassword": "NewTest123456"
  }
  ```

### 7. Delete User Account
- **Method**: DELETE
- **URL**: `{{base_url}}/user/userDelete`
- **Description**: Delete authenticated user's account
- **Headers**: `Authorization: Bearer {{user_token}}`

### 8. Forgot Password
- **Method**: POST
- **URL**: `{{base_url}}/user/forgetPassword`
- **Description**: Send password reset email to user
- **Body**:
  ```json
  {
    "email": "test@example.com"
  }
  ```

### 9. Reset Password
- **Method**: PUT
- **URL**: `{{base_url}}/user/reset-password/{{reset_token}}`
- **Description**: Reset user password using token from email
- **Body**:
  ```json
  {
    "newPassword": "NewTest123456"
  }
  ```

### 10. Get User Profile
- **Method**: GET
- **URL**: `{{base_url}}/user/profile`
- **Description**: Get authenticated user's profile information
- **Headers**: `Authorization: Bearer {{user_token}}`

### 11. Get All Users (Admin Only)
- **Method**: GET
- **URL**: `{{base_url}}/user`
- **Description**: Retrieve all users (Admin only)
- **Headers**: `Authorization: Bearer {{admin_token}}`

### 12. Create User (Admin Only)
- **Method**: POST
- **URL**: `{{base_url}}/user/create`
- **Description**: Create a new user account (Admin only)
- **Headers**: `Authorization: Bearer {{admin_token}}`
- **Body**:
  ```json
  {
    "name": "newuser",
    "email": "newuser@example.com",
    "password": "Test123456",
    "phoneNumbers": ["01098765432"],
    "address": ["Alexandria, Egypt"],
    "role": "dataEntry"
  }
  ```

### 13. Admin Login
- **Method**: POST
- **URL**: `{{base_url}}/user/login`
- **Description**: Login for admin user
- **Body**:
  ```json
  {
    "email": "admin@takbeer.com",
    "password": "admin123"
  }
  ```

### 14. Data Entry Login
- **Method**: POST
- **URL**: `{{base_url}}/user/login`
- **Description**: Login for data entry user
- **Body**:
  ```json
  {
    "email": "dataentry@takbeer.com",
    "password": "data123"
  }
  ```

## Password Requirements

Passwords must meet the following criteria:
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number

## Phone Number Format

Phone numbers must be in Egyptian format:
- Starts with 01
- Followed by 0, 1, 2, or 5
- Total 11 digits
- Example: `01012345678`

## Authentication Flow

1. **Registration**: User signs up → receives verification email
2. **Verification**: User clicks email link → account verified
3. **Login**: User logs in → receives JWT token
4. **Protected Routes**: Use JWT token in Authorization header

## Error Handling

All APIs return appropriate HTTP status codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `404`: Not Found
- `500`: Internal Server Error

## Testing Workflow

1. Start with "User Registration" to create a new account
2. Check email for verification link or use "Verify Email" with token
3. Use "User Login" to get authentication token
4. Update the `user_token` variable in your environment
5. Test protected endpoints using the token
6. For admin features, use "Admin Login" and update `admin_token` 