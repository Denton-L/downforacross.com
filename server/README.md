## Server architecture

### Main website

- Prod: statically hosted via `serve`, host = downforacross.com
- Dev: localhost:3020

### http server (host = downforacross.com)

- Prod: TBD, probably downforacross.com/api??, probably a separate process
- Dev: localhost:3020 (using [CRA proxy](https://create-react-app.dev/docs/proxying-api-requests-in-development/))

### websocket server

- Prod: TBD, probably downforacross.com/ws??, probably a separate process
- Dev: localhost:3020 (using [CRA proxy](https://create-react-app.dev/docs/proxying-api-requests-in-development/))
- Responsibilities
  - MVP: Handle pub/sub for game events

### Database

All game events are stored in postgres
Postgres schemas:

```
CREATE DATABASE dfac;
\c dfac;
CREATE TABLE game_events(
  gid text,
  uid text,
  ts timestamp without time zone,
  event_type text,
  event_payload json
);
```

### Getting Started

#### Run your local db

1. Install postgres
   (mac) `brew install postgres`
2. Run postgres
   (mac) `brew services start postgres`

#### Initialize your local db:

1. Create the database

```
psql -c 'create database dfac'
```

(`createdb` if this fails)

2. Create the game_events table

```
psql dfac < create_game_events.sql
```

#### Run your local websocket server

`yarn devbackend`
This command expects you to have PGDATABASE env var set and a postgres server running. See `.envrc.template`.

#### Run your local frontend server

`yarn devbackend`

This should open localhost:3020.

#### Test manually

1. Create a game by clicking a puzzle in the homepage `localhost:3020/`
2. You should start seeing a stream of events in your backend process's logs
3. You can also introspect the database manually (e.g. using psql or pgadmin)
