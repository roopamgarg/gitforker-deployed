const express = require("express");
const app = express();
const cors = require("cors");
const socket = require("socket.io");
const expressGraphQL = require("express-graphql");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
var server = require("http").Server(app);
const siofu = require("socketio-file-upload");
app.use(siofu.router)

// var app = require('http').createServer()
var io = module.exports.io = require('socket.io')(server)

const path = require("path");

const models = require("./models");
 
const passportConfig = require("./services/auth");
const MongoStore = require("connect-mongo")(session);
const schema = require("./schema/schema");
const { MONGO_URI } = require("./config/keys");

app.use(cors());
const PORT = process.env.PORT || 4000;
// Mongoose's built in promise library is deprecated, replace it with ES2015 Promise
mongoose.Promise = global.Promise;

// Connect to the mongoDB instance and log a message
// on success or failure
mongoose.connect(MONGO_URI, { useNewUrlParser: true });
mongoose.connection
  .once("open", () => console.log("Connected to MongoLab instance."))
  .on("error", error => console.log("Error connecting to MongoLab:", error));

// Configures express to use sessions.  This places an encrypted identifier
// on the users cookie.  When a user makes a request, this middleware examines
// the cookie and modifies the request object to indicate which user made the request
// The cookie itself only contains the id of a session; more data about the session
// is stored inside of MongoDB.

app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: "aabbcc",
    store: new MongoStore({
      url: MONGO_URI,
      autoReconnect: true
    })
  })
);

// Passport is wired into express as a middleware. When a request comes in,
// Passport will examine the request's session (as set by the above config) and
// assign the current user to the 'req.user' object.  See also servces/auth.js
app.use(passport.initialize());
app.use(passport.session());

// Instruct Express to pass on any request made to the '/graphql' route
// to the GraphQL instance.
app.use(
  "/graphql",
  expressGraphQL({
    schema,
    graphiql: true
  })
);
require("./routes/auth")(app);
require("./routes/invite")(app);


app.use(express.static("build"));

app.get("/*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "..", "..", "build", "index.html"));
});
// app.get("/dashboard/*", (req, res) => {
//   res.sendFile(path.resolve(__dirname, "..", "..", "build", "index.html"));
// });

server.listen(PORT, () => {
  console.log("Server is started!",process.env.NODE_ENV);
});


const SocketManger = require('./SocketManager')
io.on("connect", SocketManger) 
