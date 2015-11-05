# shasoco
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

## CLI interface

Shasoco requires the latest version of docker.

To install the cli tool:

    $ curl “http://whatever” > /usr/bin/shasoco
    $ chmod +x /usr/bin/shasoco

Find below the supported command line options.


### *$ shasoco deploy myconsortium.org [--port 80] [--version 1.0.1] [--from-backup backup_20151231.tgz]*

 - Start the services
 - Exposes them on port 80 (default)
 - Wordpress can be accessed at www.DOMAIN, gitlab at gitlab.DOMAIN, etc.

### *$ shasoco ps*

List running stacks.
Example output: myconsortium.org apache.org

### *$ shasoco upgrade myconsortium.org [--version 1.4.24]*

 - Update services (images) at a given shasoco version
 - Run upgrade scripts for each service
 - Restart the stack

The services can be unavailable during the upgrade.

### *$ shasoco backup myconsortium.org --output backup_20151231.tgz*

Save a backup to disk.

### *$ shasoco restore myconsortium.org --from-backup backup_20151231.tgz*

Requires that the backup be the same shasoco version than the running stack.

### *$ shasoco stop myconsortium.org*

Stop the servers, do not destroy data.

### *$ shasoco rm myconsortium.org*

Delete all data. But not the backups!


## Internal details / ideas

The shasoco tool can:

 - be written in bash / python.
 - run into a privileged docker container.
   - the shasoco image can be pulled during upgrade and deploy.
   - --version can be used to force running a given docker tag of the shasoco image.
   - docker-compose itself can be run from this docker image

### Content of a backup

VERSION - version number of shasoco running this backup
volumes/ - content of data-containers volumes

### Various discoveries

A infrastructure project with gitlab, ldap and fusiondirectory (ldap manager) https://github.com/kodare/infrastructure
Probably a good starting point.
