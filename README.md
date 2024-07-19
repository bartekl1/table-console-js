# table-console

JavaScript library for displaying table in the console

## Features

- Customizable border
    - Four built-in styles
    - Option to create custom style
- Text and background color styling and text decorations
- Text alignment (left, center, right)
- Padding (left, right)
- Horizontal lines customization (disabled, only header, enabled)
- Zero dependency

## Installation

```bash
npm install table-console
```

## Usage

```js
var Table = require("table-console");
var t = new Table({
    padding: 2,
    headerLine: false,
});
t.insertRows([
    ['First value', 'Second value'],
    ['First value', 'Second value']
]);

console.log(t.toString());
```

## API

### Constructor options

- style - `string` or `number`, default value `"unicode"` \
    Build-in style of border

    - `"unicode"` or `1` (default)

        ```text
        ┌─────────────┬──────────────┐
        │ First value │ Second value │
        ├─────────────┼──────────────┤
        │ Third value │ Fourth value │
        └─────────────┴──────────────┘
        ```

    - `"unicode bold"` or `2`

        ```text
        ┏━━━━━━━━━━━━━┳━━━━━━━━━━━━━━┓
        ┃ First value ┃ Second value ┃
        ┣━━━━━━━━━━━━━╋━━━━━━━━━━━━━━┫
        ┃ Third value ┃ Fourth value ┃
        ┗━━━━━━━━━━━━━┻━━━━━━━━━━━━━━┛
        ```

    - `"unicode double"` or `3`

        ```text
        ╔═════════════╦══════════════╗
        ║ First value ║ Second value ║
        ╠═════════════╬══════════════╣
        ║ Third value ║ Fourth value ║
        ╚═════════════╩══════════════╝
        ```

    - `"ascii"` or `4`

        ```text
        +-------------+--------------+
        | First value | Second value |
        |-------------+--------------|
        | Third value | Fourth value |
        +-------------+--------------+
        ```

- borders - `object` \
    Custom border

    E.g.

    ```js
    borders: {
        topLeft: "┌", top: "─", topMid: "┬", topRight: "┐",
        midLeft: "├", mid: "─", midMid: "┼", midRight: "┤",
        botLeft: "└", bot: "─", botMid: "┴", botRight: "┘",
        sep: "│",
    }
    ```

- horizontalLines - `boolean`, default value `false` \
    Put horizontal lines after each row

- headerLine - `boolean`, default value `true` \
    Put horizontal lines after first row

- padding, leftPadding, rightPadding - `number`, default value `1` \
    Padding in cells
    leftPadding and rightPadding is preferred over padding if both are present.

### Methods

- **insertRow(row)** \
    Inserts one row to bottom of the table

    Parameters:
    - **row** - `Array` containing row cells

- **insertRows(rows)** \
    Inserts multiple rows to bottom of the table

    Parameters:
    - **rows** - `Array` containing rows

- **removeRow(row)** \
    Removes one row from the table

    Parameters:
    - **row** - row id

- **getRows()** \
    Returns all rows in the table

- **toString()** \
    Returns string representation of the table

- **insertHorizontalLine()** \
    Inserts horizontal line to bottom of the table

- **getCell(row, col)** \
    Return cell value

    Parameters:
    - **row** - row id
    - **col** - column id

- **setCell(row, col, value)** \
    Sets cell value

    Parameters:
    - **row** - row id
    - **col** - column id
    - **value** - new value

- **setCellAttrs(row, col, attrs)** \
    Sets cell attributes

    Parameters:
    - **row** - row id
    - **col** - column id
    - **attrs** - attributes
        - **color** - `string` - `black`, `red`, `green`, `yellow`, `blue`, `magenta`, `cyan`, `white`, `gray`, `brightRed`, `brightGreen`, `brightYellow`, `brightBlue`, `brightMagenta`, `brightCyan`, `brightWhite`
        - **bgColor** - `string` - `black`, `red`, `green`, `yellow`, `blue`, `magenta`, `cyan`, `white`, `gray`, `brightRed`, `brightGreen`, `brightYellow`, `brightBlue`, `brightMagenta`, `brightCyan`, `brightWhite`
        - **decorations** - `Array` - `bold`, `dim`, `italic`, `underline`, `overline`, `inverse`, `strikethrough`, `slowBlink`, `rapidBlink`
        - **align** - `string` - `left`, `center`, `right`

- **setRowAttrs(row, attrs)** \
    Sets row attributes

    Parameters:
    - **row** - row id
    - **attrs** - same as `setCellAttrs`

- **setColAttrs(col, attrs)** \
    Sets column attributes

    Parameters:
    - **col** - column id
    - **attrs** - same as `setCellAttrs`
