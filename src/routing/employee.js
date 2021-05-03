const express = require("express");
const router = express.Router();
const logger = require('../middleware/winston');
const query = require('../dataFetch/queries/employee')
const verifyToken = require('../middleware/checkAuthorization');
const dataFetch = require('../dataFetch/dataFetch')

//EMPLOYEE REGISTRATION
router.post('/', verifyToken, async (request, response, next) => {
    let name = request.body.name;
    let email = request.body.email;
    let age = parseInt(request.body.age);
    let phone = request.body.phone;
    let address = request.body.address;
    let empId = request.body.empId;
    let userId = parseInt(request.body.userId)

    try {
        let empIdSearchData = await dataFetch(query.GET_EMPLOYEE_BY_EMP_ID, [empId, userId], "get employee data", next);
        if (empIdSearchData.rows.length > 0) {
            response.status(409).json({
                message: "Employee ID already exists",
                status: "error"
            })
        } else {
            let emailSearchData = await dataFetch(query.GET_EMPLOYEE_BY_EMAIL, [email, userId], "get employee data", next);
            if (emailSearchData.rows.length > 0) {
                response.status(409).json({
                    message: "Email already exists",
                    status: "error"
                })
            } else {
                let phoneSearchData = await dataFetch(query.GET_EMPLOYEE_BY_PHONE, [phone, userId], "get employee data", next);
                if (phoneSearchData.rows.length > 0) {
                    response.status(409).json({
                        message: "Phone number already exists",
                        status: "error"
                    })
                } else {
                    await dataFetch(query.INSERT_EMPLOYEE, [name, email, empId, age, address, phone, userId], "insert employee", next);
                    response.status(200).json({
                        message: `Successfully registered employee (${name})`,
                        status: "success"
                    })
                }
            }
        }

    } catch (Exception) {
        logger.error(`Employee registraton, error:${Exception}, body:${request.body}`)
        next(Exception);
    }
})

//UPDATE EMPLOYEE DETAILS
router.put('/update', verifyToken, async (request, response, next) => {
    let name = request.body.name;
    let email = request.body.email;
    let age = request.body.age;
    let phone = request.body.phone;
    let address = request.body.address;
    let empId = request.body.empId;
    let id = request.body.id;
    let userId = request.body.userId;

    try {
        let empIdSearchData = await dataFetch(query.GET_EMPLOYEE_BY_EMP_ID, [empId, userId], "get employee data", next);
        if (empIdSearchData.rows.filter(item => item.id !== id).length > 0) {
            response.status(409).json({
                message: "Employee ID already exists",
                status: "error"
            })
        } else {
            let emailSearchData = await dataFetch(query.GET_EMPLOYEE_BY_EMAIL, [email, userId], "get employee data", next);
            if (emailSearchData.rows.filter(item => item.id !== id).length > 0) {
                response.status(409).json({
                    message: "Email already exists",
                    status: "error"
                })
            } else {
                let phoneSearchData = await dataFetch(query.GET_EMPLOYEE_BY_PHONE, [phone, userId], "get employee data", next);
                if (phoneSearchData.rows.filter(item => item.id !== id).length > 0) {
                    response.status(409).json({
                        message: "Phone number already exists",
                        status: "error"
                    })
                } else {
                    let data = await dataFetch(query.UPDATE_EMPLOYEE, [name, email, empId, age, address, phone, id], "update employee", next);
                    response.status(200).json({
                        message: `Employee (${name}) data successfully updated`,
                        status: "success"
                    });
                }
            }
        }
    } catch (Exception) {
        logger.error(`Update employee data, error:${Exception}, body: ${request.body}`)
        next(Exception);
    }
})

//UPDATE EMPLOYEE STATUS
router.put('/:status/:id', verifyToken, async (request, response, next) => {
    try {
        let status = request.params.status === 'true' ? true : false;
        let data = await dataFetch(query.UPDATE_EMPLOYEE_STATUS, [status, request.params.id], "update employee status", next);
        response.status(200).send(data.rows);
    } catch (Exception) {
        logger.error(`Update employee status, error:${Exception}, params: ${request.params}`)
        next(Exception);
    }
})

//GET EMPLOYEES LIST
router.get('/:userId', verifyToken, async (request, response, next) => {
    try {
        let data = await dataFetch(query.GET_EMPLOYEES, [request.params.userId], "get employees all list", next);
        response.status(200).send(data.rows);
    } catch (Exception) {
        logger.error(`Get employee list, error:${Exception}`)
        next(Exception);
    }
})

//GET ACTIVE/INACTIVE EMPLOYEES LIST
router.get('/:status/:userId', verifyToken, async (request, response, next) => {
    try {
        let data = await dataFetch(query.GET_STATUS_FILTERED_EMPLOYEES, [request.params.status, request.params.userId], `get ${request.params.status ? "active" : "inactive"} employees list`, next);
        response.status(200).send(data.rows);
    } catch (Exception) {
        logger.error(`Get active/inactive employee, error:${Exception}`)
        next(Exception);
    }
})

//SEARCH EMPPLOYEES
router.post('/search', verifyToken, async (request, response, next) => {
    let type = request.body.type
    try {
        if (type === "all") {
            let data = await dataFetch(query.SEARCH_EMPLOYEE, [request.body.userId, request.body.searchKey.toLowerCase()], "search employees", next);
            response.status(200).send(data.rows);
        } else if (type === "active") {
            let activeSearchQuery = query.SEARCH_EMPLOYEE + " AND status=true";
            let data = await dataFetch(activeSearchQuery, [request.body.userId, request.body.searchKey.toLowerCase()], "search active employees", next);
            response.status(200).send(data.rows);
        } else if (type === "inactive") {
            let inactiveSearchQuery = query.SEARCH_EMPLOYEE + " AND status=false";
            let data = await dataFetch(inactiveSearchQuery, [request.body.userId, request.body.searchKey.toLowerCase()], "search inactive employees", next);
            response.status(200).send(data.rows);
        } else {
            response.status(200).send([]);
        }
    } catch (Exception) {
        logger.error(`Employee search, error:${Exception}`)
        next(Exception);
    }
})

module.exports = router;
