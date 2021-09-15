# Zembrani - Vehicle rental API


## Built With
* [Node.js](https://nodejs.org/en/)
* [Express.js](https://expressjs.com/)

## Requirements
* [Node.js](https://nodejs.org/en/)
* [Postman](https://www.getpostman.com/) for testing
* [Database](database-example.sql)

## Installation

Clone this repository and then use the package manager npm to install dependencies.


```bash
npm install
```

## Setup .env example

Create .env file in your root project folder.

```env

DB_HOST=
DB_USER=
DB_PASS=
DB_NAME=
DB_PORT=
VERIF_SECRET_KEY=
FORGOT_PASSWORD_SECRET_KEY=
ACCESS_TOKEN_SECRET_KEY=
PORT=4646

FRONT_END_SERVER_URL=

#nodemailer
EMAIL_USER=
NODEMAILER_AUTH_USER =
NODEMAILER_AUTH_PASS =

```

## Run the app

Development mode

```bash
npm run dev
```

Deploy mode

```bash
npm start
```

## REST API

You can view my Postman collection [here](https://www.postman.com/crimson-meadow-842892/workspace/zembrani) </br>

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.
