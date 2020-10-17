var express = require('express');
var router = express.Router();
const fs = require('fs')

/* GET home page. */
router.get('/', function(req, res, next) {
    fs.readFile('./routes/form.json', (err, data) => {
        if (err) {
            throw err;
        }
        else {
            var jsonFile = JSON.parse(data)
            console.log(jsonFile)
            res.send(jsonFile)
        }
      });
});

module.exports = router;
