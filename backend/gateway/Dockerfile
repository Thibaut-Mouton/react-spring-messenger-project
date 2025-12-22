FROM maven:3.9-amazoncorretto-8-alpine as build
COPY . .
# At this level, we already are in backend/gateway
RUN mvn package

FROM amazoncorretto:17.0.17-al2023-headless

LABEL maintainer="Thibaut MOUTON <thibautmouton22@gmail.com>"

COPY --from=build targets/*.jar flm.jar

ENTRYPOINT ["java","-jar","/flm.jar"]