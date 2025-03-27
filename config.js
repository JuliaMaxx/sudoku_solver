// DOM
export const grid = document.getElementById("sudoku-grid");
export let gridSize = 9;
export let subgridSize = Math.sqrt(gridSize);
export let cells = [];
export let cellValues;

export function initializeCellValues() {
    cellValues = Array.from({ length: gridSize }, () => Array(gridSize).fill(0));
}

export function resetCells() {
    cells = [];
}

export function setGridSize(newSize) {
    resetCells();
    initializeCellValues();
    gridSize = newSize;
    subgridSize = Math.sqrt(gridSize);
}

export function validateCell(row, col){
    const cellVal = cellValues[row][col];
    if (cellVal !== 0){
        // row & col check
        for (let i = 0; i < gridSize; i++) {
            if (i !== col && cellValues[row][i] === cellVal) return false; 
            if (i !== row && cellValues[i][col] === cellVal) return false; 
        }
        
        // subgrid check
        const subgridRowStart = Math.floor(row / subgridSize) * subgridSize;
        const subgridColStart = Math.floor(col / subgridSize) * subgridSize;

        for (let r = subgridRowStart; r < subgridRowStart + subgridSize; r++) {
            for (let c = subgridColStart; c < subgridColStart + subgridSize; c++) {
                if ((r !== row || c !== col) && cellValues[r][c] === cellVal) {
                    return false;
                }
            }
        }
    }
    return true;
}