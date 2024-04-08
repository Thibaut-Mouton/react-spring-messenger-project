FROM debian:latest

MAINTAINER Thibaut MOUTON <thibautmouton22@gmail.com>

# replace shell with bash so we can source files
RUN rm /bin/sh && ln -s /bin/bash /bin/sh

RUN apt-get update && apt-get install -y curl  \
    && apt-get -y autoclean  \
    && apt-get install procps  \
    && apt-get install git \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get install -y --no-install-recommends openjdk-11-jre

# nvm environment variables
ENV NVM_DIR /root/.nvm
ENV NODE_VERSION 20.12.1

RUN curl --silent -o- https://raw.githubusercontent.com/creationix/nvm/v0.39.7/install.sh | bash

# install node and npm
RUN source $NVM_DIR/nvm.sh \
    && nvm install $NODE_VERSION \
    && nvm alias default $NODE_VERSION \
    && nvm use default

# add node and npm to path so the commands are available
ENV NODE_PATH $NVM_DIR/v$NODE_VERSION/lib/node_modules
ENV PATH $NVM_DIR/versions/node/v$NODE_VERSION/bin:$PATH

# confirm installation
RUN node -v
RUN npm -v
RUN java --version

ENTRYPOINT ["tail", "-f", "/dev/null"]
