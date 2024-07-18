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
    }

    addRow(row) {
        if (typeof row === "undefined") row = [];
        if (!Array.isArray(row)) row = [row];
        for (var i = 0; i < row.length; i++) {
            row[i] = String(row[i]);
        }
        this.rows.push(row);
    }

    addRows(rows) {
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
                stringTable += this.borders.sep + " ".repeat(this.leftPadding) + table[0][i] + " ".repeat(columnsLengths[i] - table[0][i].length) + " ".repeat(this.rightPadding);
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
                        stringTable += this.borders.sep + " ".repeat(this.leftPadding) + table[i][j] + " ".repeat(columnsLengths[j] - table[i][j].length) + " ".repeat(this.rightPadding);
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

    addHorizontalLine() {
        this.rows.push("HORIZONTAL LINE");
    }

    getCell(col, row) {
        if (row >= this.rows.length) throw RangeError("row number out of range");
        if (this.rows[row] === "HORIZONTAL LINE") throw SyntaxError("this row is horizontal line");
        var rowContent = this.getRows()[row];
        if (col >= rowContent.length) throw RangeError("column number out of range");
        return rowContent[col];
    }

    setCell(col, row, value) {
        if (row >= this.rows.length) throw RangeError("row number out of range");
        if (this.rows[row] === "HORIZONTAL LINE") throw SyntaxError("this row is horizontal line");
        var rowContent = this.getRows()[row];
        if (col >= rowContent.length) throw RangeError("column number out of range");
        this.rows[row][col] = String(value);
    }
}

module.exports = Table;
