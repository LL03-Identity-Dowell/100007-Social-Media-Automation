# Backend API Documentation

## 1. Introduction

Welcome to the documentation for the backend APIs. This guide provides information on the available endpoints and their functionalities.
#
 ### i. Main API Endpoint
#
## 2. Main API

### 2.1 Get Main Data

- **Endpoint:** `GET /api/v1/main/`
- **Description:** Retrieves main data.

#### Request
- **Method:** `GET`
- **Headers:**
  - `session_id`: YourSessionID

- **Usage:**
  ```bash
  curl -X GET -H "session_id: YOUR_SESSION_ID" https://www.socialmediaautomation.uxlivinglab.online/api/v1/main/

#
 ### ii. User Settings Endpoints
#

## 3. User Approval API

### 3.1 Approve User

- **Endpoint:**  `GET /api/v1/user-approval/`
- **Description:** Retrieves the status of the user approvals, indicating whether to insert or update data.

#### Request
- **Method:** `GET`
- **Headers:**
  - `session_id`: YourSessionID

- **Usage:**
  ```bash                                                                                                                                   
  curl -X  GET -H "session_id: YOUR_SESSION_ID" https://www.socialmediaautomation.uxlivinglab.online/api/v1/user-approval/

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
  curl -X  POST -H "session_id: YOUR_SESSION_ID"-d '{"topic": true, "article": false, "post": true, "schedule": false}' https://www.socialmediaautomation.uxlivinglab.online/api/v1/user-approval/

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
  curl -X  PUT -H "session_id: YOUR_SESSION_ID"-d '{"topic": true, "article": false, "post": true, "schedule": false}' https://www.socialmediaautomation.uxlivinglab.online/api/v1/user-approval/


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
  curl -X GET -H "session_id: YOUR_SESSION_ID" https://www.socialmediaautomation.uxlivinglab.online/api/v1/targeted_cities/

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
- **Endpoint:** `POST /api/v1/targeted_cities/create/`
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
    curl -X POST -H "session_id: YOUR_SESSION_ID"-d '{"target_cities": "Nairobi, Istanbul"}' https://www.socialmediaautomation.uxlivinglab.online/api/v1/targeted_cities/create/

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
    curl -X PUT  -H "session_id: YOUR_SESSION_ID" -d '{"target_cities": "Bujumbura"}' https://www.socialmediaautomation.uxlivinglab.online/api/v1/targeted_cities/update/

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

#### Request

- **Method:** `GET`
- **Headers:**
  - `session_id`: YourSessionID

- **Usage:**
    ```bash
    curl -X GET -H "session_id: YOUR_SESSION_ID" https://www.socialmediaautomation.uxlivinglab.online/api/v1/hash-tags-and-mentions/

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
    curl -X POST -H "session_id: YOUR_SESSION_ID"-d '{"hashtag_list": #welcome, "mentions_list": @welcome}' https://www.socialmediaautomation.uxlivinglab.online/api/v1/hash-tags-and-mentions/

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
    curl -X PUT -H "session_id: YOUR_SESSION_ID" -d '{"hashtag_list": #thankyou, "mentions_list": @bye}' https://www.socialmediaautomation.uxlivinglab.online/api/v1/update-hash-tags-and-mentions/

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
#### Request

- **Method:** `GET`
- **Headers:**
  - `session_id`: YourSessionID

- **Usage:**
  ```bash
  curl -X GET -H "session_id: YOUR_SESSION_ID" https://www.socialmediaautomation.uxlivinglab.online/api/v1/facebook-form/

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
  curl -X PUT -H "session_id: YourSessionID" -d '{"page_id=your_page_id&page_link=your_page_link&page_password=your_page_password&posts_no=your_posts_no"}' https://www.socialmediaautomation.uxlivinglab.online/api/v1/facebook-form/

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
    curl -X POST -H "session_id: YourSessionID" -d '{"page_id=your_page_id&page_link=your_page_link&page_password=your_page_password&posts_no=your_posts_no"}' https://www.socialmediaautomation.uxlivinglab.online/api/v1/facebook-form/

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
#### Request

- **Method:** `GET`
- **Headers:**
  - `session_id`: YourSessionID

- **Usage:**
  ```bash
  curl -X GET -H "session_id: YourSessionID" https://www.socialmediaautomation.uxlivinglab.online/api/v1/instagram-form/

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
  curl -X PUT -H "session_id: YourSessionID" -d '{"page_id=your_page_id&page_link=your_page_link&page_password=your_page_password&posts_no=your_posts_no"}' https://www.socialmediaautomation.uxlivinglab.online/api/v1/instagram-form/

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
    curl -X POST -H "session_id: YourSessionID" -d '{"page_id=your_page_id&page_link=your_page_link&page_password=your_page_password&posts_no=your_posts_no"}' https://www.socialmediaautomation.uxlivinglab.online/api/v1/instagram-form/

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

#### Request
- **Method:** `GET`
- **Headers:**
  - `session_id`: YourSessionID

- **Usage:**
  ```bash
  curl -X GET -H "session_id: YOUR_SESSION_ID" https://www.socialmediaautomation.uxlivinglab.online/api/v1/X-form/

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
  curl -X PUT -H "session_id: YourSessionID" -d '{"page_id=your_page_id&page_link=your_page_link&page_password=your_page_password&posts_no=your_posts_no"}' https://www.socialmediaautomation.uxlivinglab.online/api/v1/X-form/


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
    curl -X POST -H "session_id: YourSessionID" -d '{"page_id=your_page_id&page_link=your_page_link&page_password=your_page_password&posts_no=your_posts_no"}' https://www.socialmediaautomation.uxlivinglab.online/api/v1/X-form/

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

#### Request
- **Method:** `GET`
- **Headers:**
  - `session_id`: YourSessionID

- **Usage:**
  ```bash
  curl -X GET -H "session_id: YOUR_SESSION_ID" https://www.socialmediaautomation.uxlivinglab.online/api/v1/linkedIn-form/

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
  curl -X PUT -H "session_id: YourSessionID" -d '{"page_id=your_page_id&page_link=your_page_link&page_password=your_page_password&posts_no=your_posts_no"}' https://www.socialmediaautomation.uxlivinglab.online/api/v1/linkedIn-form/

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
    curl -X POST -H "session_id: YourSessionID" -d '{"page_id=your_page_id&page_link=your_page_link&page_password=your_page_password&posts_no=your_posts_no"}' https://www.socialmediaautomation.uxlivinglab.online/api/v1/linkedIn-form/

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


- **Method:** `GET`
- **Headers:**
  - `session_id`: YourSessionID

- **Usage:**
  ```bash
  curl -X GET -H "session_id: YOUR_SESSION_ID" https://www.socialmediaautomation.uxlivinglab.online/api/v1/pinterest-form/

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
  curl -X PUT -H "session_id: YourSessionID" -d '{"page_id=your_page_id&page_link=your_page_link&page_password=your_page_password&posts_no=your_posts_no"}' https://www.socialmediaautomation.uxlivinglab.online/api/v1/pinterest-form/

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
    curl -X POST -H "session_id: YourSessionID" -d '{"page_id=your_page_id&page_link=your_page_link&page_password=your_page_password&posts_no=your_posts_no"}' https://www.socialmediaautomation.uxlivinglab.online/api/v1/pinterest-form/

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

#### Request

- **Method:** `PUT`
- **Headers:**
  - `session_id`: YourSessionID

- **Usage:**
  ```bash
  curl -X GET -H "session_id: YourSessionID" https://www.socialmediaautomation.uxlivinglab.online/api/v1/client-form/

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
  curl -X PUT -H "session_id:YourSessionID" -d '{"address=your_address&business=your_business_name&product=your_product"}' https://www.socialmediaautomation.uxlivinglab.online/api/v1/client-form/

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
    curl -X POST -H "session_id:YourSessionID" -d '{"address=your_address&business=your_business_name&product=your_product"}' https://www.socialmediaautomation.uxlivinglab.online/api/v1/client-form/

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
#### Request

- **Method:** `GET`
- **Headers:**
  - `session_id`: YourSessionID

- **Usage:**
  ```bash
  curl -X GET -H "session_id: YOUR_SESSION_ID" https://www.socialmediaautomation.uxlivinglab.online/api/v1/post-detail-dropdowns/

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
  curl -X PUT -H "session_id: YourSessionID" -d '{"qualitative_categorization=your_qualitative_categorization&targeted_for=your_targeted_for&targeted_category=your_targeted_category" }' https://www.socialmediaautomation.uxlivinglab.online/api/v1/post-detail-dropdowns/

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
  curl -X POST -H "session_id: YourSessionID" -d '{"qualitative_categorization=your_qualitative_categorization&targeted_for=your_targeted_for&targeted_category=your_targeted_category"}' https://www.socialmediaautomation.uxlivinglab.online/api/v1/post-detail-dropdowns/

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
  
#
 ### iv. Step-2 Endpoints
#

## 13. Article API

### 13.1 Get User Articles(ListArticleView)

- **Endpoint:** `GET api/v1/list-articles/`
- **Description:** Retrieves a list of articles created by the user in step-1 

#### Request

- **Method:** `GET`
- **Headers:**
  - `session_id`: YourSessionID

- **Usage:**
  ```bash
  curl -X GET -H "session_id: YourSessionID" https://www.socialmediaautomation.uxlivinglab.online/api/v1/list-articles/

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

### 13.2 Article Detail View(ArticleDetailView)
- **Endpoint:** `POST /api/v1/article-detail/`
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
  curl -X POST -H "session_id: YOUR_SESSION_ID" -d '{"article_id": "article_id", "title": "title", "paragraph": "paragraph","source": "source" }' https://www.socialmediaautomation.uxlivinglab.online/api/v1/article-detail/


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

### 13.3 Get User Topics(IndexView)

- **Endpoint:** `GET api/v1/article/generate/`
- **Description:** Retrieves a list of topics created by the user in step-1 
- **Usage:**
  ```bash
  curl -X GET https://www.socialmediaautomation.uxlivinglab.online/api/v1/article/generate/

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

### 13.4 Generate Articles Using OpenAI(GenerateArticleView)
- **Endpoint:** `POST /api/v1/article/AI/`
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
  curl -X POST -H "session_id: YOUR_SESSION_ID" -d '{"title": "Your Article Title"}' https://www.socialmediaautomation.uxlivinglab.online/api/v1/article/AI/



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
  
### 13.5 Generate Articles Using Wikipedia(GenerateArticleWikiView)
- **Endpoint:** `POST /api/v1/article/wiki/`
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
  curl -X POST -H "session_id: YOUR_SESSION_ID" -d '{"title": "Your Article Title"}' https://www.socialmediaautomation.uxlivinglab.online/api/v1/article/wiki/



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
  
### 13.6 Generate Articles Manually (WriteYourselfView)
- **Endpoint:** `POST /api/v1/article/write_yourself/`
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
  curl -X POST -H "session_id: YOUR_SESSION_ID" -d '{"title": "Your Article Title", "articletextarea": "Your article content...", "url": "https://your-source-url.com"}' https://www.socialmediaautomation.uxlivinglab.online/api/v1/article/write_yourself/




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

#
 ### vi. Step-4 Endpoints
#

#
 ### vii. Step-5 Endpoints
#

### 6. Feedback
If you have any questions or need assistance, please contact the backend team.


