# Task Management System

This project is a Task Management API built using Node.js, Express, and MongoDB. 
It includes user authentication with JWT, task creation, retrieval, updating, and deletion functionalities.
It also consists of Integration and Unit testing.
It uses Helmet for security and follows MVC architecture.
It is deployed through the docker , and docker configuration is provided in the github repository.

## Project Structure

- `index.js`: The main entry point of the application.
- `routes.js`: Defines the routes for the API.
- `controllers.js`: Contains the business logic for handling tasks.
- `auth.js`: Handles user authentication (signup and login).
- `middleware.js`: Contains middleware functions, including authentication.
- `models.js`: Defines the Mongoose schema and model for tasks.
- `userModel.js`: Defines the Mongoose schema and model for users.
-  `taskManagementSystem.test.js`: it's inside the Integration folder - integration testing for API end points.
-  `taskManagerController.test.js`: It's inside the Unit folder - it is unit testing for the controller functions.


## Task Completed
1. Authentication done through the user email and password.
2. CRUD operation completed
3. Testing completed.
4. Deployed the project through docker 


## Installation


####INSTALL docker desktop from here "https://www.docker.com/products/docker-desktop/"

1. Clone the repository:

   git clone https://github.com/ruchika2210/TaskManagementSystem.git

2. Do "npm install" to install the dependencies
3. "docker-compose build" (for building the docker project)
4. "docker-compose up" (for running the docker containerized project)
5. If the background processes are on  :
    then list the process : "netstat -ano | findstr :3000" (3000 is port)
     and then kill the process using "taskkill /PID <process_id> /F
6. Run the test file using "npm test"

All of the env files and docker files are not ignored, pushed in the repository for smooth running of application in external environment.