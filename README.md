# nech-api [![Build Status](https://travis-ci.org/enbacode/nech-api.svg?branch=master)](https://travis-ci.org/enbacode/nech-api)
## About
nech-api is RESTful api to log your doctors nech. Nech-api is written using nodejs, express, and mongodb.
## Demo
a demo is available at https://nech-api.herokuapp.com/.
## Quick Start
Using [HTTPie](https://github.com/jakubroztocil/httpie):
1. Register to the service
```bash
$ http POST https://nech-api.herokuapp.com/auth/register username=[user] password=[password]
```
2. Get your login token
```bash
$ http POST https://nech-api.herokuapp.com/auth/login username=[user] password=[password]
```
3. Validate your token is working
```bash
$ http GET https://nech-api.herokuapp.com/users/me 'Authorization:Bearer [yourtoken]'
```
4. Post a nech
```bash
$ http POST https://nech-api.herokuapp.com/nechs/nech 'Authorization:Bearer [yourtoken]'
```
5. Get all logged nechs
```bash
$ http GET https://nech-api.herokuapp.com/nechs
```

## Endpoints
All post values must be valid JSON.
### Root
#### /
##### GET
Returns status information of the API.
### Auth
#### /auth/register
##### POST
Registers a new account.

| Parameter | Example | Description |
| --- | --- | --- |
| username | johndoe | the username you want to register
| password | s3cretW0rd | your desired password (must be at least 8 characters long) |

#### /auth/login
##### POST
Returns an access token.

| Parameter | Example | Description |
| --- | --- | --- |
| username | johndoe | your registered username |
| password | s3cretW0rd | your matching password |

#### /auth/verify
##### POST
Sends a verification code to the specified email.

| Parameter | Example | Description |
| --- | --- | --- |
| username | johndoe | your registered username |
| email | some@mail.edu | the email address you want to verify |

#### /auth/verify/[verificationToken]
##### GET
Verifies your email address

### Nechs
#### /nechs
##### GET
Returns all logged nechs.
#### /nechs/[id]
##### GET
Returns the nech specified by id.

#### /nechs/nech
##### POST
*Auth required*

Logs a new nech.
#### /nechs/trivial
##### POST
*Auth required*

Logs a new trivial.
#### /nechs/klar
*Auth required*

##### POST
Logs a new klar.
### Users
#### /users
##### GET
Returns a list of all users.
#### /users/[username]
##### GET
Returns a user specified by the username.
#### /users/[username]/nechs
##### GET
Returns all logged nechs/klars/trivials by the user.
#### /users/[username]/nechs/nech
##### GET
Returns all logged nechs by the user.
#### /users/[username]/nechs/klar
##### GET
Returns all logged klars by the user.
#### /users/[username]/nechs/trivial
##### GET
Returns all logged trivials by the user.
#### /users/me
##### GET
*Auth required*

Returns the currenty logged in user.
### Lessons
#### /lessons
##### GET
Returns all lessons.
##### POST
*Moderator required*

Posts a new lesson.

| Parameter | Example | Description |
| --- | --- | --- |
| type | LA | Must be either LA or ANA |
| from | 2018-04-01T08:00:00 | The starting date |
| to | 2018-04-01T09:30:00| The ending date |
#### /lessons/next
##### GET
Returns the next lesson.

#### /lessons/[id]
##### GET
Returns a lesson by id.

