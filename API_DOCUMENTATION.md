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

- **Endpoint:**  `GET /api/v1/user-approval/`
- **Description:** Retrieves the status of the user approvals, indicating whether to insert or update data.
- **Usage:**
  ```bash                                                                                                                                   
  curl -X  GET https://example.com/api/v1/user-approval/

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

### 3.2 Approve User

- **Endpoint:**  `POST /api/v1/user-approval/`
- **Description:** `False` is default and `True` is set to automate the various steps of the projects.
- **Usage:**
  ```bash                                                                                                                                   
  curl -X  POST https://example.com/api/v1/user-approval/

#### Response
- **Status 200 OK**
  ```json
  {
    "message": "User approvals details updated successfully"
  }

- **Status 500 Internal Server Error**
  ```json
  {
    "detail": "Failed to update user approval details"
  }

### 3.3 Approve User

- **Endpoint:**  `PUT /api/v1/user-approval/`
- **Description:** `False` is default and `True` is set to automate the various steps of the projects.
- **Usage:**
  ```bash                                                                                                                                   
  curl -X  PUT https://example.com/api/v1/user-approval/

#### Response
- **Status 200 OK**
  ```json
  {
    "message" : "User approvals details updated successfully"
  }

- **Status 500 Internal Server Error**
  ```json
  {
    "detail": "Failed to update user approval details"
  }


## 4. Targeted Cities API

### 4.1 List Targeted Cities

- **Endpoint:** `GET /api/v1/targeted_cities/`
- **Description:** Retrieves a list of targeted cities and status.
- **Usage:**
  ```bash
  curl -X GET https://example.com/api/v1/targeted_cities/

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

### 4.2 Create Targeted City
- **Endpoint:** `POST /api/v1/targeted_cities/create/`
- **Description:** Creates a new targeted city.
- **Usage:**
    ```bash
    curl -X POST https://example.com/api/v1/targeted_cities/create/

#### Response
- **Status 200 OK**
  ```json
  {
    "message" : "Targeted cities saved successfully"
  }

- **Status 500 Internal Server Error**
  ```json
  {
    "detail": "Failed to save Targeted cities"
  }

### 4.3 Update Targeted City
- **Endpoint:**  `PUT /api/v1/targeted_cities/update/`
- **Description:** Updates an existing targeted city.
- **Usage:**
    ```bash
    curl -X PUT https://example.com/api/v1/targeted_cities/update/

#### Response
- **Status 200 OK**
  ```json
  {
    "message" : "Targeted cities updated successfully"
  }

- **Status 500 Internal Server Error**
  ```json
  {
    "detail": "Failed to update Targeted cities"
  }

##  5. Hash Tags and Mentions API

### 5.1 Save Hash Tags and Mentions
- **Endpoint:** `GET /api/v1/hash-tags-and-mentions/`
- **Description:** Retrieves status of the form. Whether to update or insert data.
- **Usage:**
    ```bash
    curl -X GET https://example.com/api/v1/hash-tags-and-mentions/

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

### 5.1 Save Hash Tags and Mentions
- **Endpoint:** `POST /api/v1/hash-tags-and-mentions/`
- **Description:** Saves hash tags and mentions.
- **Usage:**
    ```bash
    curl -X POST https://example.com/api/v1/hash-tags-and-mentions/

#### Response
- **Status 200 OK**
  ```json
  {
    "message" : "hash tags and mentions updated successfully"
  }

- **Status 500 Internal Server Error**
  ```json
  {
    "detail": "Failed to update hash tags and mentions"
  }


### 5.2 Update Hash Tags and Mentions
- **Endpoint:** PUT /api/v1/update-hash-tags-and-mentions/
- **Description:** Updates hash tags and mentions.
- **Usage:**
    ```bash
    curl -X PUT https://example.com/api/v1/update-hash-tags-and-mentions/

#### Response
- **Status 200 OK**
  ```json
  {
    "message" : "hash tags and mentions updated successfully"
  }

- **Status 500 Internal Server Error**
  ```json
  {
    "detail": "Failed to update hash tags and mentions"
  }


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

## 8. X Form API

### 8.1 Get X Form Status

- **Endpoint:** `GET api/v1/X-form/`
- **Description:** Retrieves the status of the X form, indicating whether to insert or update data.
- **Usage:**
  ```bash
  curl -X GET https://example.com/api/v1/X-form/

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


### 8.2 Update X Form

- **Endpoint:** `PUT api/v1/X-form/`
- **Description:** Updates X form data.
- **Usage:**
  ```bash
  curl -X PUT -H "Authorization: Bearer YOUR_TOKEN" -d "page_id=your_page_id&page_link=your_page_link&page_password=your_page_password&posts_no=your_posts_no" https://example.com/api/v1/X-form/

#### Response
- **Status 200 OK**
  ```json
  {
    "message": "X details updated successfully"
  }

- **Status 500 Internal Server Error**
  ```json
  {
    "error": "Failed to update X details"
  }


### 8.3 Create X Form

- **Endpoint:** `POST api/v1/X-form/`
- **Description:** Creates X form data.
- **Usage:**
  ```bash
    curl -X POST -H "Authorization: Bearer YOUR_TOKEN" -d "page_id=your_page_id&page_link=your_page_link&page_password=your_page_password&posts_no=your_posts_no" https://example.com/api/v1/X-form/

#### Response
- **Status 200 OK**
  ```json
  {
    "message": "X details inserted successfully"
  }

- **Status 500 Internal Server Error**
  ```json
  {
    "error": "Failed to insert X details"
  }

## 9. LinkedIn Form API

### 9.1 Get LinkedIn Form Status

- **Endpoint:** `GET api/v1/linkedIn-form/`
- **Description:** Retrieves the status of the LinkedIn form, indicating whether to insert or update data.
- **Usage:**
  ```bash
  curl -X GET https://example.com/api/v1/linkedIn-form/

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


### 9.2 Update LinkedIn Form

- **Endpoint:** `PUT api/v1/linkedIn-form/`
- **Description:** Updates LinkedIn form data.
- **Usage:**
  ```bash
  curl -X PUT -H "Authorization: Bearer YOUR_TOKEN" -d "page_id=your_page_id&page_link=your_page_link&page_password=your_page_password&posts_no=your_posts_no" https://example.com/api/v1/linkedIn-form/

#### Response
- **Status 200 OK**
  ```json
  {
    "message": "LinkedIn details updated successfully"
  }

- **Status 500 Internal Server Error**
  ```json
  {
    "error": "Failed to update LinkedIn details"
  }


### 9.3 Create LinkedIn Form

- **Endpoint:** `POST api/v1/linkedIn-form/`
- **Description:** Creates LinkedIn form data.
- **Usage:**
  ```bash
    curl -X POST -H "Authorization: Bearer YOUR_TOKEN" -d "page_id=your_page_id&page_link=your_page_link&page_password=your_page_password&posts_no=your_posts_no" https://example.com/api/v1/linkedIn-form/

#### Response
- **Status 200 OK**
  ```json
  {
    "message": "LinkedIn details inserted successfully"
  }

- **Status 500 Internal Server Error**
  ```json
  {
    "error": "Failed to insert LinkedIn details"
  }

## 10. Pinterest Form API

### 10.1 Get Pinterest Form Status

- **Endpoint:** `GET api/v1/pinterest-form/`
- **Description:** Retrieves the status of the Pinterest form, indicating whether to insert or update data.
- **Usage:**
  ```bash
  curl -X GET https://example.com/api/v1/pinterest-form/

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


### 10.2 Update Pinterest Form

- **Endpoint:** `PUT api/v1/pinterest-form/`
- **Description:** Updates Pinterest form data.
- **Usage:**
  ```bash
  curl -X PUT -H "Authorization: Bearer YOUR_TOKEN" -d "page_id=your_page_id&page_link=your_page_link&page_password=your_page_password&posts_no=your_posts_no" https://example.com/api/v1/pinterest-form/

#### Response
- **Status 200 OK**
  ```json
  {
    "message": "Pinterest details updated successfully"
  }

- **Status 500 Internal Server Error**
  ```json
  {
    "error": "Failed to update Pinterest details"
  }


### 10.3 Create Pinterest Form

- **Endpoint:** `POST api/v1/pinterest-form/`
- **Description:** Creates Pinterest form data.
- **Usage:**
  ```bash
    curl -X POST -H "Authorization: Bearer YOUR_TOKEN" -d "page_id=your_page_id&page_link=your_page_link&page_password=your_page_password&posts_no=your_posts_no" https://example.com/api/v1/pinterest-form/

#### Response
- **Status 200 OK**
  ```json
  {
    "message": "Pinterest details inserted successfully"
  }

- **Status 500 Internal Server Error**
  ```json
  {
    "error": "Failed to insert Pinterest details"
  }


## 11. Client Profile Form API

### 11.1 Get Client Profile Form Status

- **Endpoint:** `GET api/v1/client-form/`
- **Description:** Retrieves the status of the Client Profile form, indicating whether to insert or update data.
- **Usage:**
  ```bash
  curl -X GET https://example.com/api/v1/client-form/

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


### 11.2 Update Client Profile Form

- **Endpoint:** `PUT api/v1/client-form/`
- **Description:** Updates Client Profile form data.
- **Usage:**
  ```bash
  curl -X PUT -H "Authorization: Bearer YOUR_TOKEN" -d "page_id=your_page_id&page_link=your_page_link&page_password=your_page_password&posts_no=your_posts_no" https://example.com/api/v1/client-form/

#### Response
- **Status 200 OK**
  ```json
  {
    "message": "Client Profile details updated successfully"
  }

- **Status 500 Internal Server Error**
  ```json
  {
    "error": "Failed to update Client Profile details"
  }


### 11.3 Create Client Profile Form

- **Endpoint:** `POST api/v1/client-form/`
- **Description:** Creates Client Profile form data.
- **Usage:**
  ```bash
    curl -X POST -H "Authorization: Bearer YOUR_TOKEN" -d "page_id=your_page_id&page_link=your_page_link&page_password=your_page_password&posts_no=your_posts_no" https://example.com/api/v1/client-form/

#### Response
- **Status 200 OK**
  ```json
  {
    "message": "Client Profile details inserted successfully"
  }

- **Status 500 Internal Server Error**
  ```json
  {
    "error": "Failed to insert Client Profile details"
  }
  

## 12. Post Detail Dropdown Form API

### 12.1 Get Post Detail DropdownForm Status

- **Endpoint:** `GET api/v1/post-detail-dropdowns/`
- **Description:** Retrieves the status of the Post Detail Dropdown form, indicating whether to insert or update data.
- **Usage:**
  ```bash
  curl -X GET https://example.com/api/v1/post-detail-dropdowns/

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


### 12.2 Update Post Detail Dropdown Form

- **Endpoint:** `PUT api/v1/post-detail-dropdowns/`
- **Description:** Updates Post Detail Dropdown form data.
- **Usage:**
  ```bash
  curl -X PUT -H "Authorization: Bearer YOUR_TOKEN" -d "page_id=your_page_id&page_link=your_page_link&page_password=your_page_password&posts_no=your_posts_no" https://example.com/api/v1/post-detail-dropdowns/

#### Response
- **Status 200 OK**
  ```json
  {
    "message": "Post Detail Dropdown details updated successfully"
  }

- **Status 500 Internal Server Error**
  ```json
  {
    "error": "Failed to update Post Detail Dropdown details"
  }


### 12.3 Create Post Detail Dropdown Form

- **Endpoint:** `POST api/v1/post-detail-dropdowns/`
- **Description:** Creates Post Detail Dropdown form data.
- **Usage:**
  ```bash
    curl -X POST -H "Authorization: Bearer YOUR_TOKEN" -d "page_id=your_page_id&page_link=your_page_link&page_password=your_page_password&posts_no=your_posts_no" https://example.com/api/v1/post-detail-dropdowns/

#### Response
- **Status 200 OK**
  ```json
  {
    "message": "Post Detail Dropdown details inserted successfully"
  }

- **Status 500 Internal Server Error**
  ```json
  {
    "error": "Failed to insert Post Detail Dropdown details"
  }
  

### 6. Feedback
If you have any questions or need assistance, please contact the backend team.


