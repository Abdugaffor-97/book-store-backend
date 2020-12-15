const express = require("express");
const cors = require("cors");
const listEndpoints = require("express-list-endpoints");

const booksRoutes = require("./services/books");
const commentsRoutes = require("./services/comments");

const {
  notFoundHandler,
  badRequestHandler,
  genericErrorHandler,
} = require("./errorHandlers");

const server = express();

const port = process.env.PORT || 3001; // the fallback is for local development, heroku will use his own port, something like 12312, because imagine how many processes are running on the same machine there

server.use(express.json());

const whiteList =
  process.env.NODE_ENV === "production"
    ? [process.env.FE_URL_PROD]
    : [process.env.FE_URL_DEV];

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
server.use("/books", commentsRoutes);

// ERROR HANDLERS
server.use(badRequestHandler);
server.use(notFoundHandler);
server.use(genericErrorHandler);

console.log(listEndpoints(server));

server.listen(port, () => {
  if (process.env.NODE_ENV === "production") {
    console.log("Running on cloud on port", port);
  } else {
    console.log(`Running locally on port http://localhost:${port}`);
  }
});
