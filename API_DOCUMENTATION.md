# Backend API Documentation

## 1. Introduction

Welcome to the documentation for the backend APIs. This guide provides information on the available endpoints and their functionalities.

## 2. Main API

### 2.1 Get Main Data

- **Endpoint:** `GET /api/v1/main/`
- **Description:** Retrieves main data.
- **Usage:**
  ```bash
  curl -X GET https://example.com/api/v1/main/


## 3. User Approval API

### 3.1 Approve User

- **Endpoint:**  `POST /api/v1/user-approval/`
- **Description:** `False` is default and `True` is set to automate the various steps of the projects.
- **Usage:**
  ```bash                                                                                                                                   
  curl -X  POST https://example.com/api/v1/user-approval/


## 4. Targeted Cities API

### 4.1 List Targeted Cities

- **Endpoint:** `GET /api/v1/targeted_cities/`
- **Description:** Retrieves a list of targeted cities.
- **Usage:**
  ```bash
  curl -X GET https://example.com/api/v1/targeted_cities/

### 4.2 Create Targeted City
- **Endpoint:** `POST /api/v1/targeted_cities/create/`
- **Description:** Creates a new targeted city.
- **Usage:**
    ```bash
    curl -X POST https://example.com/api/v1/targeted_cities/create/


### 4.3 Update Targeted City
- **Endpoint:**  `PUT /api/v1/targeted_cities/update/`
- **Description:** Updates an existing targeted city.
- **Usage:**
    ```bash
    curl -X PUT https://example.com/api/v1/targeted_cities/update/


##  5. Hash Tags and Mentions API

### 5.1 Save Hash Tags and Mentions
- **Endpoint:** `POST /api/v1/hash-tags-and-mentions/`
- **Description:** Saves hash tags and mentions.
- **Usage:**
    ```bash
    curl -X POST https://example.com/api/v1/hash-tags-and-mentions/

### 5.2 Update Hash Tags and Mentions
- **Endpoint:** PUT /api/v1/update-hash-tags-and-mentions/
- **Description:** Updates hash tags and mentions.
- **Usage:**
    ```bash
    curl -X PUT https://example.com/api/v1/update-hash-tags-and-mentions/


## 6. Facebook Form API

### 6.1 Get Facebook Form Status

- **Endpoint:** `GET /api/v1/facebook-form/`
- **Description:** Retrieves the status of the Facebook form, indicating whether to insert or update data.
- **Usage:**
  ```bash
  curl -X GET https://example.com/api/v1/facebook-form/

#### Response
- **Status 200 OK**
  ```json
  {
    "status": "insert" | "update"
  }

- **Status 401 Unauthorized**
  ```json
  {
    "detail": "Unauthorized"
  }


### 6.2 Update Facebook Form

- **Endpoint:** `PUT /api/v1/facebook-form/`
- **Description:** Updates Facebook form data.
- **Usage:**
  ```bash
  curl -X PUT -H "Authorization: Bearer YOUR_TOKEN" -d "page_id=your_page_id&page_link=your_page_link&page_password=your_page_password&posts_no=your_posts_no" https://example.com/api/v1/facebook-form/

#### Response
- **Status 200 OK**
  ```json
  {
    "message": "Facebook details updated successfully"
  }

- **Status 500 Internal Server Error**
  ```json
  {
    "error": "Failed to update Facebook details"
  }


### 6.3 Create Facebook Form

- **Endpoint:** `POST /api/v1/facebook-form/`
- **Description:** Creates Facebook form data.
- **Usage:**
  ```bash
    curl -X POST -H "Authorization: Bearer YOUR_TOKEN" -d "page_id=your_page_id&page_link=your_page_link&page_password=your_page_password&posts_no=your_posts_no" https://example.com/api/v1/facebook-form/

#### Response
- **Status 200 OK**
  ```json
  {
    "message": "Facebook details inserted successfully"
  }

- **Status 500 Internal Server Error**
  ```json
  {
    "error": "Failed to insert Facebook details"
  }

## 7. Instagram Form API

### 7.1 Get Instagram Form Status

- **Endpoint:** `GET api/v1/instagram-form/`
- **Description:** Retrieves the status of the Instagram form, indicating whether to insert or update data.
- **Usage:**
  ```bash
  curl -X GET https://example.com/api/v1/instagram-form/

#### Response
- **Status 200 OK**
  ```json
  {
    "status": "insert" | "update"
  }

- **Status 401 Unauthorized**
  ```json
  {
    "detail": "Unauthorized"
  }


### 7.2 Update Instagram Form

- **Endpoint:** `PUT api/v1/instagram-form/`
- **Description:** Updates Instagram form data.
- **Usage:**
  ```bash
  curl -X PUT -H "Authorization: Bearer YOUR_TOKEN" -d "page_id=your_page_id&page_link=your_page_link&page_password=your_page_password&posts_no=your_posts_no" https://example.com/api/v1/instagram-form/

#### Response
- **Status 200 OK**
  ```json
  {
    "message": "Instagram details updated successfully"
  }

- **Status 500 Internal Server Error**
  ```json
  {
    "error": "Failed to update Instagram details"
  }


### 7.3 Create Instagram Form

- **Endpoint:** `POST api/v1/instagram-form/`
- **Description:** Creates Instagram form data.
- **Usage:**
  ```bash
    curl -X POST -H "Authorization: Bearer YOUR_TOKEN" -d "page_id=your_page_id&page_link=your_page_link&page_password=your_page_password&posts_no=your_posts_no" https://example.com/api/v1/instagram-form/

#### Response
- **Status 200 OK**
  ```json
  {
    "message": "Instagram details inserted successfully"
  }

- **Status 500 Internal Server Error**
  ```json
  {
    "error": "Failed to insert Instagram details"
  }


### 6. Feedback
If you have any questions or need assistance, please contact the backend team.


