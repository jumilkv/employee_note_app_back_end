const LOGIN = "SELECT * FROM login WHERE username=$1";
const INSERT_LOGIN = "INSERT INTO login(username, password) VALUES($1, $2) RETURNING login_id";
const UPDATE_LOGIN = "UPDATE login SET token=$1::JSONB WHERE login_id=$2";
const INSERT_USER = "INSERT INTO users(uname, email, login_id) VALUES($1, $2, $3)";

module.exports = {
    LOGIN,
    INSERT_LOGIN,
    UPDATE_LOGIN,
    INSERT_USER
}