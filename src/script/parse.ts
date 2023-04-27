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

interface Line {
  indent: number;
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
        const indent = matchResult[0].length / 4;
        const command = item.replace(/^\s*/, '');
        const symbol = command.match(/(&&|=>)/);
        if (command) {
          lines.push({
            indent: indent,
            command: item.replace(/(&&|=>)/, '').replace(/^\s*|\s*$/, ''),
            closed: false,
            symbol: symbol ? symbol[0] : '',
          });
        }
      });
      const commands = getCommands(lines, 0, [], [], 0);
      console.log(commands);
    })
    .catch((err) => {
      console.log(err);
    });
}

interface LineInfo {
  indent: number;
  lines: Line[];
}

function getCommands(
  lines: Line[],
  indent: number,
  command: LineInfo[],
  commands: LineInfo[][],
  index: number
): LineInfo[][] {
  const line = lines[index];
  if (!line) {
    return commands;
  }
  if (line.closed) {
    return getCommands(lines, indent, command, commands, index + 1);
  } else if (line.indent === indent) {
    if (line.symbol === '&&') {
      addCommand(command, line, indent);
      return getCommands(lines, indent, command, commands, index + 1);
    } else if (line.symbol === '=>') {
      addCommand(command, line, indent);
      setClose(command, indent - 1);
      commands.push(command);
      return getCommands(lines, 0, [], commands, 0);
    } else {
      addCommand(command, line, indent);
      return getCommands(lines, indent + 1, command, commands, index + 1);
    }
  } else if (line.indent < indent) {
    setClose(command, indent - 1);
    return getCommands(lines, 0, [], commands, 0);
  } else {
    line.closed = true;
    return getCommands(lines, indent, command, commands, index + 1);
  }
}

function addCommand(command: LineInfo[], line: Line, indent: number) {
  const commandInfo = command[indent];
  if (!commandInfo) {
    command[indent] = {
      indent: indent,
      lines: [line],
    };
  } else {
    commandInfo.lines.push(line);
  }
}

function setClose(command: LineInfo[], level: number) {
  const commandInfo = command[level];
  commandInfo.lines.forEach((line) => {
    line.closed = true;
  });
}

/**
 * 1. 当前行indent与指定indent相等
 *     1.1 遇到&&，将index加1，往下查找
 *     1.2 遇到=>，命令查找结束，将command加入commands，将index加1，往下查找
 *     1.3 默认操作，将index和indent都加1，往下查找
 * 2. 当前行indent大于指定indent
 *     2.1 查找到指定indent的底了，需要将指定indent的parent line做关闭
 * 3. 当前行indent小于指定indent
 *     3.1 格式错误，对当前行做关闭
 * 4. 当前行如果关闭
 *     4.1 将index加1，往下查找
 */

main();
