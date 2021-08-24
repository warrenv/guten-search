### Introduction

This project provides a UI for searching books from project gutenberg.
It allows searching and filtering over various criteria.

NOTE: This project is not complete!

## Install

Create a folder of your choosing and clone this repo inside.

```bash
  $ mkdir govspend
  $ cd govspend
  $ git clone REPO
```

## Pre-requisites

- A web browser.
- The curl command.
- A container orchestrator. The instructions below use podman.
- A local copy of project gutenberg. Retrieve it using this command:

```bash
  $ bin/sync_gutenberg_txts.sh
```

## Starting the Containers

Each of the services runs in it's own container.

```bash
  $ bin/start_mongo.sh -d
  $ bin/start_es.sh -d
```

## Loading or Reloading Data

The command below loads a subset of all books and takes about 3 minutes
to run.  To load all books, omit the second argument in the es_inmport.sh
command below.

```bash
  # load catalog
  $ (source bin/vars.sh; podman exec -it ${PREFIX}_mongodb /data/bin/mongo_import.sh)

  # load book data.
  $ bin/es_import.sh gutenberg-books gutenberg/9
```

## Accessing the User Interface

Open localhost:NNNN in a browser.

## The Tech Stack

  - a database holding meta information about each book (mongo).
  - a database indexing every book's contents (elasticsearch).
  - an api server handling requests from the frontend (feathersjs).
  - a web frontend (react components).

