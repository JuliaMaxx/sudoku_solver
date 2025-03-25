const grid = document.getElementById("sudoku-grid");
const gridSize = 9;
const subgridSize = Math.sqrt(gridSize);

grid.style.gridTemplateColumns = `repeat(${gridSize}, 50px)`;
grid.style.gridTemplateRows = `repeat(${gridSize}, 50px)`;

for(let row = 0; row < gridSize; row++) {
    for(let col = 0; col < gridSize; col++) {
        const cell = document.createElement("div");
        cell.classList.add("sudoku-cell");

        grid.appendChild(cell);
    }
}
