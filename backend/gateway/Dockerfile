FROM maven:3.9-amazoncorretto-8-alpine as build
COPY . .
RUN mvn package -f backend/pom.xml

FROM amazoncorretto:17.0.17-al2023-headless

LABEL maintainer="Thibaut MOUTON <thibautmouton22@gmail.com>"

COPY --from=build /backend/gateway/targets/*.jar flm.jar

ENTRYPOINT ["java","-jar","/flm.jar"]