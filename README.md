# ATS

<div align="center">
	<img width="100%" src="./ATS%20Banner.png">
</div>

---

## Table of Contents

- [About the Project](#about-the-project)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Database Schema](#database-schema)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Server](#running-the-server)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)

---

## About the Project

The Attendance Tracking System is designed to facilitate real-time attendance logging in educational institutions. Using RFID technology, students can check in by scanning their ID cards on an RFID reader, which automatically records their attendance. This system provides an efficient and accurate solution for tracking attendance and ensures ease of record management.

This project uses **Node.js** and **Sequelize** for the backend, along with **PostgreSQL** for database management. It leverages REST APIs to handle student attendance, class assignments, and reporting.

## Features

- **RFID-based Attendance Logging**: Enables students to mark attendance by scanning RFID cards.
- **Real-Time Data Processing**: Attendance data is updated in real time.
- **Class Management**: Supports assigning students to different classes and grades.
- **Student Management**: Handles student information, including contact details, emergency contact, and other personal data.
- **Attendance Reports**: Easily view attendance records for students and classes.

## Technologies Used

- **Node.js**: JavaScript runtime environment.
- **Express.js**: Web application framework for Node.js.
- **Sequelize**: ORM for handling database interactions.
- **PostgreSQL**: Relational database management.
- **TypeScript**: Type-safe programming language for better code reliability.
- **RFID Integration**: Hardware integration with RFID readers (assumed to be part of the hardware layer).

## Database Schema

- **Students Table**: Stores student information (ID, name, contact, etc.)
- **RFID_Cards Table**: Stores RFID card information and associates each card with a student.
- **Classes Table**: Defines different classes and assigns students to classes.
- **Attendance Table**: Logs attendance records with timestamps and associated student IDs.

## Getting Started

### Prerequisites

Ensure you have the following installed:

- **Node.js** (v12+)
- **PostgreSQL** (v12+)
- **npm** or **yarn**
- **RFID reader** hardware and supporting library

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/limitify/attendance-tracking-system.git
   cd attendance-tracking-system
   ```
2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   Create a .env file in the project
   root and add the following
   configurations:

   ```plaintext
   DB_HOST=localhost
   DB_USER=your_database_user
   DB_PASSWORD=your_database_password
   DB_NAME=attendance_db
   DB_PORT=5432
   PORT=3000
   ```

4. Set up the database:

   ```bash
   npx sequelize-cli db:migrate
   ```

### Running the Server

1. Start the server:

   ```bash
    npm run dev
   ```

   The server will run on (`http://localhost:3000`) by default. You can test the API endpoints via Postman or similar API testing tools.

## API Endpoints

### Students

#### POST /api/v1/student - Create a new student (/create OR /upload)

#### GET /api/v1//student/:id - Get a student by ID

#### PUT /api/v1/student/:id - Update student information

#### DELETE /api/v1/student/:id - Remove a student

### RFID Cards

#### POST /api/v1/rfid - Register a new RFID card (/set OR /upload)

#### GET /api/v1/rfid/:id - Get RFID card information

#### DELETE /api/v1//rfid/:id - Deactivate an RFID card

### Attendance

#### POST /api/v1/attendance/log - Log attendance when a card is scanned

#### GET /api/v1/attendance/:ID - Retrieve a student's attendance record

---

Note: This project requires the setup and configuration of RFID hardware to fully enable the attendance logging feature. Please ensure all RFID components are installed and configured as per the hardware manual.

---

### License

ATS © 2024 by Limitify is licensed under CC BY-NC-ND 4.0. To view a copy of this license, visit https://creativecommons.org/licenses/by-nc-nd/4.0/
