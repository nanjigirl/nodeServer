var express = require('express');
var multer = require('multer');
const fs = require('fs');
const path = require('path');

var router = express.Router();
var upload = multer({ dest: 'uploads/' });

/* multer简单文件上传 */
router.post('/upload', upload.any(), function (req, res, next) {
  const filename = req.files[0].path + path.parse(req.files[0].originalname).ext
  console.log(req.files[0])
  console.log(filename);
  fs.rename(req.files[0].path, filename, function(err){
    if(err){
      res.send(err)
    }else{
     res.send('upload successfully')
    }
  })
});

module.exports = router;
