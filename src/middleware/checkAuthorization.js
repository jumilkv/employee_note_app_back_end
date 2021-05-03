const jwt = require('jsonwebtoken');
const pool = require('../utils/dbConnection')


function diff_hours(dt2, dt1) {
    var diff = (dt2.getTime() - dt1.getTime()) / 1000;
    diff /= (60 * 60);
    return Math.abs(Math.round(diff));
}

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        pool
            .query("SELECT * FROM login WHERE login_id=$1", [decoded.id])
            .then(data => {
                if (
                    (token === data.rows[0].token.token) &&
                    (diff_hours(new Date(), new Date(data.rows[0].token.createdDate)) < 24)
                ) {
                    req.tenantData = decoded;
                    next();

                } else {
                    return res.status(401).json({
                        message: 'Auth failed'
                    })
                }
            }).catch(err => {
                return res.status(401).json({
                    message: 'Auth failed'
                });
            });
    } catch (error) {
        return res.status(401).json({
            message: 'Auth failed'
        });
    }


};