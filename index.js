const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const auth = require("./src/routing/auth");
const employee = require("./src/routing/employee");
const dashboard = require("./src/routing/dashboard");
const logger = require("./src/middleware/winston");

dotenv.config();

app.use(cors());

app.use(bodyParser.json());

app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

app.use("/api/auth", auth);
app.use("/api/employee", employee);
app.use("/api/dashboard", dashboard);



app.use(function (err, req, res, next) {
    logger.error(err.message)
    res.status(422).send({ error: err.message });
});

app.listen(process.env.PORT, function () {
    console.log("now listening for requests at " + process.env.PORT);
});
app.timeout = 20;