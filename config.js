// DOM
export const grid = document.getElementById("sudoku-grid");
export let gridSize = 9;
export let subgridSize = Math.sqrt(gridSize);
export let cells = [];
export let cellValues;
export let generated = false;

export function setGenerate(val){
    generated = val;
}

export function setCellValues(values){
    cellValues = values;
}

export function initializeCellValues() {
    cellValues = Array.from({ length: gridSize }, () => Array(gridSize).fill(0));
}

export function resetCells() {
    cells = [];
}

export function setGridSize(newSize) {
    gridSize = newSize;
    subgridSize = Math.sqrt(gridSize);
    setGenerate(false);
    resetCells();
    initializeCellValues();
    grid.classList.remove('solved');
}

export function validateCell(row, col) {
    let cellVal = cellValues[row][col];

    if (!cellVal || cellVal === 0) return true;  

    for (let i = 0; i < gridSize; i++) {
        if (i !== col && cellValues[row][i] === cellVal) return false;
        if (i !== row && cellValues[i][col] === cellVal) return false;
    }

    const subgridRowStart = Math.floor(row / subgridSize) * subgridSize;
    const subgridColStart = Math.floor(col / subgridSize) * subgridSize;

    for (let r = subgridRowStart; r < subgridRowStart + subgridSize; r++) {
        for (let c = subgridColStart; c < subgridColStart + subgridSize; c++) {
            if ((r !== row || c !== col) && cellValues[r][c] === cellVal) {
                return false;
            }
        }
    }

    return true;
}

export function gridSolved(){
    for (let i = 0; i < cells.length; i++){
        let row = parseInt(cells[i].dataset.row);
        let col = parseInt(cells[i].dataset.col);
        if (!validateCell(row, col) || cells[i].value === ''){
            return false;
        }
    }
    return true;
}

export function solvedGridStyle(){
    grid.classList.add('solved');
}

export function moveFocus(row, col, direction) {
    let newRow = row, newCol = col;
    
    while (true && !gridSolved()) {
        if (direction === "right") {
            newCol++;
            if (newCol >= gridSize) {
                newCol = 0;
                newRow = (newRow + 1) % gridSize;
            }
        }

        if (direction === "left") {
            newCol--;
            if (newCol < 0) { 
                newCol = gridSize - 1;
                newRow = (newRow - 1 + gridSize) % gridSize;
            }
        }

        if (direction === "down") {
            newRow = (newRow + 1) % gridSize;
        }

        if (direction === "up") {
            newRow = (newRow - 1 + gridSize) % gridSize;
        }

        const nextCell = document.querySelector(`[data-row="${newRow}"][data-col="${newCol}"]`);
        if (!nextCell.readOnly) {  
            nextCell.focus();
            nextCell.classList.add('active');
            setTimeout(() => setCaretToEnd(nextCell), 0);
            break;
        }
    }
}

function setCaretToEnd(cell) {
    const length = cell.value.length;
    cell.focus();
    cell.setSelectionRange(length, length);
}