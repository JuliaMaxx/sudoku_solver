import { grid } from "./config.js";
import { cells } from "./config.js";
import { gridSize } from "./config.js";
import { subgridSize } from "./config.js";
import { cellValues } from "./config.js";
import { validateCell } from "./config.js";
import { setGridSize } from "./config.js";
import { resetCells } from "./config.js";
import { generated } from "./config.js";
import { solutionValues } from "./controls.js";

window.onload = () => {
    setGridSize(9);
    generateGrid();
    cells[0].focus();

    // Add click event listener to each cell to mark it as 'selected' when clicked
    cells.forEach(cell => {
        cell.addEventListener("click", () => {
            // Remove 'selected' class from any other cell
            document.querySelectorAll('.active').forEach(c => c.classList.remove('active'));
            // Add 'selected' class to clicked cell
            cell.classList.add('active');
        });
    });

}

export function generateGrid(){
    grid.innerHTML = "";
    resetCells();

    grid.style.gridTemplateColumns = `repeat(${gridSize}, auto)`;
    grid.style.gridTemplateRows = `repeat(${gridSize}, auto)`;
    
    for(let row = 0; row < gridSize; row++) {
        for(let col = 0; col < gridSize; col++) {
            const cell = document.createElement("input");
            cell.classList.add("sudoku-cell");
            cell.type = "text"; 
            if (gridSize === 16) {
                cell.inputMode = "text"; 
            } else {
                cell.inputMode = "numeric"; 
            }
            cell.dataset.row = row; 
            cell.dataset.col = col; 
            setTimeout(() => {
                styleCell(cell)
                cell.blur();
            }, 0)
    
            cell.addEventListener("input", handleCellInput);
            cell.addEventListener("focus", highlightRowColSubgrid);
            cell.addEventListener("blur", removeHighlight);
            subgridSeparation(cell);
            cell.addEventListener("keydown", handleCellKeyDown);

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

function styleCell(cell){
    if (gridSize == 16){
        cell.style.fontSize = `1rem`; 
        grid.style.gap = "0.07rem";
        cell.style.boxShadow = "0.001rem 0.001rem 0.001rem 0.001rem var(--primary-color-transparent);"
        cell.style.padding = `0`;
    } else if (gridSize == 9){
        cell.style.fontSize = `1.2rem`; 
        grid.style.gap = "0.3rem";
    } else {
        cell.style.fontSize = `2rem`; 
        grid.style.gap = "0.3rem";
    }
}

function handleCellInput(event){
    const cell = event.target;
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);

    let regex = gridSize === 16 ? /[^1-9A-G]/gi : new RegExp(`[^1-${gridSize}]`, "g");

    let newValue = cell.value.replace(regex, ''); 

    if (newValue.length > 0) {
        const lastCharacter=  newValue.slice(-1).toUpperCase();
        cell.value = lastCharacter;

        cellValues[row][col] = gridSize === 16 ? parseInt(lastCharacter, 17) : parseInt(lastCharacter);
        const valid = generated?
            cellValues[row][col] === solutionValues[row][col]:
            validateCell(row, col);

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
        cell.value = "";
        cellValues[row][col] = 0;
        cell.classList.remove("invalid");
        cell.classList.remove("valid");
    }
}

function handleCellKeyDown(event){
    const cell = event.target;
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);

    if (event.key === "ArrowRight") moveFocus(row, col, "right");
    if (event.key === "ArrowLeft") moveFocus(row, col, "left");
    if (event.key === "ArrowUp") moveFocus(row, col, "up");
    if (event.key === "ArrowDown") moveFocus(row, col, "down");

    if (event.key === "Backspace" && cell.value === "") {
        moveFocus(row, col, "left");
    }
}

function subgridSeparation(cell){
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);

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
}

function removeHighlight(){
    resetZoom();
    cells.forEach(cell => {
        cell.classList.remove("highlight-row", "highlight-col", "highlight-subgrid");
    });
    return;
}


function highlightRowColSubgrid(event) {
    const cell = event.target;
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);

    zoomInOnFocus(cell);

    // Highlight the entire row
    cells.forEach(cell => {
        const cellRow = parseInt(cell.dataset.row);
        if (cellRow === row) {
            cell.classList.add("highlight-row");
        } else {
            cell.classList.remove("highlight-row");
        }
    });

    // Highlight the entire column
    cells.forEach(cell => {
        const cellCol = parseInt(cell.dataset.col);
        if (cellCol === col) {
            cell.classList.add("highlight-col");
        } else {
            cell.classList.remove("highlight-col");
        }
    });

    // Highlight the subgrid
    const subgridRowStart = Math.floor(row / subgridSize) * subgridSize;
    const subgridColStart = Math.floor(col / subgridSize) * subgridSize;

    cells.forEach(cell => {
        const cellRow = parseInt(cell.dataset.row);
        const cellCol = parseInt(cell.dataset.col);
        if (cellRow >= subgridRowStart && cellRow < subgridRowStart + subgridSize &&
            cellCol >= subgridColStart && cellCol < subgridColStart + subgridSize) {
            cell.classList.add("highlight-subgrid");
        } else {
            cell.classList.remove("highlight-subgrid");
        }
    });
}

function isMobile(){
    return window.innerWidth <= 768;
}

function zoomInOnFocus(cell){
    if(isMobile()) {
        document.querySelector("meta[name='viewport']").setAttribute('content', 'width=device-width, initial-scale=1.5, maximum-scale=1.5, user-scalable=yes');

        cell.scrollIntoView({
            block: 'center',     // Vertically center the cell in the viewport
            inline: 'center'     // Horizontally center the cell in the viewport
        });
    }
}

function resetZoom(){
    if (isMobile()) {
        document.querySelector("meta[name='viewport']").setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=yes');
    }
}