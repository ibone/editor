"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
function readFile(path) {
    return new Promise(function (resolve, reject) {
        fs.readFile(path, function (err, data) {
            if (err) {
                reject(err);
            }
            else {
                resolve(data.toString());
            }
        });
    });
}
function main() {
    readFile(path.join(__dirname, '../commands/.commands'))
        .then(function (data) {
        var arr = data.split('\n');
        console.log(arr);
    })
        .catch(function (err) {
        console.log(err);
    });
}
main();
