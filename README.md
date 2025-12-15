# PC Builder Web Application

A web platform that allows users to create custom PC builds, featuring interactive component selection and automated build summaries.

## Live Preview 
[Live Preview Here](http://203.159.93.245:5175/)

## Screenshot
Component Selection
<img width="2527" height="1262" alt="pc-1" src="https://github.com/user-attachments/assets/1d7cc64d-0187-4399-93be-174b8dfe9b73" />

Build Summary
<img width="2537" height="1249" alt="pc-2" src="https://github.com/user-attachments/assets/0c47f6cf-f209-4d49-882a-c3688b2ccc07" />

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

## Important Note for Local Setup

> **Since this project uses a local MongoDB instance, cloning and running this repository locally will result in an empty database (no products will be displayed).**
>
> **For the best experience with full product data, please visit the [Live Preview Link](http://203.159.93.245:5175/) instead.**

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
Configuration: Create a .env file in the backend folder and add your MongoDB connection string:
```.env
MONGO_URI=your_mongodb_connection_string_here
```
Start the server:
```bash
npm start
# Server should run on http://localhost:3000
```

### 3. Frontend Setup
Open a new terminal, navigate to the frontend directory, and install dependencies.
```bash
cd ../frontend
npm install
```
Configuration: Create a .env file in the frontend folder to point to the backend API:
```.env
VITE_API_URL=http://localhost:3000/api
```
Start the client:
```bash
npm run dev
# Client should run on http://localhost:5173
```


