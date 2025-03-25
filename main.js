const grid = document.getElementById("sudoku-grid");
const gridSize = 9;
const subgridSize = Math.sqrt(gridSize);
const cells = [];

grid.style.gridTemplateColumns = `repeat(${gridSize}, auto)`;
grid.style.gridTemplateRows = `repeat(${gridSize}, auto)`;

for(let row = 0; row < gridSize; row++) {
    for(let col = 0; col < gridSize; col++) {
        const cell = document.createElement("input");
        cell.classList.add("sudoku-cell");
        cell.type = "text"; 
        cell.maxLength = 1; 
        cell.inputMode = "numeric"; 
        cell.pattern = "[1-9]"; 

        cell.addEventListener("input", function () {
            this.value = this.value.replace(/[^1-9]/g, ''); // Remove anything that is not 1-9
            
            if (this.value.length === 1) {
                // Find the next input and focus it
                const index = cells.indexOf(this);
                if (index !== -1 && index < cells.length - 1) {
                    cells[index + 1].focus();
                }
            }
        });
        
        if (col % subgridSize === subgridSize - 1) {
            cell.style.marginRight = "4px";
        }
        if (row % subgridSize === subgridSize - 1) {
            cell.style.marginBottom = "4px";
        }
        if (col % subgridSize === 0) {
            cell.style.marginLeft = "4px";
        }
        if (row % subgridSize === 0) {
            cell.style.marginTop = "4px";
        }
        grid.appendChild(cell);
        cells.push(cell); 
    }
}
