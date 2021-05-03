const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const logger = require('../middleware/winston');
const query = require('../dataFetch/queries/auth')
const dataFetch = require('../dataFetch/dataFetch')
var SimpleCrypto = require("simple-crypto-js").default
dotenv.config();
const crypto = new SimpleCrypto(process.env.CRYPTO_KEY)


const getLoginDetails = async (email, next) => {
    return await dataFetch(query.LOGIN, [email], "get login data", next);
}


// LOGIN AUTHENTICATION
router.post("/login", async (request, response, next) => {
    var email = request.body.email;
    var password = crypto.decrypt(request.body.password)
    try {
        let data = await getLoginDetails(email, next)
        if (data.rows.length > 0) {
            bcrypt.compare(password, data.rows[0].password, async (err, result) => {
                if (result) {
                    const token = jwt.sign({
                        id: data.rows[0].login_id,
                    }, process.env.SECRET);
                    const tokenDate = new Date().toString();
                    let tokenData = JSON.stringify({ createdDate: tokenDate, token: token })
                    await dataFetch(query.UPDATE_LOGIN, [tokenData, data.rows[0].login_id], "update login token", next);
                    return response.status(200).json({
                        token: token,
                    });
                } else {
                    response.status(401).json({
                        message: "Invalid email or password"
                    })
                }
            })
        } else {
            response.status(401).json({
                message: "Invalid email or password"
            })
        }
    } catch (Exception) {
        logger.error(`User login, error:${Exception}`)
        next(Exception);
    }
})


//USER REGISTRATION
router.post('/register', async (request, response, next) => {
    let password = crypto.decrypt(request.body.password)
    let email = request.body.email;
    let name = request.body.name;
    try {
        let loginData = await getLoginDetails(email, next)
        if (loginData.rows.length === 0) {
            bcrypt.hash(password, 10, async function (err, hash) {
                if (err) {
                    response.status(500).json({
                        error: err
                    });
                } else {
                    let data = await dataFetch(query.INSERT_LOGIN, [email, hash], "insert to login", next);
                    let userData = await dataFetch(query.INSERT_USER, [name, email, data.rows[0].login_id], "insert to user", next)
                    response.status(200).send(userData)
                }
            })
        } else {
            response.status(409).json({
                message: "Email already exists"
            })
        }

    } catch (Exception) {
        logger.error(`User registraton, error:${Exception}`)
        next(Exception);
    }
})




module.exports = router;

