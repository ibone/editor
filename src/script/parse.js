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
        // console.log(arr);
        var lines = [];
        arr.forEach(function (item) {
            var matchResult = item.match(/^\s*/) || [''];
            var indent = matchResult[0].length / 4;
            var command = item.replace(/^\s*/, '');
            var symbol = command.match(/(&&|=>)/);
            if (command) {
                lines.push({
                    indent: indent,
                    command: item.replace(/(&&|=>)/, '').replace(/^\s*|\s*$/, ''),
                    closed: false,
                    symbol: symbol ? symbol[0] : '',
                });
            }
        });
        var commands = getCommands(lines, 0, [], [], 0);
        console.log(commands);
    })
        .catch(function (err) {
        console.log(err);
    });
}
function getCommands(lines, indent, command, commands, index) {
    var line = lines[index];
    if (!line) {
        return commands;
    }
    if (line.closed) {
        return getCommands(lines, indent, command, commands, index + 1);
    }
    else if (line.indent === indent) {
        if (line.symbol === '&&') {
            addCommand(command, line, indent);
            return getCommands(lines, indent, command, commands, index + 1);
        }
        else if (line.symbol === '=>') {
            addCommand(command, line, indent);
            setClose(command, indent - 1);
            commands.push(command);
            return getCommands(lines, 0, [], commands, 0);
        }
        else {
            addCommand(command, line, indent);
            return getCommands(lines, indent + 1, command, commands, index + 1);
        }
    }
    else if (line.indent < indent) {
        setClose(command, indent - 1);
        return getCommands(lines, 0, [], commands, 0);
    }
    else {
        line.closed = true;
        return getCommands(lines, indent, command, commands, index + 1);
    }
}
function addCommand(command, line, indent) {
    var commandInfo = command[indent];
    if (!commandInfo) {
        command[indent] = {
            indent: indent,
            lines: [line],
        };
    }
    else {
        commandInfo.lines.push(line);
    }
}
function setClose(command, level) {
    var commandInfo = command[level];
    commandInfo.lines.forEach(function (line) {
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
