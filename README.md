# LinkLibrarian by TJ Smith / https://github.com/tlsj35

LinkLibrarian is a web app for saving and sharing links. Users can manage personal collections, follow other users, interact through likes and comments, and participate in a real-time chat.

## Features

* User registration and login (JWT authentication)
* Create, edit, delete, and search links
* Follow/unfollow users
* Social feed from followed users
* Likes and comments
* Real-time chat with Socket.io
* Admin dashboard and role-based access
* Automated testing with Jest
* GitHub Actions workflow automation

## Tech Stack

**Frontend:** React, Vite, Axios
**Backend:** Node.js, Express, Socket.io
**Database:** MySQL
**Cloud:** AWS Elastic Beanstalk, RDS, EC2
**Testing:** Jest, Supertest, GitHub Actions

## Installation

### Backend

```bash
cd backend
npm install
node server.js
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Testing

```bash
npm test
```
