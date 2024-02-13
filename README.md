## About the app
This is a REST API developed with ExpressJS. Another technologies used alongside with Express are TypeScript, Docker, PostgreSQL, Prisma, Jest, Supertest and Swagger.

## API Documentation
The documentation of contracts can be found at http://localhost:300/api-docs url. You can visit it as soon as you start the app. It's Swagger ui displaying all the endpoints available in the app.

## How to setup
    - Create .env file and copy the content from example.env file
    - Navigate to the root directory of the project and run docker compose up

### Development Commands

- Run development server:
  ```bash
  npm run dev
- start the app like in production
  ```bash
  npm start
- build the app
  ```bash
  npm run build
- run tests
  ```bash
  npm run test
- run tests in watch mode
  ```bash
  npm run test:watch
- get coverage info
  ```bash
  npm run coverage
- migrate database
  ```bash
  npm run migrate
- seed database
  ```bash
  npm run seed
- generate prisma types
  ```bash
  npm run generate


## Things I considered for future
  I created separate models for users and authors. This is easy to setup now and will be handy if owner decides to use this api for a lot of different stores.

  As this software is used for only one user (the only store owner), I skipped authorisation and authentication steps but everything is implemented in a way, that if authentication will become required, we won't need much modifications. Everything is implemented in a way that makes such implementations flexible. for now, I created just static middleware that will'be used to mock authorisation behaviour. Similar middleware can be used to have real authorisation and authentication (instead of static user retrieval, we might need to verify users with tokens)

  A user can have multiple authors attached to it. I did this just in case if we'll need to keep track of users who will manage books for different authors.