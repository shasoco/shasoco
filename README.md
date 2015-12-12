# shasoco

<sup>develop:</sup>[![Circle CI develop](https://circleci.com/gh/shasoco/shasoco/tree/develop.svg?style=svg)](https://circleci.com/gh/shasoco/shasoco/tree/develop)
[![Coverage Status](https://coveralls.io/repos/shasoco/shasoco/badge.svg?branch=develop&service=github)](https://coveralls.io/github/shasoco/shasoco?branch=develop)
<sup> / </sup>
<sup>master:</sup>[![Circle CI master](https://circleci.com/gh/shasoco/shasoco/tree/master.svg?style=svg)](https://circleci.com/gh/shasoco/shasoco/tree/master)
[![Coverage Status](https://coveralls.io/repos/shasoco/shasoco/badge.svg?branch=master&service=github)](https://coveralls.io/github/shasoco/shasoco?branch=master)

Easily manage your Shared-Source Consortium infrastructure

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

### First deployment

1. shasoco create v0 fovea.cc
1. shasoco prepare v0
1. shasoco up v0
1. shasoco activate v0

### Backup / Restore

1. shasoco backup v0 mybackup
1. shasoco backup list
1. shasoco restore v0 v0/mybackup

### Upgrade

1. shasoco deactivate
1. shasoco backup v0 upgrade1
1. shasoco create v1 fovea.cc
1. shasoco prepare v1 --no-pull
1. shasoco up v1
1. shasoco restore v1 v0/upgrade1
1. shasoco activate v1
1. shasoco rm v0 --delay=10000

### Help

For the list of supported command line options:

    shasoco help [command]

## Test

The `test` script uses vagrant to perform high-level integration tests on a fresh VM.

    ./test

It'll build the image from the current working-tree.
