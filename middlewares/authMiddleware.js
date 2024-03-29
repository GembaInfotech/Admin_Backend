import jwt from "jsonwebtoken";
import SuperAdmin from '../model/superAdmin.js';

const authMiddleware = async (req, res, next) => {
  let token;
    console.log(req.headers)
  if (req?.headers?.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
    try {
      if (token) {
        const decoded = jwt.verify(token, "mysecret");
        const user = await SuperAdmin.findById(decoded?.id);
        req.user = user;
        next();
      } else {
      }
    } catch (error) {
      res.json({ error: "not authorized" });
    }
  } else {
    res.json({ error: "there is no token" });
  }
};

export default authMiddleware;
