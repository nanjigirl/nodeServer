var express = require('express');
var multiparty = require('multiparty');
const fse = require('fs-extra');
const path = require('path');
const fs = require('fs');

var router = express.Router();

const UPLOAD_DIR = path.resolve(__dirname, 'public/upload')
/* multer简单文件上传 */
router.post('/upload', async function (req, res, next) {
  const form = new multiparty.Form({uploadDir: 'temp'});
  form.parse(req);
  form.on('file', async (name, chunk) => {
    let chunkDir=`${UPLOAD_DIR}/${chunk.originalFilename.split('.')[0]}`;
    if(!fse.existsSync(chunkDir)) {
      await fse.mkdirs(chunkDir);
    }

    const dPath = path.join(chunkDir, chunk.originalFilename.split('.')[1]);
    await fse.move(chunk.path, dPath, {overwrite: true});

    res.send('上传成功');
  });
  res.send('文件上传成功')
});

router.post('/merge', async function(req, res) {
  let name = req.body.name;
  let fname = name.split('.')[0];

  let chunkDir = path.join(UPLOAD_DIR, fname);
  let chunks = await fse.readdir(chunkDir);

  chunks.sort((a, b) => a - b).map(chunkPath => {
    fs.appendFileSync(
      path.join(UPLOAD_DIR, name),
      fs.readFileSync(`${chunkDir}${chunkPath}`)
    )
  })
  fse.removeSync(chunkDir);
  res.send({msg: '合并成功', url: `http://localhost:3000/split/upload/${name}`});
})

module.exports = router;
