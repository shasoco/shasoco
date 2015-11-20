FROM node:5.0.0
COPY package.json /shasoco/package.json
WORKDIR /shasoco
RUN npm install
COPY bin /shasoco/bin
COPY lib /shasoco/lib
