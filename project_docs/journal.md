# Project journal about learning

## branch -> develop
1. config-> dbConfig.js -> declared database function for the connection.
2. imported it into app.js and called it.
3. important -> need to declare dotenv.config() first before app initialization otherwise it can break because there is a chance
   env import comes late after app gets started.

## branch api/models
1. created required API infrastructure for the app.
2. created initial mongoose models and used validator to validate passoword, email and profile picture.

## branch authentication/frontend
1. 