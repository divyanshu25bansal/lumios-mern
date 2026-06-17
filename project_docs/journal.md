# Project journal about learning

## branch -> develop

1. config-> dbConfig.js -> declared database function for the connection.
2. imported it into app.js and called it.
3. important -> need to declare dotenv.config() first before app initialization otherwise it can break because there is a chance
   env import comes late after app gets started.

## branch api/models

1. created required API infrastructure for the app.
2. created initial mongoose models and used validator to validate passoword, email and profile picture.

## branch pages/onboarding

1. created onboarding page.
2. created login/signup page.

## branch api/auth

1. completed login, signup and logout API logic.
2. implemented bcrypt for password hashing, jwt to create token and cookies to store them.
3. created validator from reference to validate user details.
4. created random jwt secret key using ( node -e "console.log(require('crypto').randomBytes(32).toString('hex'))" ).
