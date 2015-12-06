FROM node:5.0.0
RUN export DEBIAN_FRONTEND=noninteractive && \
    export LC_ALL=en_US.UTF-8 && \
    echo deb http://apt.dockerproject.org/repo debian-jessie main >> /etc/apt/sources.list && \
    apt-key adv --keyserver hkp://p80.pool.sks-keyservers.net:80 --recv-keys 58118E89F3A912897C070ADBF76221572C52609D && \
    apt-get update && \
    apt-get install -y docker-engine && \
    rm -rf /var/lib/apt/lists/* && \
    curl -L https://github.com/docker/compose/releases/download/1.5.1/docker-compose-`uname -s`-`uname -m` > /usr/local/bin/docker-compose && chmod +x /usr/local/bin/docker-compose
COPY package.json /shasoco/package.json
WORKDIR /shasoco
RUN npm install
COPY bin /shasoco/bin
COPY compose /shasoco/compose
COPY lib /shasoco/lib
