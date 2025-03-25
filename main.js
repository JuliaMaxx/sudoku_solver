const grid = document.getElementById("sudoku-grid");
const gridSize = 9;
const subgridSize = Math.sqrt(gridSize);
const cells = [];

window.onload = () => {
    generateGrid();
    focusOnCell(0);
}

function generateGrid(){
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
                // Remove anything that is not 1-9
                this.value = this.value.replace(/[^1-9]/g, ''); 
                
                if (this.value.length === 1) {
                    // Find the next input and focus it
                    const index = cells.indexOf(this);
                    if (index !== -1 && index < cells.length - 1) {
                        focusOnCell(index + 1)
                    }
                }
            });
            
            if (col % subgridSize === subgridSize - 1) {
                cell.classList.add("right-border");
            }
            if (row % subgridSize === subgridSize - 1) {
                cell.classList.add("bottom-border");
            }
            if (col % subgridSize === 0) {
                cell.classList.add("left-border");
            }
            if (row % subgridSize === 0) {
                cell.classList.add("top-border");
            }
    
            grid.appendChild(cell);
            cells.push(cell); 
        }
    }
}

function focusOnCell(index){
    cells[index].focus();
}