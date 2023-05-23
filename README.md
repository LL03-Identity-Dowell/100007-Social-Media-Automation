# 100007-Social-Media-Automation

### Folder structure description

1. _core_ folder is the project folder.
2. _app_ folder is the application folder.
3. _services_ folder which serves your application , it has two files
    - _Constants.py_: ALl the constants goes here which is required for the application.
    - _helpers.py_: All the helper function goes here which is helps the application example: _Dowellconnection function_ and _DowellEvent function_
### API documentation

_check_server_status_ : `http://127.0.0.1:8000/api/v1/test-server-status/`

_Base_url_ : `http://127.0.0.1:8000/`

| HTTP Verbs | Endpoints                      | Action                                               |
|------------|--------------------------------|------------------------------------------------------|
| GET       | /api/v1/test-server-status/ | To check server report           |
| POST      | /api/v1/data-in-collection/ | To insert data                           |
| GET        | /api/v1/data-in-collection/:company_id  | To get data                       |


##### Post data into collection
_POST_ `/api/v1/data-in-collection/`

Request Body
```json
{
    'name': 'Manish',
    'data_type': 'Real_data',
    'company_id': '12345'
}
```
Response 201
```json
{
  "message": "Data inserted !"
}
```
Response 400
```json
{
  "message": "Data insertion failed !"
}
```

_Get_ `/api/v1/data-in-collection/:company_id`

_url_: `http://127.0.0.1:8000/api/v1/data-in-collection/12345/` 

Response 200 
```json
"fetched_data": {
    "isSuccess": true,
    "data": [
        {
            "_id": "646d270835289799c1d780d5",
            "eventId": "FB1010000000000000000000003004",
            "name": "Manish",
            "data_type": "Real_data",
            "company_id": "12345"
        }
    ]
}
```
Respone 204 
```json
"fetched_data": {
    "isSuccess": true,
    "data": []
}
```