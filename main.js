const grid = document.getElementById("sudoku-grid");
const gridSize = 9;
const subgridSize = Math.sqrt(gridSize);
const cells = [];

window.onload = () => {
    generateGrid();
    cells[0].focus();
    
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
            cell.dataset.row = row; 
            cell.dataset.col = col; 
    
            cell.addEventListener("input", function () {
                // Remove anything that is not 1-9
                this.value = this.value.replace(/[^1-9]/g, ''); 
                
                if (this.value.length === 1) {
                    // Find the next input and focus it
                    const index = cells.indexOf(this);
                    if (this.value.length === 1) {
                        moveFocus(row, col, "right"); 
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

            // Handle arrow key navigation
            cell.addEventListener("keydown", function (event) {
                if (event.key === "ArrowRight") moveFocus(row, col, "right");
                if (event.key === "ArrowLeft") moveFocus(row, col, "left");
                if (event.key === "ArrowUp") moveFocus(row, col, "up");
                if (event.key === "ArrowDown") moveFocus(row, col, "down");

                // Backspace moves focus left if the cell is empty
                if (event.key === "Backspace" && this.value === "") {
                    moveFocus(row, col, "left");
                }
            });
            grid.appendChild(cell);
            cells.push(cell); 
        }
    }
}

// Function to move focus based on direction with wrapping
function moveFocus(row, col, direction) {
    let newRow = row, newCol = col;

    if (direction === "right") {
        newCol++;
        if (newCol >= gridSize) { // Wrap to next row
            newCol = 0;
            newRow = (row + 1) % gridSize;
        }
    }

    if (direction === "left") {
        newCol--;
        if (newCol < 0) { // Wrap to previous row
            newCol = gridSize - 1;
            newRow = (row - 1 + gridSize) % gridSize;
        }
    }

    if (direction === "down") {
        newRow = (row + 1) % gridSize; // Wrap to top if at last row
    }

    if (direction === "up") {
        newRow = (row - 1 + gridSize) % gridSize; // Wrap to bottom if at first row
    }

    const nextCell = document.querySelector(`[data-row="${newRow}"][data-col="${newCol}"]`);
    if (nextCell) {
        nextCell.focus();
        setTimeout(() => setCaretToEnd(nextCell), 0);
    }
}

// Function to set cursor at the end of the input field
function setCaretToEnd(cell) {
    const length = cell.value.length;
    cell.focus();
    cell.setSelectionRange(length, length);
}