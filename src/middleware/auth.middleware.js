const userModel = require("../models/user.model")
const jwt = require("jsonwebtoken");

async function authUser(req, res, next) {

    const token = req.cookies.token;

    if (!token) {
        return res.redirect("/auth/login");
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await userModel.findById(decoded.id);

        req.user = user;

        next()
    }
    catch (err) {
        console.log(err)
        res.redirect("/auth/login")
    }

}

module.exports = { authUser };