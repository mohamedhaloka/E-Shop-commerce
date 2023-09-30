![](https://www.babup.com/do.php?img=46882)

# E-Shop app

It is a white label Node JS application that you can download and use whether you are a mobile application developer. You can use it through Docs or as a backend developer by downloading the project and working on it.

## Setup Environment

### _For NodeJS_

Download the project first and then run the following command

```
    npm install
```

Before running the project you must create an .env file and add the necessary variables.
_The file name must be `config.env`_

Or change the name of file in `app.js` from here

```js
dotenv.config({ path: "config.env" });
```

```env
PORT=3000
NODE_ENV ex(production, development)
BASE_URL

#Database Url
DB_URI

#JWT Vars
TOKEN_PRIVATE_KEY
EXPIRES_IN ex("30d","1m"..)

#STRIPE Vars
STRIPE_KEY
SINGING_SECRET
```

Finally, you can run the application via this command

```
    npm run watch
```

_You can change the playback order via package.json file_

### _For Client Side (Flutter, Android, iOS..)_

You can use any third-party for integration with API.

##### For the API Docs [Click Here](https://documenter.getpostman.com/view/12668082/2s9Xy5MAqm#intro)
