const fs = require('fs')

const removeTmp = (path) => {
    fs.unlink(path, err => {
        if (err) throw err;
    })
}

module.exports = removeTmp