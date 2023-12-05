const multer = require("multer");
//Multer Setup Started
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./src/images");
  },
  filename: (req, file, cb) => {
  
    var originalname = file.originalname;
    originalname = originalname.replace(/\s/g, "");

    cb(null, Date.now() + "-" + originalname);
  },
});

const userImageMiddleware = multer({
  storage: storage,
  limits: { fieldSize: 100 * 1024 * 1024 },
}).fields([{ name: "profileImage" }]);
module.exports = {
  userImageMiddleware,
};
