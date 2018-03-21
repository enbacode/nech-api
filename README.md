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