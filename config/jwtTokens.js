import jwt from "jsonwebtoken";

const generateToken = (id, role) =>{
    return jwt.sign({id, role}, "mysecret", {expiresIn: "3d"});
}

export {generateToken};