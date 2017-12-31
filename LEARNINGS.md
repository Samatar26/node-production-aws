### Express Web Server

When disabling headers, there are two types of syntax available to you:

```js
app.set('x-powered-by', false)
app.disable('x-powered-by')
```


### Morgan
Morgan is a HTTP request logger middleware for Node.js. It simplifies the process of logging requests to your applications and it's default behaviour is to output the request details to stdout.

Example usage:
`morgan(format, options)`

###### Format
The `format` argument may be a string of a predefined format, i.e.:

- combined
  - Standard Apache combined log output: `:remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"`
- common
  - Standard Apache common log output: `:remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length]`
- dev
  - Concise output coloured by response status for dev use: `:method :url :status :response-time ms - :res[content-length]`
- short
  - Shorter than default, also in res time: `:remote-addr :remote-user :method :url HTTP/:http-version :status :res[content-length] - :response-time ms`
- tiny
  - The minimal output: `:method :url :status :res[content-length] - :response-time ms`

###### Options
Morgan accepts the following properties in the options object:
- immediate
  - write log line on request instead of response.
- skip
  - function to determine if logging should be skipped
- stream
  - Output stream for writing log lines, defaults to `process.stdout`

###### Tokens
You can also create new tokens, or overwrite existing ones by invoking:
```js
morgan.token()
```
Example usage within your app:
```js
app.use(morgan('combined'))
```

Example of writing logs to file:

```js
// create a write stream (in append mode)
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {flags: 'a'})

// setup the logger
app.use(morgan('combined', {stream: accessLogStream}))
```

### NPM Scripts & Elastic Beanstalk

Elastic Beanstalk is going to be our deployment environment. The three npm scrips that elastic beanstalk cares about are:

- start: create Node process for the ec2 instance
- prestart: run prior to start command
- poststart: run after start command

### Webpack-dev-server and style loader

Style loader adds css to the dom by injecting a style tag into the head of the HTML document. It doesn't emit a separate css bundle. You can configure webpack-dev-server in your webpack config by adding the `devServer` key to your config, like so:

```js
devServer: {
  publicPath: '/public/',
  port: 9000,
},
```

### Sequelize & PostgreSQL

Postgres is a feature-rich relational database which can do a lot of interesting things that javascript can take advantage of. Particularly with its JSON fields allowing you within a table to have a rich query like an unstructured queryable column with JSON data embedded in it.

It also allows us to use _**RDS**_, which is the managed relational database service from Amazon, which is very performant and available.

When using a relational database with Node.js, you'll probabaly going to go one of two routes and that's either use a driver for your database directly, i.e. pg, postgresql or a MySQL driver directly and maybe execute raw sql against it or maybe use a sql builder. _**But**_ if you're using an ORM and Node.js you're probably going to use _**sequelize**_. Its' probably the most feature-rich ORM out there for Node.js today. Sequelize features:

- Promise-based interface
- Support for migrations
- Smaller community, hence fewer resources


###### .sequelizerc
When you're using the sequelize-cli to execute commands in your dev environment, the _**.sequelizerc**_ file configures some of the key parts of that experience, like:

- Where your database configuration is going to live
- when the cli tool generates migrations, where to put these migrations
- Where it's going to look for models that have been defined or will be defined using the cli.

When you do execute the sequelize cli commands at the top of the directory, it's going to take those settings into effect.

Example .sequelizerc
```js
const path = require('path');
module.exports = {
  config: path.resolve('db', 'database.js'),
  'migrations-path': path.resolve('db', 'migrations'),
  'models-path': path.resolve('src', 'server', 'models')
};

```

Sequelize requires database configuration to be specified in a specific way and we have defined the necessary config for sequelize in _**./db/database.js**_. We read the real configuration values from our config setup, but then we populate things like the database url and the dialect.


```js
// Our application's configuration lives in ../config, but our database config
// for Sequelize CLI operations lives in this file. Pull in database config
// from our main config - this file should never have to change.
const config = require('../config');

// Configuration object for Sequelize migrations - we configure these separately
// elsewhere based on the current NODE_ENV, because our app's config object is
// not structured to have separate "production" or "test" properties
let sequelizeConfig = { url: config.databaseUrl, dialect: 'postgres' };
sequelizeConfig.production = sequelizeConfig;
sequelizeConfig.test = sequelizeConfig;
sequelizeConfig.development = sequelizeConfig;

// Export final database config
module.exports = sequelizeConfig;
```

###### Migrations
When you generate a new model or a new migration which mutates the state of the database from one state to another, those files are going to be generate in our _**db/migrations**_ folder. A migration file name is built of:

- _**timestamp**_
  - This is the actual identifier/record for the migration and it's how the sequelize or the ORM engine knows which migrations have been applied and which haven't been applied. It's important and generated by sequelize when you generate a new migration.
- _**Description**_
  - This part is for humans and should describe what the migration is about

_**Example migration filename**_: `20160824174754-create-todo.js`

Every migration exports a JavaScript object that has two functions _**up**_ and _**down**_. When we're migrating the database to the next version the up function is called and that function is called a `sequelize query interface` which has methods that let you create tables or add columns to existing tables. So as you're mutating the data model over time, you'll be able to specify these functions to go up and down.

```js
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('Todos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.TEXT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('Todos');
  }
};
```

###### Models
In the models folder inside our src directory, we have a `db.js` and `todo.js` file. In `db.js`, we create a single instance of a sequelize object, and that object takes in the constructor a postgres database url, that will have the username and password embedded inside of it. We're also passing in the options for that connection to the database which we're loading in from our configuration. _**So the database object is used to define all the other models in our application.**_

```js
//  models/db.js

const Sequelize = require('sequelize');
const config = require('../../../config');

// Create shared instance to be used across models
let db = new Sequelize(config.databaseUrl, config.databaseOptions);

module.exports = db;

```
Our configuration contains pretty much the defaults that sequelize provides. The development postgres url. _**The database options are arguments to the sequelize constructor**_ saying:

- We want to use the _**postgres dialect**_
- By default we don't want to _**log every SQL statement out to the console.**_ We do however log SQL statements out to the console in the dev environment.
- We also configure _**sequelize's connection pool.**_ This specifies how long a connection is held, that's idle before it's deleted from the pool. And the max and min number of concurrent connections allowed to the database.

```js
//  config/index.js
'use strict';

// Application configuration - environment settings here are the same across
// all environments. To override settings locally, move "user.example.js" to
// "user.js"
let config = {};

// ---------------------------------------------------------------
// Config values common across environments (overridable defaults)
// ---------------------------------------------------------------

// HTTP port for Express
config.port = process.env.PORT || 3000;

// Options for Sequelize ORM connection - overrides in production and test
// environments
config.databaseUrl = 'postgres://localhost:5432/todos';
config.databaseOptions = {
  dialect: 'postgres',
  logging: false,
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  }
};


// ----------------------------------------------------
// Assign values based on current execution environment
// ----------------------------------------------------
let environmentSettings = {};
switch (process.env.NODE_ENV) {
  case 'production': environmentSettings = require('./production'); break;
  case 'test': environmentSettings = require('./test'); break;
  default: environmentSettings = require('./development'); break;
}
config = Object.assign(config, environmentSettings);


// ---------------------------------------
// Override with user settings, if present
// ---------------------------------------
try {
  let userSettings = require('./user');
  config = Object.assign(config, userSettings);
} catch(e) {
  // nbd if we don't have user settings
}

// Export final configuration object
module.exports = config;
```

We currently have one model, which is our todo model. We need to require the sequelize module, because we need some class-level variables off of that as we define the model. We create a new model by calling `db.define`. The only attribute we're adding is the title, although models by default also have an ID, which is an `auto-incrementing primary key` in the database. It also has a created at and updated at timestamp.

So we export that model object and it's what we use elsewhere in our application to actually do queries and updated data. Like in `controllers/todos.js`.

```js
// models/todo.js
const Sequelize = require('sequelize');
const db = require('./db');

let Todo = db.define('Todo', {
  title: Sequelize.TEXT
});

module.exports = Todo;

```

```js
//  controllers/todo.js

// Fetch all TODOs
exports.all = (request, response) => {
  Todo.findAll({
    limit: 1000,
    order: [ ['createdAt', 'ASC'] ]
  }).then((todos) => {
    response.send(todos);
  }).catch((error) => {
    response.status(500).send(error);
  });
};
// Create a TODO
exports.create = (request, response) => {
  Todo.create({
    title: request.body.title
  }).then((todo) => {
    response.send(todo);
  }).catch((error) => {
    response.status(500).send(error);
  });
};
```

##### Some gotchas
As you're creating migrations that mutate the state of the underlying tables that back your models, you'll have to keep that in sync with what's actually defined in your model. So if you create a migration that adds a property to a model, you'll have to make sure to add that same property to your model declaration.