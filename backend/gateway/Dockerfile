FROM maven:3.9-amazoncorretto-8-alpine as build
COPY . .
# At this level, we already are in backend
RUN mvn package

FROM amazoncorretto:23.0.2-al2023-headless

LABEL maintainer="Thibaut MOUTON <thibautmouton22@gmail.com>"

COPY --from=build gateway/target/*.jar flm.jar

ENTRYPOINT ["java","-jar","/flm.jar"]