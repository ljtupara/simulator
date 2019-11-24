# simulator

> Battle simulator

## About

This project uses [Feathers](http://feathersjs.com). An open source web framework for building modern real-time applications.

## Getting Started

For starting simulator following steps need to be performed

1. Make sure you have [NodeJS](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed. 
2. Make sure you have installed mongodb and that it is running on localhost:27017 
3. Install your dependencies

    ```
    cd path/to/simulator
    npm install
    ```

4. Start application

    ```
    npm start
    ```
5. In new terminal start simulator

    ```
    npm run-script simulator
    ```

## API calls

There are three feathers services. Game, army and battlog. Here are some actions that can be performed

1. Add army

   ```
    POST /army
    { "name": "First Army",
      "attackStrategy" : "Random",
      "startingUnits" : 85
    }
   ```

2. List games

   ```
    GET /game
   ```
3. Start game
   
   ```
    POST /army
    {
      "status": "InProgress",
      "name": "First game"
    }
   ```

4. Retrive specific game log   ```
   
   ```
    GET /battlelog/?gameRef=5dda9953db419a6597839d21&$sort[createdAt]=1

   ```

5. Reset game

   ```
    PATCH /game/5dda9953db419a6597839d21
    { "action": "reset" }
   ```