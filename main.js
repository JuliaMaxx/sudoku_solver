const grid = document.getElementById("sudoku-grid");
const gridSize = 9;
const subgridSize = Math.sqrt(gridSize);

grid.style.gridTemplateColumns = `repeat(${gridSize}, 50px)`;
grid.style.gridTemplateRows = `repeat(${gridSize}, 50px)`;

for(let row = 0; row < gridSize; row++) {
    for(let col = 0; col < gridSize; col++) {
        const cell = document.createElement("input");
        cell.classList.add("sudoku-cell");
        
        if (col % subgridSize === subgridSize - 1) {
            cell.style.borderRight = "4px solid black";
        }
        if (row % subgridSize === subgridSize - 1) {
            cell.style.borderBottom = "4px solid black";
        }
        if (col % subgridSize === 0) {
            cell.style.borderLeft = "4px solid black";
        }
        if (row % subgridSize === 0) {
            cell.style.borderTop = "4px solid black";
        }
        grid.appendChild(cell);
    }
}
