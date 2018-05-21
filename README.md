# Tripful
---
## [Tripful Demo](https://youtu.be/myN7iyQw2uI)

## [Tripful Frontend Repo](https://github.com/pmattam/tripful-app)

## Overview
Tripful is a React Native App to organize all the travel plans in one place. It allows users to save their Flight, Hotel, Car Rental reservations. Also it allows user to have a packing and home checklist and also able to link their snapshots of documents or parking lot information etc.

## API

**POST**

`/register`
Creates an account for the new user
```
BODY: 
{ 
  "username": "user's full name", 
  "email": "user's email" 
  "password": "user's password", 
  "location": "Atlanta, GA"
}
```

`/login`
Retrives token for the authorized user and logs in user
```
BODY: 
{
  "email": "user's email",
  "password": "user's password"
}
```
```
RESULTS:
{
  "id":"user's id",
  "username":"user's full name",
  "email":"user's email",
  "jwt":"user's token"
}
```
`/trips`
Save a trip with all the plans

**GET**

`/trips`
Retrives all the trips for the user

