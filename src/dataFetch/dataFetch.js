const logger = require('../middleware/winston')
const pool = require('../utils/dbConnection')

module.exports = async function dataFetch(query, params, logDetails) {
    try {
        let queryResult = await pool.query(query, params)
        logger.info(logDetails)
        return queryResult
    }
    catch (error) {
        logger.error(`message : ${error.message}, params : ${params}`)
        return error
    }
}



