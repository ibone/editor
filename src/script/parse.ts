import * as fs from 'fs';
import * as path from 'path';

function readFile(path: string) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data.toString());
      }
    });
  });
}

function main() {
  readFile(path.join(__dirname, '../commands/.commands'))
    .then((data) => {
      console.log(data);
    })
    .catch((err) => {
      console.log(err);
    });
}

main();
