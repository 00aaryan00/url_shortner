# Short URL Node.js

A full-stack URL shortener built with Node.js, Express, MongoDB, EJS, and cookie-based JWT authentication.

This project lets users create an account, log in, generate short links, open those links publicly, and track click analytics from a personal dashboard.

## Features

- User signup and login
- JWT-based authentication stored in HTTP-only cookies
- Password hashing with Node.js `crypto.scrypt`
- Create short URLs for authenticated users
- Reuse an existing short URL for the same destination instead of creating duplicates
- Public redirect route for short links
- Click tracking with visit history
- User-specific dashboard with analytics
- EJS server-rendered UI
- MongoDB persistence with Mongoose
- Environment-based configuration for local development and deployment

## Tech Stack

- Node.js
- Express.js
- MongoDB Atlas / MongoDB
- Mongoose
- EJS
- Cookie Parser
- Nano ID
- Dotenv

## Project Structure

```text
short-url-nodejs/
+-- controllers/       # Request handlers
+-- middlewares/       # Auth and async middleware
+-- models/            # Mongoose schemas
+-- routes/            # Express route modules
+-- service/           # Auth and password helpers
+-- views/             # EJS templates
+-- connect.js         # MongoDB connection helper
+-- index.js           # Application entry point
+-- package.json
+-- README.md
```

## How It Works

### Authentication

- Users sign up with name, email, and password.
- Passwords are hashed before being stored.
- On successful login, the app signs a JWT and stores it in an HTTP-only cookie.
- Protected routes read the cookie, verify the token, and attach the user to the request.

### URL Shortening

- Logged-in users can submit a destination URL from the dashboard.
- The app validates the URL and generates a short ID.
- If the same user shortens the same destination again, the app returns the existing short link instead of creating duplicates.

### Redirects and Analytics

- Visiting `/url/:shortId` finds the matching record.
- The app stores a timestamp in `visitHistory`.
- The user is redirected to the original destination.
- Authenticated users can view analytics for their own short URLs.

## Environment Variables

Create a `.env` file in the project root.

```env
JWT_SECRET=your-super-secret-key
MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/short-url?retryWrites=true&w=majority
PORT=8001
APP_BASE_URL=http://localhost:8001
```

### Variable Reference

- `JWT_SECRET`: Secret used to sign and verify auth tokens
- `MONGODB_URL`: MongoDB connection string
- `PORT`: Port used by the Express server
- `APP_BASE_URL`: Public base URL used when showing generated short links

## Installation

```bash
npm install
```

## Running Locally

### Development

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

Then open:

```text
http://localhost:8001
```

## Deployment Notes

- Set `JWT_SECRET`, `MONGODB_URL`, and `APP_BASE_URL` in your hosting provider environment settings.
- Use a MongoDB connection string that includes a database name, for example `/short-url`, so MongoDB does not fall back to the default `test` database.
- Most hosting platforms provide `PORT` automatically. Your app should use that environment value in production.
- Do not commit `.env` or `node_modules`.

## Main Routes

### Public Routes

- `GET /signup` - Signup page
- `GET /login` - Login page
- `GET /url/:shortId` - Redirect to the original URL

### Auth Routes

- `POST /user` - Create a user account
- `POST /user/login` - Log in a user
- `GET /user/logout` - Log out the current user

### Protected Routes

- `GET /` - User dashboard
- `POST /url` - Create a short URL
- `GET /url/analytics/:shortId` - View analytics for one short URL

## Why This Project Is Better Than a Basic Tutorial Clone

This version improves on the common beginner URL shortener pattern by:

- using hashed passwords instead of plain-text storage
- using signed auth cookies instead of an in-memory session map
- separating controllers, routes, middleware, and services more clearly
- avoiding duplicate short-link creation for the same destination
- handling missing links and errors more safely
- supporting cleaner deployment through environment variables

## Future Improvements

- Add unit and integration tests
- Add custom aliases for short URLs
- Add delete/edit actions for saved links
- Add pagination for analytics
- Add rate limiting
- Add copy-to-clipboard UI
- Add expiration dates for links

## Author

Built by Aryan.
