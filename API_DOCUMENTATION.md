# Backend API Documentation

## 1. Introduction

Welcome to the documentation for the backend APIs. This guide provides information on the available endpoints and their functionalities.
#
 ### i. Main API Endpoint
#
## 2. Main API

### 2.1 Get Main Data

- **Endpoint:** `GET /api/v2/main/`
- **Description:** Retrieves main data.

#### Request
- **Method:** `GET`
- **Headers:**
  - `session_id`: YourSessionID

- **Usage:**
  ```bash
  curl -X GET -H "session_id: YOUR_SESSION_ID" https://www.socialmediaautomation.uxlivinglab.online/api/v2/main/

#
 ### ii. User Settings Endpoints
#

## 3. User Approval API

### 3.1 Approve User

- **Endpoint:**  `GET /api/v2/user-approval/`
- **Description:** Retrieves the status of the user approvals, indicating whether to insert or update data.

#### Request
- **Method:** `GET`
- **Headers:**
  - `session_id`: YourSessionID

- **Usage:**
  ```bash                                                                                                                                   
  curl -X  GET -H "session_id: YOUR_SESSION_ID" https://www.socialmediaautomation.uxlivinglab.online/api/v2/user-approval/

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

- **Endpoint:**  `POST /api/v2/user-approval/`
- **Description:** `False` is default and `True` is set to automate the various steps of the projects.

#### Request

- **Method:** `POST`
- **Headers:**
  - `session_id`: YourSessionID

- **Body:**
  ```json
  {
    "topic": true,
    "article": false,
    "post": true,
    "schedule": false,
  }

- **Usage:**
  ```bash                                                      
  curl -X  POST -H "session_id: YOUR_SESSION_ID"-d '{"topic": true, "article": false, "post": true, "schedule": false}' https://www.socialmediaautomation.uxlivinglab.online/api/v2/user-approval/

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

- **Endpoint:**  `PUT /api/v2/user-approval/`
- **Description:** `False` is default and `True` is set to automate the various steps of the projects.
#### Request

- **Method:** `PUT`
- **Headers:**
  - `session_id`: YourSessionID

- **Body:**
  ```json
  {
    "topic": true,
    "article": false,
    "post": true,
    "schedule": false,
  }

- **Usage:**
  ```bash                                                      
  curl -X  PUT -H "session_id: YOUR_SESSION_ID"-d '{"topic": true, "article": false, "post": true, "schedule": false}' https://www.socialmediaautomation.uxlivinglab.online/api/v2/user-approval/


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

- **Endpoint:** `GET /api/v2/targeted_cities/`
- **Description:** Retrieves a list of targeted cities and status.
- **Usage:**
  ```bash
  curl -X GET -H "session_id: YOUR_SESSION_ID" https://www.socialmediaautomation.uxlivinglab.online/api/v2/targeted_cities/

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

### 4.2 Create Targeted City(TargetedCitiesCreateView)
- **Endpoint:** `POST /api/v2/targeted_cities/create/`
- **Description:** Creates a new targeted city.

#### Request

- **Method:** `POST`
- **Headers:**
  - `session_id`: YourSessionID

- **Body:**
  ```json
  {
    "target_cities": "Nairobi, Istanbul",
  }

- **Usage:**
    ```bash
    curl -X POST -H "session_id: YOUR_SESSION_ID"-d '{"target_cities": "Nairobi, Istanbul"}' https://www.socialmediaautomation.uxlivinglab.online/api/v2/targeted_cities/create/

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
- **Endpoint:**  `PUT /api/v2/targeted_cities/update/`
- **Description:** Updates an existing targeted city.

#### Request

- **Method:** `PUT`
- **Headers:**
  - `session_id`: YourSessionID

- **Body:**
  ```json
  {
    "target_cities": "Bujumbura",
  }

- **Usage:**
    ```bash
    curl -X PUT  -H "session_id: YOUR_SESSION_ID" -d '{"target_cities": "Bujumbura"}' https://www.socialmediaautomation.uxlivinglab.online/api/v2/targeted_cities/update/

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
- **Endpoint:** `GET /api/v2/hash-tags-and-mentions/`
- **Description:** Retrieves status of the form. Whether to update or insert data.

#### Request

- **Method:** `GET`
- **Headers:**
  - `session_id`: YourSessionID

- **Usage:**
    ```bash
    curl -X GET -H "session_id: YOUR_SESSION_ID" https://www.socialmediaautomation.uxlivinglab.online/api/v2/hash-tags-and-mentions/

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
- **Endpoint:** `POST /api/v2/hash-tags-and-mentions/`
- **Description:** Saves hash tags and mentions.

#### Request

- **Method:** `POST`
- **Headers:**
  - `session_id`: YourSessionID

- **Body:**
  ```json
  {
    "hashtag_list": "#welcome",
    "mentions_list": "@welcome",
  }


- **Usage:**
    ```bash
    curl -X POST -H "session_id: YOUR_SESSION_ID"-d '{"hashtag_list": #welcome, "mentions_list": @welcome}' https://www.socialmediaautomation.uxlivinglab.online/api/v2/hash-tags-and-mentions/

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
- **Endpoint:** PUT /api/v2/update-hash-tags-and-mentions/
- **Description:** Updates hash tags and mentions.

#### Request

- **Method:** `PUT`
- **Headers:**
  - `session_id`: YourSessionID

- **Body:**
  ```json
  {
    "hashtag_list": "#thankyou",
    "mentions_list": "@bye",
  }
- **Usage:**
    ```bash
    curl -X PUT -H "session_id: YOUR_SESSION_ID" -d '{"hashtag_list": #thankyou, "mentions_list": @bye}' https://www.socialmediaautomation.uxlivinglab.online/api/v2/update-hash-tags-and-mentions/

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

- **Endpoint:** `GET /api/v2/facebook-form/`
- **Description:** Retrieves the status of the Facebook form, indicating whether to insert or update data.
#### Request

- **Method:** `GET`
- **Headers:**
  - `session_id`: YourSessionID

- **Usage:**
  ```bash
  curl -X GET -H "session_id: YOUR_SESSION_ID" https://www.socialmediaautomation.uxlivinglab.online/api/v2/facebook-form/

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

- **Endpoint:** `PUT /api/v2/facebook-form/`
- **Description:** Updates Facebook form data.

#### Request

- **Method:** `PUT`
- **Headers:**
  - `session_id`: YourSessionID

- **Body:**
  ```json
  {
    "page_id": "your_page_id",
    "page_link": "your_page_link",
    "page_password": "page_password",
    "posts_no": "posts_no",
  }
- **Usage:**
  ```bash
  curl -X PUT -H "session_id: YourSessionID" -d '{"page_id=your_page_id&page_link=your_page_link&page_password=your_page_password&posts_no=your_posts_no"}' https://www.socialmediaautomation.uxlivinglab.online/api/v2/facebook-form/

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

- **Endpoint:** `POST /api/v2/facebook-form/`
- **Description:** Creates Facebook form data.

#### Request

- **Method:** `POST`
- **Headers:**
  - `session_id`: YourSessionID

- **Body:**
  ```json
  {
    "page_id": "your_page_id",
    "page_link": "your_page_link",
    "page_password": "page_password",
    "posts_no": "posts_no",
  }
- **Usage:**
  ```bash
    curl -X POST -H "session_id: YourSessionID" -d '{"page_id=your_page_id&page_link=your_page_link&page_password=your_page_password&posts_no=your_posts_no"}' https://www.socialmediaautomation.uxlivinglab.online/api/v2/facebook-form/

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

- **Endpoint:** `GET api/v2/instagram-form/`
- **Description:** Retrieves the status of the Instagram form, indicating whether to insert or update data.
#### Request

- **Method:** `GET`
- **Headers:**
  - `session_id`: YourSessionID

- **Usage:**
  ```bash
  curl -X GET -H "session_id: YourSessionID" https://www.socialmediaautomation.uxlivinglab.online/api/v2/instagram-form/

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

- **Endpoint:** `PUT api/v2/instagram-form/`
- **Description:** Updates Instagram form data.

#### Request

- **Method:** `PUT`
- **Headers:**
  - `session_id`: YourSessionID

- **Body:**
  ```json
  {
    "page_id": "your_page_id",
    "page_link": "your_page_link",
    "page_password": "page_password",
    "posts_no": "posts_no",
  }
- **Usage:**
  ```bash
  curl -X PUT -H "session_id: YourSessionID" -d '{"page_id=your_page_id&page_link=your_page_link&page_password=your_page_password&posts_no=your_posts_no"}' https://www.socialmediaautomation.uxlivinglab.online/api/v2/instagram-form/

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

- **Endpoint:** `POST api/v2/instagram-form/`
- **Description:** Creates Instagram form data.

#### Request

- **Method:** `POST`
- **Headers:**
  - `session_id`: YourSessionID

- **Body:**
  ```json
  {
    "page_id": "your_page_id",
    "page_link": "your_page_link",
    "page_password": "page_password",
    "posts_no": "posts_no",
  }
- **Usage:**
  ```bash
    curl -X POST -H "session_id: YourSessionID" -d '{"page_id=your_page_id&page_link=your_page_link&page_password=your_page_password&posts_no=your_posts_no"}' https://www.socialmediaautomation.uxlivinglab.online/api/v2/instagram-form/

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

- **Endpoint:** `GET api/v2/X-form/`
- **Description:** Retrieves the status of the X form, indicating whether to insert or update data.

#### Request
- **Method:** `GET`
- **Headers:**
  - `session_id`: YourSessionID

- **Usage:**
  ```bash
  curl -X GET -H "session_id: YOUR_SESSION_ID" https://www.socialmediaautomation.uxlivinglab.online/api/v2/X-form/

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

- **Endpoint:** `PUT api/v2/X-form/`
- **Description:** Updates X form data.

#### Request

- **Method:** `PUT`
- **Headers:**
  - `session_id`: YourSessionID

- **Body:**
  ```json
  {
    "page_id": "your_page_id",
    "page_link": "your_page_link",
    "page_password": "page_password",
    "posts_no": "posts_no",
  }

- **Usage:**
  ```bash
  curl -X PUT -H "session_id: YourSessionID" -d '{"page_id=your_page_id&page_link=your_page_link&page_password=your_page_password&posts_no=your_posts_no"}' https://www.socialmediaautomation.uxlivinglab.online/api/v2/X-form/


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

- **Endpoint:** `POST api/v2/X-form/`
- **Description:** Creates X form data.
#### Request

- **Method:** `POST`
- **Headers:**
  - `session_id`: YourSessionID

- **Body:**
  ```json
  {
    "page_id": "your_page_id",
    "page_link": "your_page_link",
    "page_password": "page_password",
    "posts_no": "posts_no",
  }
- **Usage:**
  ```bash
    curl -X POST -H "session_id: YourSessionID" -d '{"page_id=your_page_id&page_link=your_page_link&page_password=your_page_password&posts_no=your_posts_no"}' https://www.socialmediaautomation.uxlivinglab.online/api/v2/X-form/

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

- **Endpoint:** `GET api/v2/linkedIn-form/`
- **Description:** Retrieves the status of the LinkedIn form, indicating whether to insert or update data.

#### Request
- **Method:** `GET`
- **Headers:**
  - `session_id`: YourSessionID

- **Usage:**
  ```bash
  curl -X GET -H "session_id: YOUR_SESSION_ID" https://www.socialmediaautomation.uxlivinglab.online/api/v2/linkedIn-form/

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

- **Endpoint:** `PUT api/v2/linkedIn-form/`
- **Description:** Updates LinkedIn form data.

#### Request

- **Method:** `PUT`
- **Headers:**
  - `session_id`: YourSessionID

- **Body:**
  ```json
  {
    "page_id": "your_page_id",
    "page_link": "your_page_link",
    "page_password": "page_password",
    "posts_no": "posts_no",
  }

- **Usage:**
  ```bash
  curl -X PUT -H "session_id: YourSessionID" -d '{"page_id=your_page_id&page_link=your_page_link&page_password=your_page_password&posts_no=your_posts_no"}' https://www.socialmediaautomation.uxlivinglab.online/api/v2/linkedIn-form/

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

- **Endpoint:** `POST api/v2/linkedIn-form/`
- **Description:** Creates LinkedIn form data.

#### Request

- **Method:** `POST`
- **Headers:**
  - `session_id`: YourSessionID

- **Body:**
  ```json
  {
    "page_id": "your_page_id",
    "page_link": "your_page_link",
    "page_password": "page_password",
    "posts_no": "posts_no",
  }

- **Usage:**
  ```bash
    curl -X POST -H "session_id: YourSessionID" -d '{"page_id=your_page_id&page_link=your_page_link&page_password=your_page_password&posts_no=your_posts_no"}' https://www.socialmediaautomation.uxlivinglab.online/api/v2/linkedIn-form/

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

- **Endpoint:** `GET api/v2/pinterest-form/`
- **Description:** Retrieves the status of the Pinterest form, indicating whether to insert or update data.


- **Method:** `GET`
- **Headers:**
  - `session_id`: YourSessionID

- **Usage:**
  ```bash
  curl -X GET -H "session_id: YOUR_SESSION_ID" https://www.socialmediaautomation.uxlivinglab.online/api/v2/pinterest-form/

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

- **Endpoint:** `PUT api/v2/pinterest-form/`
- **Description:** Updates Pinterest form data.

#### Request

- **Method:** `PUT`
- **Headers:**
  - `session_id`: YourSessionID

- **Body:**
  ```json
  {
    "page_id": "your_page_id",
    "page_link": "your_page_link",
    "page_password": "page_password",
    "posts_no": "posts_no",
  }
- **Usage:**
  ```bash
  curl -X PUT -H "session_id: YourSessionID" -d '{"page_id=your_page_id&page_link=your_page_link&page_password=your_page_password&posts_no=your_posts_no"}' https://www.socialmediaautomation.uxlivinglab.online/api/v2/pinterest-form/

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

- **Endpoint:** `POST api/v2/pinterest-form/`
- **Description:** Creates Pinterest form data.

#### Request

- **Method:** `POST`
- **Headers:**
  - `session_id`: YourSessionID

- **Body:**
  ```json
  {
    "page_id": "your_page_id",
    "page_link": "your_page_link",
    "page_password": "page_password",
    "posts_no": "posts_no",
  }
  
- **Usage:**
  ```bash
    curl -X POST -H "session_id: YourSessionID" -d '{"page_id=your_page_id&page_link=your_page_link&page_password=your_page_password&posts_no=your_posts_no"}' https://www.socialmediaautomation.uxlivinglab.online/api/v2/pinterest-form/

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

- **Endpoint:** `GET api/v2/client-form/`
- **Description:** Retrieves the status of the Client Profile form, indicating whether to insert or update data.

#### Request

- **Method:** `PUT`
- **Headers:**
  - `session_id`: YourSessionID

- **Usage:**
  ```bash
  curl -X GET -H "session_id: YourSessionID" https://www.socialmediaautomation.uxlivinglab.online/api/v2/client-form/

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

- **Endpoint:** `PUT api/v2/client-form/`
- **Description:** Updates Client Profile form data.

#### Request

- **Method:** `PUT`
- **Headers:**
  - `session_id`: YourSessionID

- **Body:**
  ```json
  {
    "address": "your_address",
    "business": "your_business_name",
    "product": "your_product",
  }

- **Usage:**
  ```bash
  curl -X PUT -H "session_id:YourSessionID" -d '{"address=your_address&business=your_business_name&product=your_product"}' https://www.socialmediaautomation.uxlivinglab.online/api/v2/client-form/

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

- **Endpoint:** `POST api/v2/client-form/`
- **Description:** Creates Client Profile form data.

#### Request

- **Method:** `POST`
- **Headers:**
  - `session_id`: YourSessionID

- **Body:**
  ```json
  {
    "address": "your_address",
    "business": "your_business_name",
    "product": "your_product",
  }


- **Usage:**
  ```bash
    curl -X POST -H "session_id:YourSessionID" -d '{"address=your_address&business=your_business_name&product=your_product"}' https://www.socialmediaautomation.uxlivinglab.online/api/v2/client-form/

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

- **Endpoint:** `GET api/v2/post-detail-dropdowns/`
- **Description:** Retrieves the status of the Post Detail Dropdown form, indicating whether to insert or update data.
#### Request

- **Method:** `GET`
- **Headers:**
  - `session_id`: YourSessionID

- **Usage:**
  ```bash
  curl -X GET -H "session_id: YOUR_SESSION_ID" https://www.socialmediaautomation.uxlivinglab.online/api/v2/post-detail-dropdowns/

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

- **Endpoint:** `PUT api/v2/post-detail-dropdowns/`
- **Description:** Updates Post Detail Dropdown form data.

#### Request

- **Method:** `PUT`
- **Headers:**
  - `session_id`: YourSessionID

- **Body:**
  ```json
  {
    "qualitative_categorization": "your_qualitative_categorization",
    "targeted_for": "your_targeted_for",
    "targeted_category": "your_targeted_category",
  }

- **Usage:**
  ```bash
  curl -X PUT -H "session_id: YourSessionID" -d '{"qualitative_categorization=your_qualitative_categorization&targeted_for=your_targeted_for&targeted_category=your_targeted_category" }' https://www.socialmediaautomation.uxlivinglab.online/api/v2/post-detail-dropdowns/

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

- **Endpoint:** `POST api/v2/post-detail-dropdowns/`
- **Description:** Creates Post Detail Dropdown form data.

#### Request

- **Method:** `POST`
- **Headers:**
  - `session_id`: YourSessionID

- **Body:**
  ```json
  {
    "qualitative_categorization": "your_qualitative_categorization",
    "targeted_for": "your_targeted_for",
    "targeted_category": "your_targeted_category",
  }
- **Usage:**
  ```bash
  curl -X POST -H "session_id: YourSessionID" -d '{"qualitative_categorization=your_qualitative_categorization&targeted_for=your_targeted_for&targeted_category=your_targeted_category"}' https://www.socialmediaautomation.uxlivinglab.online/api/v2/post-detail-dropdowns/

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

#
 ### iii. Step-1 Endpoints
#
## 13. Topic API

### 13.1 Generate Topics

- **Endpoint:** `POST website/api/v2/generate/`
- **Description:** Generates sentences based on provided parameters. 

#### Request

- **Method:** `POST`
- **Headers:**
  - `session_id`: YourSessionID

- **Body:**
  ```json
  {
    "object": "object_value",
    "topic": "topic_value",
    "verb": "verb_value",
    "object_determinant": "object_determinant_value",
    "adjective": "adjective_value"
  }
- **Usage:**
  ```bash
  curl -X POST -H "session_id: YourSessionID" -d '{"object": "object_value", "topic": "topic_value", "verb": "verb_value", "object_determinant": "object_determinant_value", "adjective": "adjective_value"}' https://www.socialmediaautomation.uxlivinglab.online/website/api/v2/generate/

#### Response
- **Status 200 OK**
  ```json
  {
    "message": "Your Sentences are being generated",
    "api_sentence_1": {
      "sentence": "generated_sentence_1",
      "sentence_type": "sentence_type_1",
      "sentence_id": 1
    },
    "api_sentence_2": {
      "sentence": "generated_sentence_2",
      "sentence_type": "sentence_type_2",
      "sentence_id": 2
    },
    ...
  }
- **Status 400 Bad Request**
  ```json
  {
    "error": "Invalid request data"
  }

- **Status 401 Unauthorized**
  ```json
  {
    "detail": "Unauthorized"
  }

- **Status 500 Internal Server Error**
  ```json
  {
    "error": " Oops! Something went wrong."
  }


### 13.2 Categories API View

- **Endpoint:** `POST website/api/v2/category/`
- **Description:** Creates user categories. 

#### Request

- **Method:** `POST`
- **Headers:**
  - `session_id`: YourSessionID

- **Body:**
  ```json
  {
    "name": "Category1,Category2"
  }
- **Usage:**
  ```bash
  curl -X POST -H "session_id: YourSessionID" -d '{"name": "Category1,Category2"}'https://www.socialmediaautomation.uxlivinglab.online/website/api/v2/category/

#### Response
- **Status 200 OK**
  ```json
  {
    "message": "Categories created successfully"
  }
- **Status 400 Bad Request**
  ```json
  {
    "error": "Invalid request data"
  }

- **Status 401 Unauthorized**
  ```json
  {
    "detail": "Unauthorized"
  }

- **Status 500 Internal Server Error**
  ```json
  {
    "error": " Oops! Something went wrong."
  }


- **Endpoint:** `GET website/api/v2/category/`
- **Description:** Retrieves user categories. 

#### Request

- **Method:** `GET`
- **Headers:**
  - `session_id`: YourSessionID

- **Usage:**
  ```bash
  curl -X GET -H "session_id: YourSessionID" https://www.socialmediaautomation.uxlivinglab.online/website/api/v2/category/

#### Response
- **Status 200 OK**
  ```json
  [
    {
      "id": 1,
      "name": "Category1"
    },
    {
      "id": 2,
      "name": "Category2"
    },
    ...
  ]

- **Status 401 Unauthorized**
  ```json
  {
    "detail": "Unauthorized"
  }

- **Status 500 Internal Server Error**
  ```json
  {
    "error": " Oops! Something went wrong."
  }
  
### 13.3 Topics API View

- **Endpoint:** `POST website/api/v2/topic/`
- **Description:** Creates user topics. 

#### Request

- **Method:** `POST`
- **Headers:**
  - `session_id`: YourSessionID

- **Body:**
  ```json
  {
    "name": "Topic1,Topic2"
  }
- **Usage:**
  ```bash
  curl -X POST -H "session_id: YourSessionID" -d '{"name": "Topic1,Topic2"}'https://www.socialmediaautomation.uxlivinglab.online/website/api/v2/topic/

#### Response
- **Status 200 OK**
  ```json
  {
    "message": "Topics created successfully"
  }
- **Status 400 Bad Request**
  ```json
  {
    "error": "Invalid request data"
  }

- **Status 401 Unauthorized**
  ```json
  {
    "detail": "Unauthorized"
  }

- **Status 500 Internal Server Error**
  ```json
  {
    "error": " Oops! Something went wrong."
  }


- **Endpoint:** `GET website/api/v2/topic/`
- **Description:** Retrieves user topics. 

#### Request

- **Method:** `GET`
- **Headers:**
  - `session_id`: YourSessionID

- **Usage:**
  ```bash
  curl -X GET -H "session_id: YourSessionID" https://www.socialmediaautomation.uxlivinglab.online/website/api/v2/topic/

#### Response
- **Status 200 OK**
  ```json
  [
    {
      "id": 1,
      "name": "Topic1"
    },
    {
      "id": 2,
      "name": "Topic2"
    },
    ...
  ]

- **Status 401 Unauthorized**
  ```json
  {
    "detail": "Unauthorized"
  }

- **Status 500 Internal Server Error**
  ```json
  {
    "error": " Oops! Something went wrong."
  }

### 13.3 Selected Result API View

- **Endpoint:** `POST website/api/v2/selected_result/`
- **Description:** Ranks selected sentences.

#### Request

- **Method:** `POST`
- **Headers:**
  - `session_id`: YourSessionID
- **Body**
  ```json
  {
    "rank_1": 2,
    "rank_2": 1,
    "rank_3": 3
  }

- **Usage:**
  ```bash
  curl -X POST -H "session_id: YourSessionID" -d '{"rank_1": 2, "rank_2": 1, "rank_3": 3}' https://www.socialmediaautomation.uxlivinglab.online/api/v2/selected_result/

#### Response
- **Status 200 OK**
  ```json
  {
    "status": "Sentence ranked successfully"
  }

- **Status 400 Bad Request**
  ```json
  {
    "error": "Invalid request data"
  }

- **Status 401 Unauthorized**
  ```json
  {
    "detail": "Unauthorized"
  }

- **Status 500 Internal Server Error**
  ```json
  {
    "error": " Oops! Something went wrong."
  }

#
 ### iv. Step-2 Endpoints
#

## 14. Article API

### 14.1 Get User Articles(ListArticleView)

- **Endpoint:** `GET api/v2/list-articles/`
- **Description:** Retrieves a list of articles created by the user in step-1 

#### Request

- **Method:** `GET`
- **Headers:**
  - `session_id`: YourSessionID

- **Usage:**
  ```bash
  curl -X GET -H "session_id: YourSessionID" https://www.socialmediaautomation.uxlivinglab.online/api/v2/list-articles/

#### Response
- **Status 200 OK**
  ```json
  {
    "status": "Articles fetched successfully"
  }

- **Status 401 Unauthorized**
  ```json
  {
    "detail": "Unauthorized"
  }

- **Status 500 Internal Server Error**
  ```json
  {
    "error": " Oops! Something went wrong."
  }

### 14.2 Article Detail View(ArticleDetailView)
- **Endpoint:** `POST /api/v2/article-detail/`
- **Description:** Submits an article detail request.

#### Request

- **Method:** `POST`
- **Headers:**
  - `session_id`: YourSessionID

- **Body:**
  ```json
  {
    "article_id": "article_id",
    "title": "title",
    "paragraph": "paragraph",
    "source" : "source"
  }

- **Usage:**
  ```bash
  curl -X POST -H "session_id: YOUR_SESSION_ID" -d '{"article_id": "article_id", "title": "title", "paragraph": "paragraph","source": "source" }' https://www.socialmediaautomation.uxlivinglab.online/api/v2/article-detail/


#### Response
- **Status 200 OK**
  ```json
  {
    "message": "Article detail submitted successfully"
  }

- **Status  400 Bad Request**
  ```json
  {
    "error": "Invalid request parameters"
  }

- **Status 401 Unauthorized**
  ```json
  {
    "detail": "Unauthorized"
  }

- **Status 500 Internal Server Error**
  ```json
  {
    "error": " Oops! Something went wrong."
  }

### 14.3 Get User Topics(IndexView)

- **Endpoint:** `GET api/v2/article/generate/`
- **Description:** Retrieves a list of topics created by the user in step-1 
- **Usage:**
  ```bash
  curl -X GET https://www.socialmediaautomation.uxlivinglab.online/api/v2/article/generate/

#### Response
- **Status 200 OK**
  ```json
  {
    "status": "Topics fetched successfully"
  }

- **Status 401 Unauthorized**
  ```json
  {
    "detail": "Authentication failed"
  }

- **Status 500 Internal Server Error**
  ```json
  {
    "error": " Oops! Something went wrong."
  }

### 14.4 Generate Articles Using OpenAI(GenerateArticleView)
- **Endpoint:** `POST /api/v2/article/AI/`
- **Description:** Generates an article using OpenAI's GPT-3 based on user preferences.

#### Request

- **Method:** `POST`
- **Headers:**
  - `session_id`: YourSessionID

- **Body:**
  ```json
  {
    "title": "Your Article Title"
  }

- **Usage:**
  ```bash
  curl -X POST -H "session_id: YOUR_SESSION_ID" -d '{"title": "Your Article Title"}' https://www.socialmediaautomation.uxlivinglab.online/api/v2/article/AI/



#### Response
- **Status 200 OK**
  ```json
  {
    "message": "Article generated successfully",
  }


- **Status  400 Bad Request**
  ```json
  {
    "error": "Invalid request parameters"
  }

- **Status 401 Unauthorized**
  ```json
  {
    "detail": "Unauthorized"
  }

- **Status 500 Internal Server Error**
  ```json
  {
    "error": " Oops! Something went wrong."
  }
  
### 14.5 Generate Articles Using Wikipedia(GenerateArticleWikiView)
- **Endpoint:** `POST /api/v2/article/wiki/`
- **Description:** Generates an article using wikipediaapi based on user preferences.

#### Request

- **Method:** `POST`
- **Headers:**
  - `session_id`: YourSessionID

- **Body:**
  ```json
  {
    "title": "Your Article Title"
  }

- **Usage:**
  ```bash
  curl -X POST -H "session_id: YOUR_SESSION_ID" -d '{"title": "Your Article Title"}' https://www.socialmediaautomation.uxlivinglab.online/api/v2/article/wiki/



#### Response
- **Status 200 OK**
  ```json
  {
    "message": "Article generated successfully",
  }


- **Status  400 Bad Request**
  ```json
  {
    "error": "Invalid request parameters"
  }

- **Status 401 Unauthorized**
  ```json
  {
    "detail": "Unauthorized"
  }

- **Status 500 Internal Server Error**
  ```json
  {
    "error": " Oops! Something went wrong."
  }
  
### 14.6 Generate Articles Manually (WriteYourselfView)
- **Endpoint:** `POST /api/v2/article/write_yourself/`
- **Description:** Allows users to manually write their own article.

#### Request

- **Method:** `POST`
- **Headers:**
  - `session_id`: YourSessionID

- **Body:**
  ```json
  {
    "title": "Your Article Title",
    "articletextarea": "Your article content...",
    "url": "https://your-source-url.com"
  }

- **Usage:**
  ```bash
  curl -X POST -H "session_id: YOUR_SESSION_ID" -d '{"title": "Your Article Title", "articletextarea": "Your article content...", "url": "https://your-source-url.com"}' https://www.socialmediaautomation.uxlivinglab.online/api/v2/article/write_yourself/




#### Response
- **Status 200 OK**
  ```json
  {
    "message": "Article generated successfully",
  }


- **Status  400 Bad Request**
  ```json
  {
    "error": "You have to choose a sentence first to write its article."
  }


- **Status 401 Unauthorized**
  ```json
  {
    "detail": "Unauthorized"
  }

- **Status 500 Internal Server Error**
  ```json
  {
    "error": " Oops! Something went wrong."
  }
  
#
 ### v. Step-3 Endpoints
#
## 15. POST API

### 15.1 Post List View

- **Endpoint:** `GET api/v2/post_list/`
- **Description:** Retrieves a list of posts

#### Request

- **Method:** `GET`
- **Headers:**
  - `session_id`: YourSessionID

- **Usage:**
  ```bash
  curl -X GET -H "session_id: YourSessionID" https://www.socialmediaautomation.uxlivinglab.online/api/v2/post_list/

#### Response
- **Status 200 OK**
  ```json
  {
    "status": "Posts fetched successfully"
  }

- **Status 401 Unauthorized**
  ```json
  {
    "detail": "Unauthorized"
  }

- **Status 500 Internal Server Error**
  ```json
  {
    "error": " Oops! Something went wrong."
  }


### 15.2 Post Detail View

- **Endpoint:** `POST api/v2/post-detail/`
- **Description:**  Submits a post detail request.

#### Request

- **Method:** `POST`
- **Headers:**
  - `session_id`: YourSessionID

- **Usage:**
  ```bash
  curl -X POST -H "session_id: YOUR_SESSION_ID" -d '{"post_id": "post_id", "title": "title", "source": "source" }' https://www.socialmediaautomation.uxlivinglab.online/api/v2/post-detail/

#### Response
- **Status 200 OK**
  ```json
  {
    "status": "Post detail fetched successfully"
  }

- **Status  400 Bad Request**
  ```json
  {
    "error": "Invalid data format"
  }

- **Status 401 Unauthorized**
  ```json
  {
    "detail": "Unauthorized"
  }

- **Status 500 Internal Server Error**
  ```json
  {
    "error": " Oops! Something went wrong."
  }

### 15.2 Save Post View

- **Endpoint:** `POST api/v2/save_post/`
- **Description:**  Save a post to step4_data collection

#### Request

- **Method:** `POST`
- **Headers:**
  - `session_id`: YourSessionID

- **Usage:**
  ```bash
  curl -X POST -H "session_id: YOUR_SESSION_ID" -d '{"title": "title","source": "source", "qualitative_categorization": "qualitative_categorization","targeted_for": "targeted_for","designed_for": "designed_for","targeted_category": "targeted_category","image": "image","paragraphs": "paragraphs"}' https://www.socialmediaautomation.uxlivinglab.online/api/v2/save_post/

#### Response
- **Status 200 OK**
  ```json
  {
    "status": "Post saved successfully"
  }

- **Status  400 Bad Request**
  ```json
  {
    "error": "Bad request"
  }

- **Status 401 Unauthorized**
  ```json
  {
    "detail": "Unauthorized"
  }

- **Status 500 Internal Server Error**
  ```json
  {
    "error": " Oops! Something went wrong."
  }

### 15.3 Edit Post View

- **Endpoint:** `GET api/v2/edit_post/<str:post_id>/`
- **Description:**  Edit a post using dowell Editor

#### Request

- **Method:** `GET`
- **Headers:**
  - `session_id`: YourSessionID

- **Usage:**
  ```bash
  curl -X GET -H "session_id: YOUR_SESSION_ID" -d '{"token": "token"}' https://www.socialmediaautomation.uxlivinglab.online/api/v2/edit_post/<str:post_id>/

#### Response
- **Status 200 OK**
  ```json
  {
    "status": "Post data sent"
  }

- **Status  400 Bad Request**
  ```json
  {
    "error": "Bad request"
  }

- **Status 401 Unauthorized**
  ```json
  {
    "detail": "Unauthorized"
  }

- **Status 500 Internal Server Error**
  ```json
  {
    "error": " Oops! Something went wrong."
  }

#
 ### vi. Step-4 Endpoints
#
## 16. SCHEDULE API

### 16.1 Aryshare Profile View

- **Endpoint:** `GET api/v2/link/linkusers/`
- **Description:** Retrieves and links Aryshare profile information.

#### Request

- **Method:** `GET`
- **Headers:**
  - `session_id`: YourSessionID

- **Usage:**
  ```bash
  curl -X GET -H "session_id: YourSessionID" https://www.socialmediaautomation.uxlivinglab.online/api/v2/link/linkusers/

#### Response
- **Status 200 OK**
  ```json
  {
    "status": "Social media profile created"
  }

- **Status 400 Bad Request**
  ```json
  {
    "error": "Failed to create social media profile",
    "detail": "Error message here(depends on what ayrshare will return)"
  }

- **Status 401 Unauthorized**
  ```json
  {
    "detail": "Unauthorized"
  }

- **Status 500 Internal Server Error**
  ```json
  {
    "error": " Oops! Something went wrong."
  }

### 16.2 Link Media Channels View

- **Endpoint:** `GET api/v2/link/`
- **Description:** Retrieves and links media channels using Ayrshare.

#### Request

- **Method:** `GET`
- **Headers:**
  - `session_id`: YourSessionID

- **Usage:**
  ```bash
  curl -X GET -H "session_id: YourSessionID" https://www.socialmediaautomation.uxlivinglab.online/api/v2/link/

#### Response
- **Status: 302 Found (Redirect)**
  ```json
  {
    "status": "The response will be a redirect to the Ayrshare authorization page."
  }
  

- **Status 500 Internal Server Error**
  ```json
  {
    "error": " Oops! Something went wrong."
  }

### 16.3 Linked Accounts View

- **Endpoint:** `GET api/v2/linked-account/`
- **Description:** Retrieves information about linked accounts.

#### Request

- **Method:** `GET`
- **Headers:**
  - `session_id`: YourSessionID

- **Usage:**
  ```bash
  curl -X GET -H "session_id: YourSessionID" https://www.socialmediaautomation.uxlivinglab.online/api/v2/linked-account/

#### Response

- **Status: 200 OK**
  ```json
  {
    "response": {
      "linked_accounts": [
        {
          "account_type": "Facebook",
          "linked": true
        },
        {
          "account_type": "Twitter",
          "linked": false
        },
        
      ]
    }
  }
  
- **Status 401 Unauthorized**
  ```json
  {
    "detail": "Unauthorized"
  }

- **Status 500 Internal Server Error**
  ```json
  {
    "error": " Oops! Something went wrong."
  }

### 16.2 Most Recent

- **Endpoint:** `GET api/v2/recent_posts/`
- **Description:** Retrieves a list of recently posted posts

#### Request

- **Method:** `GET`
- **Headers:**
  - `session_id`: YourSessionID

- **Usage:**
  ```bash
  curl -X GET -H "session_id: YourSessionID" https://www.socialmediaautomation.uxlivinglab.online/api/v2/recent_posts/

#### Response
- **Status 200 OK**
  ```json
  {
    "status": "Posts fetched successfully"
  }

- **Status 401 Unauthorized**
  ```json
  {
    "detail": "Unauthorized"
  }

- **Status 500 Internal Server Error**
  ```json
  {
    "error": " Oops! Something went wrong."
  }

### 16.3 Scheduled Json View

- **Endpoint:** `GET api/v2/scheduled-json/`
- **Description:** Retrieves a list of recently Scheduled posts

#### Request

- **Method:** `GET`
- **Headers:**
  - `session_id`: YourSessionID

- **Usage:**
  ```bash
  curl -X GET -H "session_id: YourSessionID" https://www.socialmediaautomation.uxlivinglab.online/api/v2/scheduled-json/

#### Response
- **Status 200 OK**
  ```json
  {
    "status": "Posts fetched successfully"
  }

- **Status 401 Unauthorized**
  ```json
  {
    "detail": "Unauthorized"
  }

- **Status 500 Internal Server Error**
  ```json
  {
    "error": " Oops! Something went wrong."
  }

### 16.4 UnScheduled Json View

- **Endpoint:** `GET api/v2/unscheduled/`
- **Description:** Retrieves a list of recently UnScheduled posts

#### Request

- **Method:** `GET`
- **Headers:**
  - `session_id`: YourSessionID

- **Usage:**
  ```bash
  curl -X GET -H "session_id: YourSessionID" https://www.socialmediaautomation.uxlivinglab.online/api/v2/unscheduled/

#### Response
- **Status 200 OK**
  ```json
  {
    "status": "Posts fetched successfully"
  }

- **Status 401 Unauthorized**
  ```json
  {
    "detail": "Unauthorized"
  }

- **Status 500 Internal Server Error**
  ```json
  {
    "error": " Oops! Something went wrong."
  }

### 16.5 MediaPost View

- **Endpoint:** `POST api/v2/media_post/`
- **Description:** Creates and posts media content on various social media platforms.

#### Request

- **Method:** `POST`
- **Headers:**
  - `session_id`: YourSessionID

- **Body:**
  ```json
  {
    "title": "Your Post Title",
    "paragraph": "Your post content...",
    "image": "https://your-image-url.com",
    "PK": "YourPostID",
    "social": ["Facebook", "Twitter"],
    "special": ["SpecialPlatform"],
  }
- **Usage:**
  ```bash
  curl -X POST -H "session_id: YOUR_SESSION_ID" -d '{"title": "Your Post Title", "paragraph": "Your post content...", "image": "https://your-image-url.com", "PK": "YourPostID", "social": ["Facebook", "Twitter"], "special": ["SpecialPlatform"]}' https://www.socialmediaautomation.uxlivinglab.online/api/v2/media_post/

#### Response
- **Status 200 OK**
  ```json
  {
    "status": "Posted successfully"
  }

- **Status 401 Unauthorized**
  ```json
  {
    "detail": "Unauthorized"
  }

- **Status 500 Internal Server Error**
  ```json
  {
    "error": " Oops! Something went wrong."
  }

### 16.6 Media Schedule View

- **Endpoint:** `POST api/v2/media_schedule/`
- **Description:** Creates and posts media content on various social media platforms.

#### Request

- **Method:** `POST`
- **Headers:**
  - `session_id`: YourSessionID

- **Body:**
  ```json
  {
    "title": "Your Post Title",
    "paragraph": "Your post content...",
    "image": "https://your-image-url.com",
    "PK": "YourPostID",
    "social": ["Facebook", "Twitter"],
    "special": ["SpecialPlatform"],
    "schedule": "MM/DD/YYYY HH:MM:SS",
  }
- **Usage:**
  ```bash
    curl -X POST -H "session_id: YOUR_SESSION_ID" -d '{"title": "Your Post Title", "paragraph": "Your post content...", "image": "https://your-image-url.com", "PK": "YourPostID", "social": ["Facebook", "Twitter"], "special": ["SpecialPlatform"], "schedule": "MM/DD/YYYY HH:MM:SS"}' https://www.socialmediaautomation.uxlivinglab.online/api/v2/media_schedule/

#### Response
- **Status 200 OK**
  ```json
  {
    "status": "scheduled successfully"
  }

- **Status 401 Unauthorized**
  ```json
  {
    "detail": "Unauthorized"
  }

- **Status 500 Internal Server Error**
  ```json
  {
    "error": " Oops! Something went wrong."
  }


#
 ### vii. Step-5 Endpoints
#
## 17. COMMENTS API

### 17.1 Posted and scheduled Posts
- **Endpoint:** `GET api/v2/comments/`
- **Description:** Retrieves posts for most recent and scheduled posts.

#### Request

- **Method:** `GET`
- **Headers:**
  - `session_id`: YourSessionID

- **Usage:**
  ```bash
  curl -X GET -H "session_id: YourSessionID" https://www.socialmediaautomation.uxlivinglab.online/api/v2/comments/

#### Response
- **Status 200 OK**
  ```json
  {
    "status": "Posts fetched successfully"
  }

- **Status 401 Unauthorized**
  ```json
  {
    "detail": "Unauthorized"
  }

- **Status 500 Internal Server Error**
  ```json
  {
    "error": " Oops! Something went wrong."
  }

### 17.2 Post Comments View
- **Endpoint:** `GET api/v2/comments/create/<str:post_id>/`
- **Description:** Retrieves comments for a specific post.

#### Request

- **Method:** `GET`
- **Headers:**
  - `session_id`: YourSessionID

- **Usage:**
  ```bash
    curl -X GET -H "session_id: YOUR_SESSION_ID" -d https://www.socialmediaautomation.uxlivinglab.online/api/v2/comments/get-post-comments/{post_id}/

#### Response
- **Status 200 OK**
  ```json
  {
    "comments": [
      {
        "comment_id": 1,
        "comment_content": "Comment content...",
        "commented_at": "YYYY-MM-DD HH:MM:SS",
        "commented_by": "username"
      }
    ]
  }

- **Status 400 Bad Request**
  ```json
  {
    "message": "The post does not have aryshare ID"
  }

- **Status 401 Unauthorized**
  ```json
  {
    "detail": "Unauthorized"
  }

- **Status 500 Internal Server Error**
  ```json
  {
    "error": " Oops! Something went wrong."
  }

### 17.3 Create Comments View
- **Endpoint:** `POST api/v2/comments/create/<str:post_id>/`
- **Description:** Retrieves comments for a specific post.

#### Request

- **Method:** `POST`
- **Headers:**
  - `session_id`: YourSessionID

- **Body:**
  ```json
  {
    "platforms": ["platform1", "platform2"],
    "comment": "Your comment content..."
  }

- **Usage:**
  ```bash
    curl -X POST -H "session_id: YOUR_SESSION_ID" -d  '{"platforms": ["platform1", "platform2"], "comment": "Your comment content..."}' https://www.socialmediaautomation.uxlivinglab.online/api/v2/comments/create/<str:post_id>/

#### Response
- **Status 200 OK**
  ```json
  {
    "message": "Comment posted successfully."
  }

- **Status 400 Bad Request**
  ```json
  {
    "message": "The post does not have aryshare ID"
  }

- **Status 401 Unauthorized**
  ```json
  {
    "detail": "Unauthorized"
  }

- **Status 500 Internal Server Error**
  ```json
  {
    "error": " Oops! Something went wrong."
  }


### 17.4 Delete Comments View
- **Endpoint:** `POST api/v2/comments/delete-comment/<str:post_id>/`
- **Description:** Deletes a specific comment on a post.

#### Request

- **Method:** `POST`
- **Headers:**
  - `session_id`: YourSessionID

- **Body:**
  ```json
  {
    "platform": "platform_name",
    "comment_id": "comment_id_to_delete"
  }


- **Usage:**
  ```bash
    curl -X POST -H "session_id: YOUR_SESSION_ID" -d  '{"platform": "platform_name", "comment_id": "comment_id_to_delete"}' https://www.socialmediaautomation.uxlivinglab.online/api/v2/comments/delete-comment/<str:post_id>/

#### Response
- **Status 200 OK**
  ```json
  {
    "message": "Comment posted successfully."
  }

- **Status 400 Bad Request**
  ```json
  {
    "message": "The post does not have aryshare ID"
  }
- **Status 401 Unauthorized**
  ```json
  {
    "detail": "Unauthorized"
  }

- **Status 500 Internal Server Error**
  ```json
  {
    "error": " Oops! Something went wrong."
  }



### 17.5 Analytics View
- **Endpoint:** `POST api/v2/comments/post_analytics/`
- **Description:** Fetch the analytics of a given post.

#### Request

- **Method:** `POST`
- **Headers:**
  - `session_id`: YourSessionID

- **Body:**
  ```json
  {
    "platform": "platform_name",
    "id": "id"
  }


- **Usage:**
  ```bash
    curl -X POST -H "session_id: YOUR_SESSION_ID" -d  '{"platform(s)": "platform_name(s)", "id": "id"}' https://www.socialmediaautomation.uxlivinglab.online/api/v2/post_analytics/

#### Response
- **Status 200 OK**
  ```json
  {
    "message": "Analytics fetched successfully."
  }

- **Status 400 Bad Request**
  ```json
  {
    "message": "The post does not have aryshare ID"
  }
- **Status 401 Unauthorized**
  ```json
  {
    "detail": "Unauthorized"
  }

- **Status 500 Internal Server Error**
  ```json
  {
    "error": " Oops! Something went wrong."
  }

## 18. IMAGE LIBRARY
### 18.1 ImageLibraryView
- **Endpoint:** `POST api/v2/upload_image/`
- **Description:** Upload and update users' image library.

#### Request

- **Method:** `POST`
- **Headers:**
  - `session_id`: YourSessionID

- **Body:**
  ```json
  {
    "image": "image",
  }

- **Usage:**
  ```bash
    curl -X POST -H "session_id: YOUR_SESSION_ID" -d  '{"image": "image"}' https://www.socialmediaautomation.uxlivinglab.online/api/v2/upload_image/

#### Response
- **Status 200 OK**
  ```json
  {
    "message": "Image uploaded successfully."
  }

- **Status 400 Bad Request**
  ```json
  {
    "message": "Invalid image format. Only PNG and JPEG are allowed."
  }
- **Status 401 Unauthorized**
  ```json
  {
    "detail": "Unauthorized"
  }

- **Status 500 Internal Server Error**
  ```json
  {
    "error": "Failed to process the image."
  }

### 18.2 FetchImages View
- **Endpoint:** `GET api/v2/fetch_image/`
- **Description:** Retrieves users' images from the library.

#### Request

- **Method:** `GET`
- **Headers:**
  - `session_id`: YourSessionID

- **Usage:**
  ```bash
    curl -X GET -H "session_id: YOUR_SESSION_ID" -d https://www.socialmediaautomation.uxlivinglab.online/api/v2/fetch_image/

#### Response
- **Status 200 OK**
  ```json
  {
    "image_library(s)": "image(s) link(s)",
  }

- **Status 400 Bad Request**
  ```json
  {
    "message": "No images"
  }

- **Status 401 Unauthorized**
  ```json
  {
    "detail": "Unauthorized"
  }

- **Status 500 Internal Server Error**
  ```json
  {
    "error": " Oops! Something went wrong."
  }

### 19 FetchUserInfo View
- **Endpoint:** `GET api/v2/fetch_user_settings_data/`
- **Description:** Retrieves users' settings/data from the collection. 

#### Request

- **Method:** `GET`
- **Headers:**
  - `session_id`: YourSessionID

- **Usage:**
  ```bash
    curl -X GET -H "session_id: YOUR_SESSION_ID" -d https://www.socialmediaautomation.uxlivinglab.online/api/v2/fetch_user_settings_data/

#### Response
- **Status 200 OK**
  ```json
  {
    "user_data": "user_data",
  }

- **Status 400 Bad Request**
  ```json
  {
    "message": "No data"
  }

- **Status 401 Unauthorized**
  ```json
  {
    "detail": "Unauthorized"
  }

- **Status 500 Internal Server Error**
  ```json
  {
    "error": " Oops! Something went wrong."
  }


### 20 SocialMediaPortfolio View
- **Endpoint:** `GET api/v2/social-media-portfolio/`
- **Description:** Retrieves portfolios in a given organization. 

#### Request

- **Method:** `GET`
- **Headers:**
  - `session_id`: YourSessionID

- **Usage:**
  ```bash
    curl -X GET -H "session_id: YOUR_SESSION_ID" -d https://www.socialmediaautomation.uxlivinglab.online/api/v2/social-media-portfolio/

#### Response
- **Status 200 OK**
  ```json
  {
    "portfolio_info_list": "portfolio_info_list",
  }

- **Status 400 Bad Request**
  ```json
  {
    "message": "Oops! Something went wrong."
  }

- **Status 401 Unauthorized**
  ```json
  {
    "detail": "Unauthorized"
  }

- **Status 500 Internal Server Error**
  ```json
  {
    "error": " Oops! Something went wrong."
  }

### 20.1 SocialMediaPortfolio View
- **Endpoint:** `POST api/v2/social-media-portfolio/`
- **Description:** Assign channels to a given portfolio. 

#### Request

- **Method:** `POST`
- **Headers:**
  - `session_id`: YourSessionID

- **Usage:**
  ```bash
    curl -X POST -H "session_id: YOUR_SESSION_ID" -d '{"portfolio_code_channel_mapping": "portfolio_code_channel_mapping",}' https://www.socialmediaautomation.uxlivinglab.online/api/v2/social-media-portfolio/

#### Response
- **Status 200 OK**
  ```json
  {
    "portfolio_code_channel_mapping": "portfolio_code_channel_mapping",
  }

- **Status 400 Bad Request**
  ```json
  {
    "message": "Oops! Something went wrong."
  }

- **Status 401 Unauthorized**
  ```json
  {
    "detail": "Authentication credentials were not provided."
  }

- **Status 500 Internal Server Error**
  ```json
  {
    "error": " Oops! Something went wrong."
  }


### 21. Feedback
If you have any questions or need assistance, please contact the backend team.


