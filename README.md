# PC Builder Web Application

A web platform that allows users to create custom PC builds, featuring interactive component selection and automated build summaries.

## Features
- **Component Browsing:** Browse CPU, GPU, RAM, etc., with dynamic category filtering.
- **Custom Build:** Add components to a build list and see the total price update in real-time.
- **Automated Summary:** View a summary of the selected specifications.

## Tech Stack
**Frontend:**
- React.js
- Tailwind CSS
- JavaScript

**Backend:**
- Node.js
- Express.js
- MongoDB (Mongoose)

## Installation & Run Locally

This project is divided into two parts: `frontend` and `backend`. You need to run both concurrently.

### 1. Clone the repository
```bash
git clone [https://github.com/9thanaphat/pc-builder-web.git](https://github.com/9thanaphat/pc-builder-web.git)
cd pc-builder-web
```
### 2. Backend Setup
Navigate to the backend directory and install dependencies.
```bash
cd backend
npm install
```
### 3. Configuration: Create a .env file in the backend folder and add your MongoDB connection string:
```.env
MONGO_URI=your_mongodb_connection_string_here
```
