![maven build status](https://github.com/Thibaut-Mouton/react-spring-messenger-project/workflows/build-back/badge.svg?branch=develop)
![npm build status](https://github.com/Thibaut-Mouton/react-spring-messenger-project/workflows/build-front/badge.svg?branch=develop)
![coverage back](https://github.com/Thibaut-Mouton/react-spring-messenger-project/workflows/test-back/badge.svg?branch=develop)
![coverage front](https://github.com/Thibaut-Mouton/react-spring-messenger-project/workflows/test-front/badge.svg?branch=develop)

# FastLiteMessage

Real time chat application group oriented built with React and Spring Boot. Talk with your friends, create and add users to conversation, send messages or images, set groups administrators and start video calls ! (coming soon)

# Project Requirements

* [JDK](https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html)  17
* [NodeJS](https://nodejs.org/en/download/) v20.12.1
* [ReactJS](https://reactjs.org/) v18
* [Material UI](https://mui.com/) v5.7.0
* [MySQL Server](https://www.mysql.com/)

# What's next ?
You want to know the roadmap of the project, next release or next fixes ? Check the "Projects" tab or visit the [Fast Lite Message's roadmap](https://github.com/users/Thibaut-Mouton/projects/4)

# Project fast start up
In a hurry ? Juste type ```docker-compose up``` in the root directory.
This will start 3 containers : MySQL, backend and frontend together.  Liquibase will take care of the database setup. For development purpose, the DB is filled with 5 accounts (password: ```root```) :
* Thibaut
* Mark
* John
* Luke
* Steve
```
Warning : Be sure that no other app is running on port 3000, 9090 or 3306
```

# Project development set up

* This project use [liquibase](https://www.liquibase.org/) as a version control for database. When you will start backend, all tables and structures will be generated automatically.
* You can disable Liquibase by setting ```spring.liquibase.enabled=false``` in ```application.properties```.
* To try the project on localhost, check that nothing runs on ports 9090 (Spring Boot) and 3000 (React app)
* You can edit ````spring.datasource```` in ```backend/src/main/resources/application.properties```  and ```username``` and ```password``` in ```backend/src/main/resources/liquibase.properties``` with your own MySQL login / password 
* Create a database named "fastlitemessage_dev" or you can also modify the name in the properties files mentioned just above.

## Start backend
* Go inside backend folder then type  ```mvn spring-boot:run``` to launch backend.
* Or you can type ```mvn clean package``` to generate a JAR file and then start server with ```java -jar path/to/jar/file``` (Normally in inside backend/target/) 
## Start frontend
* Go inside frontend-web folder and then type ```npm run start```

# Disclaimer
* Please note there is no specific security over websockets.
* Docker setup is not production ready

# Project overview

![Project overview](assets/flm.PNG?raw=true "Project overview 1")

![Project overview](assets/flm2.PNG?raw=true "Project overview 2")

* Simple chat group application
* Send images
* Start video calls
* Secure user account
* Room discussion
* Chat group administrators
* Add / remove users from conversation 
