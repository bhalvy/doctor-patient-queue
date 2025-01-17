# MVP Video Signalling Application

This application pairs up waiting patients with available doctors using WebSockets 
for signaling a WebRTC video connection. 

## Installation Instructions
Install Dependencies
````
npm install
````
Start Redis and Mongo DB from docker images
````
npm run start-datastore
````
Start Application
````
npm run start
````
Once the server is running the doctors currently 'on shift' will be loaded and ready to see patients.

### There are 2 ways to add patients

```http://localhost:3000```

This will create one socket for that browser window. There is no styling on the page. Basic Connection Info is shared in console.

````http://localhost:3000/patient/{number}````

This will create mock socket connections in the amount of {number}

Example: http://localhost:3000/patient/100

## Featured In This MVP

- Establish WebSocket Connection Between the Server and Patient 
- "Appointment Matcher" Pairs up available Doctors to Patients using Redis Bull Queues
- API's for Doctor, Patient, and Admin
- Seeded DB with Doctors that include 'shifts'
- Cleaning up Stale / Failed Connections
- Ability to add multiple Patients at a time w/ mocked Socket Connection
  
## NOT Featured In This MVP

- Queue Optimization
  - Doctors are cycled with no available patients in a "round robin" strategy
  - Patients Are Handled on a "last in last out" strategy.
- Actually Creating the WebRTC Connection Between Doctor and Patient
- Mechanism from Doctor side to connect with WebRTC
  - This would be a request from the Doctor UI Client passed to Patient to complete the WebRTC connection.
- Full Doctor / Patient Data Models
  - This would be part of a larger distributed system where data is modeled elsewhere.
- Reconnecting Failed / Dropped Connections
- CronJob to add/remove Doctors based on their 'shift'
- Connection 'Receipts' in mongo database
- No Tests :(

## Notes on Architecture

- The core of the application could be changed easily to ingest SQS or other Queue services. 
- This application is intended to run as a docker container, in actual production multiple enhancements would be necessary
- To run the application in a multiple container environment:  
  1. Abstract the "Appointment Matcher" to its own application.
  2. Make the "Appointment Matcher" smart enough to alert the correct container holding the Socket connection with the Patient. 
  