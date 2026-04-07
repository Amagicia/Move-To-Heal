# More to Heal API Documentation

This document outlines the REST APIs exposed by the `backend` server for the "More to Heal" platform.

## Base URL
All API paths are relative to `http://localhost:5000/api`

---

## 1. Authentication Endpoints
**File:** `src/routes/auth.routes.js`

### [POST] `/api/auth/signup`
Creates a new user account.
- **Request Body (JSON):**
  ```json
  {
    "name": "John Doe",
    "email": "johndoe@example.com",
    "password": "securepassword",
    "age": 30,
    "gender": "male"
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "token": "JWT_HEADER.PAYLOAD.SIGNATURE",
    "user": { "id": "...", "name": "John Doe", "email": "johndoe@example.com" }
  }
  ```

### [POST] `/api/auth/login`
Authenticates an existing user and returns a JWT.
- **Request Body (JSON):**
  ```json
  {
    "email": "johndoe@example.com",
    "password": "securepassword"
  }
  ```
- **Response (200 OK):**
  Same as `/signup` response.

### [POST] `/api/auth/google`
Authenticates a user via Google OAuth Identity token.
- **Request Body (JSON):**
  ```json
  {
    "token": "GOOGLE_ID_TOKEN"
  }
  ```

---

## 2. Diagnosis Endpoints
**File:** `src/routes/diagnose.routes.js`

### [POST] `/api/diagnose`
Uploads symptoms and/or medical scans for ML analysis, producing a medical report and PDF.
- **Headers:** `Authorization: Bearer <JWT_TOKEN>`
- **Content-Type:** `multipart/form-data`
- **Request Form Data:**
  - `type` (String) - REQUIRED `['skin', 'xray', 'tumor', 'general']`
  - `symptoms` (String) - OPTIONAL
  - `image` (File) - OPTIONAL Image upload.
- **Response (200 OK):**
  ```json
  {
    "_id": "64abcdef...",
    "userId": "...",
    "type": "skin",
    "condition": "Benign Nevus",
    "confidence": "94%",
    "risk_level": "low",
    "description": "...",
    "precautions": ["..."],
    "recommended_actions": ["..."],
    "report_pdf_url": "/public/reports/report-64abcdef.pdf"
  }
  ```

---

## 3. History Endpoints
**File:** `src/routes/history.routes.js`

### [GET] `/api/history`
Retrieves a list of all past diagnoses for the authenticated user.
- **Headers:** `Authorization: Bearer <JWT_TOKEN>`
- **Response (200 OK):**
  ```json
  [
    {
      "_id": "64abcdef...",
      "type": "skin",
      "date": "2024-10-24T12:00:00.000Z",
      ...
    }
  ]
  ```

### [GET] `/api/history/:id`
Retrieves a specific diagnosis report by ID.
- **Headers:** `Authorization: Bearer <JWT_TOKEN>`
- **Parameters:** `:id` Path param (Report ID)
- **Response (200 OK):** The Diagnosis object.
