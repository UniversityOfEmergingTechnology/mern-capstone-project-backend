const { sendMesssage, getAllMesssage } = require("../controllers/messageController");
const router = require("express").Router();

router.post("/sendMessage", sendMesssage);
router.post("/getMessage", getAllMesssage);

module.exports = router;
