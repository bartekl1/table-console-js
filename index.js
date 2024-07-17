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

    get() {
        return this.rows;
    }
}

module.exports = Table;
