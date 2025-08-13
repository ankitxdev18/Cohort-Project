const express = require('express');
const authMiddleware = require("../middleware/auth.middleware")

const router = express.Router();

router.get('/', authMiddleware.authUser, (req, res) => {
    res.render("home");
})


module.exports = router;