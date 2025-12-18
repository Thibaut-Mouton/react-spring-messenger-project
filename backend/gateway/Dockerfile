FROM amazoncorretto:17.0.17-al2023-headless

LABEL maintainer="Thibaut MOUTON <thibautmouton22@gmail.com>"

COPY ./targets/gateway/gateway-1.4.0.jar flm.jar

ENTRYPOINT ["java","-jar","/flm.jar"]