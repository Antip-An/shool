const { wrap } = require("async-middleware");
const { verify: verifyToken } = require("../../utils/token");

const checkUser = () =>
    wrap(async (req, res, next) => {
        const authHeader = req.headers.authorization || "";
        const token = (authHeader.match(/^Bearer\s*(.*)$/) || [])[1];

        const userId = verifyToken(token);

        req.user = { userId };
        next();
    });
module.exports = checkUser;