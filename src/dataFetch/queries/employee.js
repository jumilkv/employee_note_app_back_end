const GET_EMPLOYEES = "SELECT * FROM employee WHERE user_id=$1 ORDER BY id";
const GET_STATUS_FILTERED_EMPLOYEES = "SELECT * FROM employee WHERE status=$1 AND user_id=$2 ORDER BY id";
const GET_EMPLOYEE_BY_EMAIL = "SELECT * FROM employee WHERE email=$1 AND user_id=$2";
const GET_EMPLOYEE_BY_PHONE = "SELECT * FROM employee WHERE phone=$1 AND user_id=$2";
const GET_EMPLOYEE_BY_EMP_ID = "SELECT * FROM employee WHERE emp_id=$1 AND user_id=$2";
const SEARCH_EMPLOYEE = `SELECT * FROM employee 
                                            WHERE 
                                                user_id=$1 
                                            AND 
                                            lower(name||email||phone||emp_id||address||age) LIKE '%' || $2 || '%' `;
const INSERT_EMPLOYEE = "INSERT INTO employee(name, email, emp_id, age, address, phone, user_id, status) VALUES($1, $2, $3, $4, $5, $6, $7, true)";
const UPDATE_EMPLOYEE = "UPDATE employee SET name=$1, email=$2, emp_id=$3, age=$4, address=$5, phone=$6 WHERE id=$7";
const UPDATE_EMPLOYEE_STATUS = "UPDATE employee SET status=$1 WHERE id=$2";

module.exports = {
    GET_EMPLOYEES,
    GET_STATUS_FILTERED_EMPLOYEES,
    GET_EMPLOYEE_BY_EMAIL,
    GET_EMPLOYEE_BY_PHONE,
    GET_EMPLOYEE_BY_EMP_ID,
    SEARCH_EMPLOYEE,
    INSERT_EMPLOYEE,
    UPDATE_EMPLOYEE,
    UPDATE_EMPLOYEE_STATUS
}