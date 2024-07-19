const codesANSI = {
    reset: "\u001b[0m",
    foreground: {
        black: "\u001b[30m",
        red: "\u001b[31m",
        green: "\u001b[32m",
        yellow: "\u001b[33m",
        blue: "\u001b[34m",
        magenta: "\u001b[35m",
        cyan: "\u001b[36m",
        white: "\u001b[37m",
        gray: "\u001b[90m",
        brightRed: "\u001b[91m",
        brightGreen: "\u001b[92m",
        brightYellow: "\u001b[93m",
        brightBlue: "\u001b[94m",
        brightMagenta: "\u001b[95m",
        brightCyan: "\u001b[96m",
        brightWhite: "\u001b[97m",
    },
    background: {
        black: "\u001b[40m",
        red: "\u001b[41m",
        green: "\u001b[42m",
        yellow: "\u001b[43m",
        blue: "\u001b[44m",
        magenta: "\u001b[45m",
        cyan: "\u001b[46m",
        white: "\u001b[47m",
        gray: "\u001b[100m",
        brightRed: "\u001b[101m",
        brightGreen: "\u001b[102m",
        brightYellow: "\u001b[103m",
        brightBlue: "\u001b[104m",
        brightMagenta: "\u001b[105m",
        brightCyan: "\u001b[106m",
        brightWhite: "\u001b[107m",
    },
    decorations: {
        bold: "\u001b[1m",
        dim: "\u001b[2m",
        italic: "\u001b[3m",
        underline: "\u001b[4m",
        overline: "\u001b[53m",
        inverse: "\u001b[7m",
        strikethrough: "\u001b[9m",
        slowBlink: "\u001b[5m",
        rapidBlink: "\u001b[6m",
    },
};

function getCellText(content, colWidth, cellAttrs, rowAttrs, colAttrs) {
    var attrs;
    if (typeof cellAttrs === "object") attrs = cellAttrs;
    else if (typeof rowAttrs === "object") attrs = rowAttrs;
    else if (typeof colAttrs === "object") attrs = colAttrs;
    else attrs = {};

    var columnStr = "";
    var colorANSI = "";
    var backgroundANSI = "";
    var decorationsANSI = "";
    var resetANSI = "";

    if (typeof attrs.color === "string") colorANSI = codesANSI.foreground[attrs.color];
    if (typeof attrs.bgColor === "string") backgroundANSI = codesANSI.background[attrs.bgColor];
    if (Array.isArray(attrs.decorations) && attrs.decorations.length > 0) attrs.decorations.forEach((decoration) => { decorationsANSI += codesANSI.decorations[decoration]; });
    if (typeof attrs.color === "string" || typeof attrs.bgColor === "string" || (Array.isArray(attrs.decorations) && attrs.decorations.length > 0)) resetANSI = codesANSI.reset;

    if (attrs.align === "left" || typeof attrs.align === "undefined") columnStr += colorANSI + backgroundANSI + decorationsANSI + content + resetANSI + " ".repeat(colWidth - content.length);
    else if (attrs.align === "center") columnStr += " ".repeat(Math.ceil((colWidth - content.length) / 2)) + colorANSI + backgroundANSI + decorationsANSI + content + resetANSI + " ".repeat(Math.floor((colWidth - content.length) / 2));
    else if (attrs.align === "right") columnStr += " ".repeat(colWidth - content.length) + colorANSI + backgroundANSI + decorationsANSI + content + resetANSI;
    return columnStr;
}

class Table {
    constructor(options) {
        if (typeof options === "undefined") {
            options = {};
        } else if (typeof options !== "object") {
            throw TypeError("options must be an object or undefined");
        }

        if (typeof options.style === "undefined" || options.style === "unicode" || options.style === 1) {
            this.style = "unicode";
            this.borders = {
                sep: "│",
                topLeft: "┌",
                topMid: "┬",
                top: "─",
                topRight: "┐",
                midLeft: "├",
                midMid: "┼",
                mid: "─",
                midRight: "┤",
                botLeft: "└",
                botMid: "┴",
                bot: "─",
                botRight: "┘",
            };
        } else if (options.style === "unicode bold" || options.style === 2) {
            this.style = "unicode bold";
            this.borders = {
                sep: "┃",
                topLeft: "┏",
                topMid: "┳",
                top: "━",
                topRight: "┓",
                midLeft: "┣",
                midMid: "╋",
                mid: "━",
                midRight: "┫",
                botLeft: "┗",
                botMid: "┻",
                bot: "━",
                botRight: "┛",
            };
        } else if (options.style === "unicode double" || options.style === 3) {
            this.style = "unicode double";
            this.borders = {
                sep: "║",
                topLeft: "╔",
                topMid: "╦",
                top: "═",
                topRight: "╗",
                midLeft: "╠",
                midMid: "╬",
                mid: "═",
                midRight: "╣",
                botLeft: "╚",
                botMid: "╩",
                bot: "═",
                botRight: "╝",
            };
        } else if (options.style === "ascii" || options.style === 4) {
            this.style = "ascii";
            this.borders = {
                sep: "|",
                topLeft: "+",
                topMid: "+",
                top: "-",
                topRight: "+",
                midLeft: "|",
                midMid: "+",
                mid: "-",
                midRight: "|",
                botLeft: "+",
                botMid: "+",
                bot: "-",
                botRight: "+",
            };
        } else {
            throw SyntaxError("This style does not exist");
        }

        if (typeof options.borders === "object") {
            for (const [key, value] of Object.entries(options.borders)) {
                if (typeof value === "string" && value.length === 1 && this.borders.hasOwnProperty(key)) this.borders[key] = value;
                else throw SyntaxError("Invalid custom border");
            }
        } else if (typeof options.borders !== "undefined") {
            throw TypeError("borders must be an object or undefined");
        }

        if (typeof options.horizontalLines === "undefined") {
            options.horizontalLines = false;
        } else if (typeof options.horizontalLines !== "boolean") {
            throw TypeError("horizontalLines must be boolean or undefined");
        }

        if (typeof options.headerLine === "undefined") {
            options.headerLine = true;
        } else if (typeof options.headerLine !== "boolean") {
            throw TypeError("headerLine must be boolean or undefined");
        }

        if (options.horizontalLines) {
            this.horizontalLines = true;
            this.headerLine = true;
        } else if (!options.horizontalLines && options.headerLine) {
            this.horizontalLines = false;
            this.headerLine = true;
        } else if (!options.horizontalLines && !options.headerLine) {
            this.horizontalLines = false;
            this.headerLine = false;
        }

        if (typeof options.padding === "undefined") {
            this.leftPadding = 1;
            this.rightPadding = 1;
        } else if (typeof options.padding === "number") {
            this.leftPadding = options.padding;
            this.rightPadding = options.padding;
        } else {
            throw TypeError("padding must be a number or undefined");
        }

        if (typeof options.leftPadding === "number") {
            this.leftPadding = options.leftPadding;
        } else if (typeof options.leftPadding !== "undefined") {
            throw TypeError("leftPadding must be a number or undefined");
        }

        if (typeof options.rightPadding === "number") {
            this.rightPadding = options.rightPadding;
        } else if (typeof options.rightPadding !== "undefined") {
            throw TypeError("rightPadding must be a number or undefined");
        }

        this.rows = [];
        this.attrs = {};
    }

    insertRow(row) {
        if (typeof row === "undefined") row = [];
        if (!Array.isArray(row)) row = [row];
        for (var i = 0; i < row.length; i++) {
            row[i] = String(row[i]);
        }
        this.rows.push(row);
    }

    removeRow(row) {
        if (row >= this.rows.length || row < -this.rows.length) throw RangeError("row number out of range");
        this.rows.splice(row, 1);
    }

    insertRows(rows) {
        if (typeof rows === "undefined") rows = [[]];
        if (!Array.isArray(rows)) throw TypeError("rows must be an array");
        for (var i = 0; i < rows.length; i++) {
            if (!Array.isArray(rows[i])) rows[i] = [rows[i]];
            for (var j = 0; j < rows[i].length; j++) {
                rows[i][j] = String(rows[i][j]);
            }
        }
        this.rows = this.rows.concat(rows);
    }

    getRows() {
        var cols = 0;
        this.rows.forEach((row) => { if (row.length > cols && row !== "HORIZONTAL LINE") cols = row.length });
        var rows = [];
        this.rows.forEach((row) => {
            if (row !== "HORIZONTAL LINE") {
                var newRow = [...row];
                while (newRow.length < cols) newRow.push("");
                rows.push(newRow);
            } else rows.push("HORIZONTAL LINE");
        });
        return rows;
    }

    toString() {
        var table = this.getRows();
        var columnsLengths = Array(table[0].length).fill(0);
        table.forEach((row) => {
            for (var i = 0; i < row.length; i++) if (row[i].length > columnsLengths[i]) columnsLengths[i] = row[i].length;
        });
        var stringTable = this.borders.topLeft;
        for (var i = 0; i < columnsLengths.length; i++) {
            stringTable += this.borders.top.repeat(columnsLengths[i] + this.leftPadding + this.rightPadding);
            if (i < columnsLengths.length - 1) stringTable += this.borders.topMid;
            else stringTable += this.borders.topRight;
        }
        if (table.length > 0) {
            stringTable += "\n";
            for (var i = 0; i < table[0].length; i++) {
                stringTable += this.borders.sep + " ".repeat(this.leftPadding) + getCellText(table[0][i], columnsLengths[i], this.attrs[`cell:${0},${i}`], this.attrs[`row:${0}`], this.attrs[`col:${i}`]) + " ".repeat(this.rightPadding);
            }
            stringTable += this.borders.sep;
        }
        if (table.length > 1 && this.headerLine) {
            stringTable += "\n" + this.borders.midLeft;;
            for (var i = 0; i < columnsLengths.length; i++) {
                stringTable += this.borders.mid.repeat(columnsLengths[i] + this.leftPadding + this.rightPadding);
                if (i < columnsLengths.length - 1) stringTable += this.borders.midMid;
                else stringTable += this.borders.midRight;
            }
        }
        if (table.length > 1) {
            for (var i = 1; i < table.length; i++) {
                if (table[i] !== "HORIZONTAL LINE") {
                    stringTable += "\n";
                    for (var j = 0; j < table[i].length; j++) {
                        stringTable += this.borders.sep + " ".repeat(this.leftPadding) + getCellText(table[i][j], columnsLengths[j], this.attrs[`cell:${i},${j}`], this.attrs[`row:${i}`], this.attrs[`col:${j}`]) + " ".repeat(this.rightPadding);
                    }
                    stringTable += this.borders.sep;
                    if (this.horizontalLines && i < table.length - 1) {
                        stringTable += "\n" + this.borders.midLeft;;
                        for (var j = 0; j < columnsLengths.length; j++) {
                            stringTable += this.borders.mid.repeat(columnsLengths[j] + this.leftPadding + this.rightPadding);
                            if (j < columnsLengths.length - 1) stringTable += this.borders.midMid;
                            else stringTable += this.borders.midRight;
                        }
                    }
                } else {
                    stringTable += "\n" + this.borders.midLeft;;
                    for (var j = 0; j < columnsLengths.length; j++) {
                        stringTable += this.borders.mid.repeat(columnsLengths[j] + this.leftPadding + this.rightPadding);
                        if (j < columnsLengths.length - 1) stringTable += this.borders.midMid;
                        else stringTable += this.borders.midRight;
                    }
                }
            }
        }
        stringTable += "\n" + this.borders.botLeft;
        for (var i = 0; i < columnsLengths.length; i++) {
            stringTable += this.borders.bot.repeat(columnsLengths[i] + this.leftPadding + this.rightPadding);
            if (i < columnsLengths.length - 1) stringTable += this.borders.botMid;
            else stringTable += this.borders.botRight;
        }
        return stringTable;
    }

    insertHorizontalLine() {
        this.rows.push("HORIZONTAL LINE");
    }

    getCell(row, col) {
        if (row >= this.rows.length) throw RangeError("row number out of range");
        if (this.rows[row] === "HORIZONTAL LINE") throw SyntaxError("this row is horizontal line");
        var rowContent = this.getRows()[row];
        if (col >= rowContent.length) throw RangeError("column number out of range");
        return rowContent[col];
    }

    setCell(row, col, value) {
        if (row >= this.rows.length) throw RangeError("row number out of range");
        if (this.rows[row] === "HORIZONTAL LINE") throw SyntaxError("this row is horizontal line");
        var rowContent = this.getRows()[row];
        if (col >= rowContent.length) throw RangeError("column number out of range");
        this.rows[row][col] = String(value);
    }

    setCellAttrs(row, col, attrs) {
        if (row >= this.rows.length) throw RangeError("row number out of range");
        if (this.rows[row] === "HORIZONTAL LINE") throw SyntaxError("this row is horizontal line");
        var rowContent = this.getRows()[row];
        if (col >= rowContent.length) throw RangeError("column number out of range");
        if (typeof attrs === "undefined") delete this.attrs[`cell:${row},${col}`];
        else if (typeof attrs === "object") {
            Object.keys(attrs).forEach((key) => { if (!["color", "bgColor", "decorations", "align"].includes(key)) throw SyntaxError(`invalid attribute "${key}"`); });
            if (typeof attrs.color !== "string" && typeof attrs.color !== "undefined") throw TypeError("attrs.color must be a string or undefined");
            if (typeof attrs.bgColor !== "string" && typeof attrs.bgColor !== "undefined") throw TypeError("attrs.bgColor must be a string or undefined");
            if (!Array.isArray(attrs.decorations) && typeof attrs.decorations !== "undefined") throw TypeError("attrs.decorations must be an array or undefined");
            if (typeof attrs.color === "string" && !codesANSI.foreground.hasOwnProperty(attrs.color)) throw SyntaxError("attrs.color is invalid");
            if (typeof attrs.bgColor === "string" && !codesANSI.background.hasOwnProperty(attrs.bgColor)) throw SyntaxError("attrs.bgColor is invalid");
            if (Array.isArray(attrs.decorations)) attrs.decorations.forEach((name) => { if (!Object.keys(codesANSI.decorations).includes(name)) throw SyntaxError(`invalid decoration "${name}"`); });
            if (typeof attrs.align !== "undefined" && attrs.align !== "left" && attrs.align !== "center" && attrs.align !== "right") throw SyntaxError('attrs.align must be "left", "center", "right" or undefined');
            this.attrs[`cell:${row},${col}`] = attrs;
        } else throw TypeError("attrs must be an object or undefined");
    }

    setRowAttrs(row, attrs) {
        if (row >= this.rows.length) throw RangeError("row number out of range");
        if (this.rows[row] === "HORIZONTAL LINE") throw SyntaxError("this row is horizontal line");
        if (typeof attrs === "undefined") delete this.attrs[`row:${row}`];
        else if (typeof attrs === "object") {
            Object.keys(attrs).forEach((key) => { if (!["color", "bgColor", "decorations", "align"].includes(key)) throw SyntaxError(`invalid attribute "${key}"`); });
            if (typeof attrs.color !== "string" && typeof attrs.color !== "undefined") throw TypeError("attrs.color must be a string or undefined");
            if (typeof attrs.bgColor !== "string" && typeof attrs.bgColor !== "undefined") throw TypeError("attrs.bgColor must be a string or undefined");
            if (!Array.isArray(attrs.decorations) && typeof attrs.decorations !== "undefined") throw TypeError("attrs.decorations must be an array or undefined");
            if (typeof attrs.color === "string" && !codesANSI.foreground.hasOwnProperty(attrs.color)) throw SyntaxError("attrs.color is invalid");
            if (typeof attrs.bgColor === "string" && !codesANSI.background.hasOwnProperty(attrs.bgColor)) throw SyntaxError("attrs.bgColor is invalid");
            if (Array.isArray(attrs.decorations)) attrs.decorations.forEach((name) => { if (!Object.keys(codesANSI.decorations).includes(name)) throw SyntaxError(`invalid decoration "${name}"`); });
            if (typeof attrs.align !== "undefined" && attrs.align !== "left" && attrs.align !== "center" && attrs.align !== "right") throw SyntaxError('attrs.align must be "left", "center", "right" or undefined');
            this.attrs[`row:${row}`] = attrs;
        } else throw TypeError("attrs must be an object or undefined");
    }

    setColAttrs(col, attrs) {
        if (typeof attrs === "undefined") delete this.attrs[`col:${col}`];
        else if (typeof attrs === "object") {
            Object.keys(attrs).forEach((key) => { if (!["color", "bgColor", "decorations", "align"].includes(key)) throw SyntaxError(`invalid attribute "${key}"`); });
            if (typeof attrs.color !== "string" && typeof attrs.color !== "undefined") throw TypeError("attrs.color must be a string or undefined");
            if (typeof attrs.bgColor !== "string" && typeof attrs.bgColor !== "undefined") throw TypeError("attrs.bgColor must be a string or undefined");
            if (!Array.isArray(attrs.decorations) && typeof attrs.decorations !== "undefined") throw TypeError("attrs.decorations must be an array or undefined");
            if (typeof attrs.color === "string" && !codesANSI.foreground.hasOwnProperty(attrs.color)) throw SyntaxError("attrs.color is invalid");
            if (typeof attrs.bgColor === "string" && !codesANSI.background.hasOwnProperty(attrs.bgColor)) throw SyntaxError("attrs.bgColor is invalid");
            if (Array.isArray(attrs.decorations)) attrs.decorations.forEach((name) => { if (!Object.keys(codesANSI.decorations).includes(name)) throw SyntaxError(`invalid decoration "${name}"`); });
            if (typeof attrs.align !== "undefined" && attrs.align !== "left" && attrs.align !== "center" && attrs.align !== "right") throw SyntaxError('attrs.align must be "left", "center", "right" or undefined');
            this.attrs[`col:${col}`] = attrs;
        } else throw TypeError("attrs must be an object or undefined");
    }
}

module.exports = Table;
