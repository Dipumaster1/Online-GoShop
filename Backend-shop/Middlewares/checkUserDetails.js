const HandleResponse = require("../HandleResponse/handleResponse");
const jwt = require("jsonwebtoken");
const { User } = require("../Model/UserModel/userModel");

const checkUserDetails = async (req, resp, next) => {
  const token = req.header("Authorization");
  if (!token) return HandleResponse(resp, 404, "Token is not found");
  const payload = jwt.verify(token, process.env.JSON_SECRET_KEY);
  if (!payload || !payload.id)
    return HandleResponse(resp, 401, "Token is not valid");
  const existinguser = await User.findOne({ _id: payload.id }).select(
    "-password"
  );
  if (!existinguser) return HandleResponse(resp, 401, "Unauthorised user");
  req.user = existinguser;
  next();
};
module.exports = checkUserDetails;
