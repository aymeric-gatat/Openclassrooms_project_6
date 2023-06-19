# Piiquante - Project 6

## Project Objective

Building a secure REST API using Node.js and the Express framework for the Piiquante gastronomic review application.

## Security Requirements

- User passwords are hashed.
- Authentication is enforced on all routes requiring sauce.
- Email addresses in the database are unique, and the Mongoose unique validator plugin is used to ensure their uniqueness and report errors.
- The security of the MongoDB database (from a service such as MongoDB Atlas) should not prevent the application from launching on a user's machine.
- The Mongoose plugin handles error reporting from the database.
- The contents of the 'images' folder are not uploaded to GitHub.

## Frontend

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 13.2.4.

### Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Backend

### Development server

Add an `.env` file to the backend directory and include MongoDB connection details in `MONGODB_KEY` and identification token in `TOKEN`.
Run `npm install` from the `backend` directory. You can then start the server with `node server` or `nodemon server`.
The server should run on `localhost` with the default port `3000`.
If the server runs on a different port for any reason, the port number will be printed to the console when the server starts, e.g., `Listening on port 3001`.
