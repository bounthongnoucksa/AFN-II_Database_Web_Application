# AFN-II_Database_Web_Application
M and E Database Web application for AFN II Project 2025


1. Open folder in VS Code
2. Open terminal in VS Code: D:\Software_Development_Project\React_Employee_App> 
3. Run command to initiate our Frontend App: npm init react-app client
4. You will find the folder client created in the root folder above. this will be serve as our frontend application.

then 
create another folder call server
=================================
ReactJS:
=================================
Terminal1:
npm init react-app client

first terminal: cd client folder
run react: npm start
npm i axios (if issue found the run npm audit fix --force)
npm install bootstrap
npm install react-bootstrap (Specical boostrap built for React)
npm install react-scripts@latest
npm audit fix

npm start
    Starts the development server.

  npm run build
    Bundles the app into static files for production.

(if we want to use charts to show data we need below library:)
npm install recharts




=================================
NodeJS:
=================================
Terminal2: cd server folder
npm init -y
npm install express sqlite3 body-parser cors
npm install axios
npm i nodemon (this is the tool to monitor source code change for developer without reload)
then we need to put "dev": "nodemon index.js" to the file package.json

npm install dotenv (To Use a .env file for global config and manage centrally. the file name must be at root folder without name so the file is ".env")
npm i exceljs (To export data from database to Excel)

npm run dev (To start the NodeJS server in dev environment)
npm run start (here is the start script: "start": "node server.js" so we will run this command in production)

in package.json we need to add "type": "module", so that Nodes knows that project is using ES modules
"name": "backend",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "type": "module",
===================================
Security part:
===================================
Manually generate API Key via terminal:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

(In production we can autogenerate using a NodeJS function and save to database with status column active/inactive)
