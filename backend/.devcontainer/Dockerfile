FROM debian:latest

MAINTAINER Thibaut MOUTON <thibautmouton22@gmail.com>

# replace shell with bash so we can source files
RUN rm /bin/sh && ln -s /bin/bash /bin/sh

RUN apt-get update && apt-get install -y curl  \
    && apt-get -y autoclean \
    && apt-get -y install procps \
    && apt-get -y install git \
    && apt-get -y install openjdk-17-jdk \
    && rm -rf /var/lib/apt/lists/*

# confirm installation
RUN node -v
RUN npm -v
RUN java --version

ENTRYPOINT ["tail", "-f", "/dev/null"]