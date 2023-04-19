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

const symbols = ['&&', '=>'];
interface Line {
  level: number;
  command: string;
  closed: boolean;
}
function main() {
  readFile(path.join(__dirname, '../commands/.commands'))
    .then((data: any) => {
      const arr: string[] = data.split('\n');
      // console.log(arr);
      const lines: Line[] = [];
      arr.forEach((item) => {
        const matchResult = item.match(/^\s*/) || [''];
        const level = matchResult[0].length / 4;
        lines.push({
          level: level,
          command: item.replace(/^\s*/, ''),
          closed: true,
        });
      });
      const commands = getCommand(lines, 0, [], [], 0);
    })
    .catch((err) => {
      console.log(err);
    });
}

function getCommand(
  lines: Line[],
  curIndent: number,
  command: string[],
  commands: string[][],
  index: number
) {
  const line = lines[index];
  if (line.level === curIndent) {
    command.push(line.command);
  } else if (line.level > curIndent) {
    line.closed = false;
    command.push(line.command);
  }
  if (!line.closed) {
    getCommand;
  }
}

main();
