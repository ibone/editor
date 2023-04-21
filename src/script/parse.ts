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
  symbol: string;
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
        const command = item.replace(/^\s*/, '');
        const symbol = command.match(/^(&& | =>)/);
        if (command) {
          lines.push({
            level: level,
            command: item.replace(/^\s*/, ''),
            closed: true,
            symbol: symbol ? symbol[0] : '',
          });
        }
      });
      const commands = getCommand(lines, 0, [], [], 0);
    })
    .catch((err) => {
      console.log(err);
    });
}

function getCommand(
  lines: Line[],
  indent: number,
  command: string[],
  commands: string[][],
  index: number,
  parentIndex?: number
) {
  const line = lines[index];
  if (line.level === indent) {
    if (line.closed) {
      getCommand(lines, indent, command, commands, index + 1);
    } else if (line.symbol === '&&') {
      getCommand(lines, indent, command, commands, index + 1);
    } else if (line.symbol === '=>') {
      commands.push(command);
      getCommand(lines, 0, [], commands, 0);
    } else {
      command.push(line.command);
      getCommand(lines, indent + 1, command, commands, index + 1);
    }
  } else {
    if (line.level > indent) {
      if (typeof parentIndex === 'number') {
        lines[parentIndex].closed = true;
      }
    } else {
      line.closed = true;
      getCommand(lines, 0, [], commands, 0);
    }
  }
}

/**
 * 1. 当前行indent与指定indent相等
 *     1.1 遇到&&，将index加1，往下查找
 *     1.2 遇到=>，命令查找结束，将command加入commands，并从头开始查找
 *     1.3 默认操作，将index和indent都加1，往下查找
 * 2. 当前行indent大于指定indent
 *     2.1 查找到指定indent的底了，需要将指定indent的parent line做关闭
 * 3. 当前行indent小于指定indent
 *     3.1 格式错误，对当前行做关闭
 */

main();
