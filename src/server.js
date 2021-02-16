const express = require("express");
const cors = require("cors");
const listEndpoints = require("express-list-endpoints");
const mongoose = require("mongoose");

const booksRoutes = require("./services/books");
const cartsRoutes = require("./services/carts");
// const commentsRoutes = require("./services/comments");
const usersRoutes = require("./services/users");

const {
  notFoundHandler,
  badRequestHandler,
  genericErrorHandler,
} = require("./errorHandlers");

const server = express();

const port = process.env.PORT || 3003; // the fallback is for local development, heroku will use his own port, something like 12312, because imagine how many processes are running on the same machine there

server.use(express.json());

const whiteList = [process.env.FE_URL];
const corsOptions = {
  origin: function (origin, callback) {
    if (whiteList.indexOf(origin) !== -1) {
      // allowed
      callback(null, true);
    } else {
      // Not allowed
      callback(new Error("NOT ALLOWED - CORS ISSUES"));
    }
  },
};
server.use(cors(corsOptions)); // CROSS ORIGIN RESOURCE SHARING

//ROUTES

server.use("/books", booksRoutes);
server.use("/carts", cartsRoutes);
// server.use("/comments", commentsRoutes);
server.use("/users", usersRoutes);

// ERROR HANDLERS
server.use(badRequestHandler);
server.use(notFoundHandler);
server.use(genericErrorHandler);

console.log(listEndpoints(server));

mongoose
  .connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(
    server.listen(port, () => {
      if (process.env.NODE_ENV === "production") {
        console.log("Running on cloud on port", port);
      } else {
        console.log(`Running locally on url http://localhost:${port}`);
      }
    })
  );
