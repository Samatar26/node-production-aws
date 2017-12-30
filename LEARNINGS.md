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