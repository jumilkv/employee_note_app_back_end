const express = require("express");
const router = express.Router();
const logger = require('../middleware/winston');
const query = require('../dataFetch/queries/dashboard')
const verifyToken = require('../middleware/checkAuthorization');
const dataFetch = require('../dataFetch/dataFetch')

//GET EMPLOYEES COUNT
router.get('/:userId', verifyToken, async (request, response, next) => {
    try {
        let total = await dataFetch(query.GET_EMPLOYEES, [request.params.userId], "get employees all list", next);
        let active = await dataFetch(query.GET_STATUS_FILTERED_EMPLOYEES, [true, request.params.userId], "get acitve employees list", next);
        let inactive = await dataFetch(query.GET_STATUS_FILTERED_EMPLOYEES, [false, request.params.userId], "get inactive employees list", next);
        response.status(200).send({ total: total.rows.length, active: active.rows.length, inactive: inactive.rows.length });
    } catch (Exception) {
        logger.error(`Get employee count, error:${Exception}`)
        next(Exception);
    }
})
module.exports = router;

