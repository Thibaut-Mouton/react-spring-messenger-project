<div align="center">

![React logo](assets/react.png "React logo")
![Spring Boot logo](assets/springboot.png "Sprint boot logo")
</div>

# FastLiteMessage ![build status](https://github.com/Thibaut-Mouton/react-spring-messenger-project/workflows/maven/badge.svg?branch=master)

Real time chat application group oriented built with React and Spring Boot. Talk with your friends, create and add users to conversation, send messages or images, set groups administrators and start video calls ! (coming soon)

## Next version preview :

Changelog for next version :

- Change project from javascript to typescript
- Use of react Context instead of Redux for basic tasks (like theme)
- Improve websocket reliability (one topic to subscribe instead of 5)
- Fix bugs
- Cookies to store theme preference

## Start-up :

#### Project Requirements

- JDK 8
- NodeJS
- MySQL Server

#### Project set up

- This project use [liquibase](https://www.liquibase.org/) as a version control for database. When you will start backend, all tables and structures will be generated automatically.
- To try the project on localhost, check that nothing runs on ports 9090 (Spring Boot) and 3000 (React app)
- You can edit ````spring.datasource```` in ```backend/src/main/resources/application.properties```  and ```username``` and ```password``` in ```backend/src/main/resources/liquibase.properties``` with your own SQL login / password
- Create a database named "websocket" or you can also modify the name in the properties files mentioned just above.

##### Start server
- Go inside backend folder then type  ```mvn spring-boot:run``` to launch backend.
- Or you can type ```mvn clean package``` to generate a JAR file and then start server with ```java -jar path/to/jar/file``` (Normally in inside backend/target/)
##### Start frontend
- Go inside frontend-web folder and then type ```npm react-scripts start```

# Project overview

![Project overview](assets/messenger.jpg?raw=true "Project overview")

* Simple chat group application based on websocket
* Send images
* Secure user account based on Spring Security JWT
* Room discussion with STOMP and SockJS
* Chat group administrators
* Add / remove users from conversation
* Dark / Light Mode
