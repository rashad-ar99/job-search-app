# Beekin Assignment

Job-search application assignment using Next.js and Node.js.

## API Information

This webapp consists of 4 APIs:

1. User: This API returns the User info of the current User.
2. Auth: This API is used for registration, login, logout and refreshing the AccessToken of a User.
3. Job: This API is used to list and get the jobs that are available.
4. UserJob: This API is used to apply and list all the jobs applied to by a User.

## Getting Started

### First time setup

Go into each directory and run the command shown below

```bash
npm install
# or
pnpm install
# or
yarn install
```

### Environment Variables

Can be set in `.env.local` at root of each of the frontend directories.
Can be set in `.env` at root of backend directory.

> 📝 **Note:** NEXT_PUBLIC\_ variables must be defined and available at build time.

Backend required .env

```
PORT=
BASE_URL=
ACCESS_TOKEN_SECRET=
REFRESH_TOKEN_SECRET=
NODE_ENV=
DB_USERNAME=
DB_PASSWORD=
DB_DATABASE=
DB_HOST=
DB_PORT=
DB_DIALECT=

```

Frontend-User required .env.local

```
APP_URL=
API_URL=

```

### Run the development server:

Run the below command for the backend from the backend directory. Add the argument "port (Provided Port Number) " with the respective port numbers and run the command in the front-end directory.

```bash
npm run dev
# or
pnpm dev
# or
yarn dev

#eg
port=3001 npm run dev
```

## Database-Server

Setup the database using mysql on your local machine and enter the required environment variables in the backend, run the command:

Import the test.json file to your database for some sample data.

The servers should be running on the specified ports.
