# shasoco
Easily manage your Shared-Source Consortium infrastructure

 * master: [![Circle CI](https://circleci.com/gh/shasoco/shasoco/tree/master.svg?style=svg)](https://circleci.com/gh/shasoco/shasoco/tree/master)
 * develop: [![Circle CI](https://circleci.com/gh/shasoco/shasoco/tree/develop.svg?style=svg)](https://circleci.com/gh/shasoco/shasoco/tree/develop)

## Vision

Shasoco is a solution for managing a shared-source consortium infrastructure:

 - self-hosted
 - based on open technologies

It is developed as a utility on the command line.

## Features

 - easy to deploy
 - easy to upgrade
 - easy to migrate

## Services

 1. wordpress
 2. LDAP server (fusiondirectory)
 3. gitlab community
 4. redmine
 5. forum
 6. https file server (with authentication)

Service 3,4,5,6 use the LDAP server for authentication (same login/password for all services)

A reverse proxy (nginx/haproxy) do the routing depending on the hostname.

## Installation

Shasoco's only requirement is to have latest version of docker installed on the host.

To install `shasoco` globally, execute the below:
```
curl https://raw.githubusercontent.com/shasoco/shasoco/master/shasoco | sudo tee /usr/local/bin/shasoco && sudo chmod +x /usr/local/bin/shasoco
```

## Usage

Find below the supported command line options.

## Test

The `test` script uses vagrant to perform high-level integration tests on a fresh VM.

    ./test

It'll build the image from the current working-tree.
