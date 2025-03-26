import { grid } from "./config.js";
import { cells } from "./config.js";
import { gridSize } from "./config.js";
import { subgridSize } from "./config.js";
import { cellValues } from "./config.js";
import { validateCell } from "./config.js";

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
            cell.inputMode = "numeric"; 
            cell.pattern = "[1-9]"; 
            cell.dataset.row = row; 
            cell.dataset.col = col; 
    
            cell.addEventListener("input", function () {
                let newValue = this.value.replace(/[^1-9]/g, ''); 

                if (newValue.length > 0) {
                    const lastNumber =  newValue[newValue.length - 1]
                    this.value = lastNumber;
                    cellValues[row][col] = parseInt(lastNumber);
                    const valid = validateCell(row, col);

                    if (valid){
                        cell.classList.add("valid");
                        cell.classList.remove("invalid");
                        moveFocus(row, col, "right"); 
                    } else {
                        cell.classList.add("invalid");
                        cell.classList.remove("valid");
                    }
                }
                else{
                    this.value = "";
                    cellValues[row][col] = 0;
                    cell.classList.remove("invalid");
                    cell.classList.remove("valid");
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

            cell.addEventListener("keydown", function (event) {
                if (event.key === "ArrowRight") moveFocus(row, col, "right");
                if (event.key === "ArrowLeft") moveFocus(row, col, "left");
                if (event.key === "ArrowUp") moveFocus(row, col, "up");
                if (event.key === "ArrowDown") moveFocus(row, col, "down");

                if (event.key === "Backspace" && this.value === "") {
                    moveFocus(row, col, "left");
                }
            });

            grid.appendChild(cell);
            cells.push(cell); 
        }
    }
}

function moveFocus(row, col, direction) {
    let newRow = row, newCol = col;
    
    while (true) {
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