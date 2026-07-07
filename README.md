# Project Manager

Project Manager is a full-stack project collaboration app with an Express/MongoDB backend and a React/Vite frontend. It supports user authentication, role-based project access, task and subtask tracking, project notes, and email-based account workflows.

## Overview

The repository is organized into two applications:

- `backend/` - REST API, authentication, database models, validation, and email workflows
- `frontend/` - React UI for login, registration, projects, tasks, members, notes, and profile management

## Features

### Authentication And Accounts

- User registration with email verification
- Login and logout with JWT access and refresh tokens
- Forgot password and reset password flows
- Current user lookup for session restoration

### Project Management

- Create, view, update, and delete projects
- Add and manage project members
- Assign project roles with access control

### Task Management

- Create, update, and delete tasks
- Assign tasks to project members
- Track task status with `todo`, `in_progress`, and `done`
- Add subtasks and update subtask completion
- Upload multiple files to tasks

### Notes

- Create, edit, view, and delete project notes

### System

- Health check endpoint for uptime monitoring

## Tech Stack

- Backend: Node.js, Express, MongoDB, Mongoose
- Authentication: JWT, cookies, bcrypt
- Validation and uploads: express-validator, Multer
- Email: Nodemailer, Mailgen
- Frontend: React, React Router, Axios, Vite, Tailwind CSS

## Project Structure

```text
project-manager/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── db/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── utils/
│   │   ├── validators/
│   │   └── index.js
│   ├── public/
│   │   └── images/
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   └── pages/
│   └── package.json
└── SETUP.md
```

## Getting Started

### Prerequisites

- Node.js installed locally
- MongoDB connection string
- Email provider credentials for verification and password reset

### Backend Setup

From the `backend/` folder:

```bash
npm install
```

Create a `.env` file with the values used by the server:

```env
PORT=3000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/project-manager
ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=7d
SERVER_URL=http://localhost:3000
VERIFY_EMAIL_URL=http://localhost:3000/verify-email
RESET_PASSWORD_URL=http://localhost:3000/reset-password
MAILTRAP_SMTP_HOST=sandbox.smtp.mailtrap.io
MAILTRAP_SMTP_PORT=2525
MAILTRAP_SMTP_USER=your_mailtrap_user
MAILTRAP_SMTP_PASS=your_mailtrap_pass
```

Start the backend:

```bash
npm run dev
```

### Frontend Setup

From the `frontend/` folder:

```bash
npm install
```

Start the frontend:

```bash
npm run dev
```

The Vite dev server is configured in `frontend/vite.config.js`. It currently runs on port `3000` and proxies `/api` requests according to that file.

## Frontend Routes

The UI currently includes routes for:

- `/register`
- `/login`
- `/forgot-password`
- `/reset-password/:token`
- `/verify-email`
- `/projects`
- `/projects/create`
- `/projects/:projectId`
- `/projects/:projectId/edit`
- `/projects/:projectId/members`
- `/projects/:projectId/tasks/:taskId`
- `/profile`

## Backend API

### Base Paths

- `/api/v1/auth`
- `/api/v1/projects`
- `/api/v1/tasks`
- `/api/v1/notes`
- `/api/v1/healthcheck`

### Key Endpoints

#### Auth

- `POST /register`
- `POST /login`
- `POST /refresh-token`
- `POST /logout`
- `GET /current-user`
- `POST /change-password`
- `GET /verify-email/:token`
- `POST /forgot-password`
- `POST /reset-password/:token`
- `POST /resend-email-verification`

#### Projects

- `GET /`
- `POST /`
- `GET /:projectId`
- `PUT /:projectId`
- `DELETE /:projectId`
- `GET /:projectId/members`
- `POST /:projectId/members`
- `PUT /:projectId/members/:userId`
- `DELETE /:projectId/members/:userId`

#### Tasks

- `GET /:projectId`
- `POST /:projectId`
- `GET /:projectId/t/:taskId`
- `PUT /:projectId/t/:taskId`
- `DELETE /:projectId/t/:taskId`
- `POST /:projectId/t/:taskId/subtasks`
- `PUT /:projectId/st/:subTaskId`
- `DELETE /:projectId/st/:subTaskId`

#### Notes

- `GET /:projectId`
- `POST /:projectId`
- `GET /:projectId/n/:noteId`
- `PUT /:projectId/n/:noteId`
- `DELETE /:projectId/n/:noteId`

#### Health Check

- `GET /api/v1/healthcheck`

## Roles And Permissions

The application uses three roles:

- `admin`
- `project_admin`
- `member`

High-level access:

| Feature | Admin | Project Admin | Member |
| --- | --- | --- | --- |
| Create and manage projects | Yes | No | No |
| Manage project members | Yes | No | No |
| Create and manage tasks | Yes | Yes | No |
| View tasks | Yes | Yes | Yes |
| Create and delete subtasks | Yes | Yes | No |
| Update subtask status | Yes | Yes | Yes |
| Create and manage notes | Yes | No | No |
| View notes | Yes | Yes | Yes |

## File Uploads

- Task attachments are stored in `backend/public/images`
- Uploaded files are served statically by the backend

## Notes

- Backend database connection happens before the server starts listening
- CORS is configured in the backend entrypoint for local frontend access
- If your local backend port and frontend proxy target differ, align `backend/.env` and `frontend/vite.config.js` before running both apps together

## Related Documentation

- [SETUP.md](SETUP.md) - original setup guide
- [backend/PRD.md](backend/PRD.md) - backend product requirements document