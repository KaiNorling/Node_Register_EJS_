const jwt = require("jsonwebtoken")


const token =jwt.sign(
    {username:12345,}, "password"
)

console.log(token);

const trust = jwt.verify(token,"password")
console.log(trust);