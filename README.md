
![Screenshot 2024-03-13 at 1 40 31 PM](https://github.com/Lezlee-Lowpez/Spotiplay-Capstone/assets/105022871/fcfca893-aa63-4f9c-9d44-8352c136a0bf)

Welcome to SpotiPlay, where your Spotify song savvy is put to the test. Ready for a rapid-fire round of musical discovery? Here’s how to hit the high score:
Start the Beat: Click 'Start' and brace yourself. You’ve got some clips and limited chances to shine.

Tune In: Listen carefully as each song snippet plays. The clues are in the melody, waiting for you to catch them.

Quick Guess: Identify the song? Type it in and submit your guess. Remember, you have limited shots, so make them count!

Rack Up Points: Each correct guess boosts your score. Aim for accuracy and secure your spot on the leader board.

Five and Fly: After all the clips, the game wraps. Check your score, see where you stand, and discover new tracks along the way.

SpotiPlay isn’t just a game; it's a sprint through the sound waves. Find your rhythm, enjoy the music, and maybe even discover your new favorite track. Ready, set, SpotiPlay!


## Table of Contents 📝
* [Overview](#overview)
* [Considerations](#considerations)
* [Implementation / How to Use](#implementation--how-to-use)
* [Languages & Frameworks Used](#languages--frameworks-used)
---

## Overview ☁️

---
This application aims to gamify the audio experience. With the use of Spotify's API, users can try to guess the name of the song in 30 seconds! Below are my wireframe and database tables used to guide the creation of this application
![Spotiplay](https://github.com/Lezlee-Lowpez/Spotiplay-Capstone/assets/105022871/f825d8b3-f880-47bd-ae22-d1518e67e5f0)

<img width="746" alt="Screenshot 2024-03-05 at 11 14 32 AM" src="https://github.com/Lezlee-Lowpez/Spotiplay-Capstone/assets/105022871/ca0ef6d8-9f17-4815-98e9-043a38f09d86">

## Considerations 💭

---
Trade-offs: Throughout the development of the app, I made certain trade-offs due to time constraints. For example, I did not incorporate the option for users to view a "leaderboard" or a way for the user to exit the game. These trade-offs were necessary to ensure the development of the application within the given timeframe.

# Implementation / How to Use 🛠️

To run this application on your own device, please follow the steps outlined below:

## Prerequisites

- You should have Node.js installed on your machine. If not, download and install it from [Node.js official website](https://nodejs.org/).

- This project also requires a PostgreSQL database setup. Ensure you have PostgreSQL installed or have access to a PostgreSQL database. You can download it from [PostgreSQL official website](https://www.postgresql.org/download/).

## Setup Instructions

1. **Clone the Repository:**
   - Clone the project repository to your local machine using:
     ```
     git clone <repository-url>
     ```

2. **Change into the Project Directory:**
   - Navigate to the project directory by running:
     ```
     cd <project-name>
     ```

3. **Install Dependencies:**
   - Install the necessary dependencies for both the backend and frontend by running:
     ```
     npm install
     ```
     in the root directory for backend dependencies, and if you have a separate frontend directory, run the same command in that directory as well.

4. **Database Configuration:**
   - Set up your PostgreSQL database and note your database connection details. You will need these details to connect your application to the database.

   - Create a `.env` file in the root of your backend project directory. Populate it with your database connection details and any other environment variables required for your project, such as:
     ```
     DATABASE_URL=postgresql://username:password@localhost:5432/databasename
     SERVER_PORT=5555
     ```

5. **Start the Backend Server:**
   - Start your backend server by running:
     ```
     npm start
     ```
     in the root directory of your project. Ensure your server is running on the port specified in your `.env` file (e.g., `5555`).

6. **Access the Application:**
   - Open a web browser and go to `http://localhost:3000` (or whichever port your frontend is served on) to access the application.

### Creating the Tables

You will need to create two tables, `users` and `scores`, to store user information and their scores respectively. Use the SQL statements provided below to create these tables:

      ```sql
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(30) NOT NULL,
        password VARCHAR(30) NOT NULL
      );
      
      CREATE TABLE scores (
        id SERIAL PRIMARY KEY,
        user_id INT NOT NULL,
        score INT DEFAULT 0,
        FOREIGN KEY (user_id) REFERENCES users(id)
      );```


## Languages & Frameworks Used 🖥️

---
* JavaScript/Express/Cors/Sequelize
* Git ![Git](https://www.vectorlogo.zone/logos/git-scm/git-scm-icon.svg)
* HTML 
* CSS
* Postgres/SQL
