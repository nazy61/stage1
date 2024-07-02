const { Router } = require("express");
const { user } = require("../controllers/api");
const router = Router();

router.get("/hello", user);

module.exports = router;
