FROM node:5.0.0
RUN curl -L https://github.com/docker/compose/releases/download/1.5.1/docker-compose-`uname -s`-`uname -m` > /usr/local/bin/docker-compose && chmod +x /usr/local/bin/docker-compose
COPY package.json /shasoco/package.json
WORKDIR /shasoco
RUN npm install
COPY bin /shasoco/bin
COPY compose /shasoco/compose
COPY lib /shasoco/lib
