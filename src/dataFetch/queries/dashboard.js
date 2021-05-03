const GET_EMPLOYEES = "SELECT * FROM employee WHERE user_id=$1";
const GET_STATUS_FILTERED_EMPLOYEES = "SELECT * FROM employee WHERE status=$1 AND user_id=$2"
const INSERT_EMPLOYEE = "INSERT INTO employee(name, email, emp_id, age, address, phone, user_id, status) VALUES($1, $2, $3, $4, $5, $6, $7, true)";

module.exports = {
    GET_EMPLOYEES,
    GET_STATUS_FILTERED_EMPLOYEES,
    INSERT_EMPLOYEE,
}