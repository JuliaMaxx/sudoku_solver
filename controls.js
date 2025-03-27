import { cellValues } from "./config.js";
import { validateCell } from "./config.js";
import { gridSize } from "./config.js";
import { cells } from "./config.js";
import { initializeCellValues } from "./config.js";

const solveButton = document.getElementById("solveButton");
const generateButton = document.getElementById("generateButton");
const resetButton = document.getElementById("resetButton");
const modal = document.getElementById("difficultyModal");
const closeModalBtn = document.getElementById("closeModal");
const difficultyButtons = document.querySelectorAll(".difficulty-btn");

generateButton.addEventListener("click", () => {
    modal.style.display = "flex";
})

resetButton.addEventListener("click", () => {
    resetGrid();
})

// GENERATE
function generateSudoku(difficulty){
    if (!cellValues || !Array.isArray(cellValues) || cellValues.length !== gridSize) {
        initializeCellValues();
    }
    
    resetGrid();
    let clues = 
    difficulty === "easy" ? parseInt(gridSize*gridSize / 2):
    difficulty === "medium" ? parseInt(gridSize*gridSize / 3):
    parseInt(gridSize*gridSize / 4)
    
    let placed = 0;
    while (placed < clues){
        let row = Math.floor(Math.random() * gridSize);
        let col = Math.floor(Math.random() * gridSize);
        let num = Math.floor(Math.random() * gridSize) + 1;
        if (cellValues[row][col] === 0){
            cellValues[row][col] = num;
            if (!validateCell(row, col)){
                cellValues[row][col] = 0;
            } else {
                placed++;
            }
        }
    }
    
    cells.forEach((cell) => {
        let row = parseInt(cell.dataset.row);
        let col = parseInt(cell.dataset.col);
        let value = cellValues[row][col];

        if (value !== 0) {
            cell.value = value;
            cell.readOnly = true; 
        }
    });
}

// RESET
function resetGrid(){
    initializeCellValues();
    cellValues.forEach(row => row.fill(0));
    cells.forEach((cell) => {
        cell.value = "";
        cell.readOnly = false; 
    });
}

closeModalBtn.addEventListener("click", () => {
    modal.style.display = "none";
});

difficultyButtons.forEach(button => {
    button.addEventListener("click", (event) => {
        const level = event.target.getAttribute("data-level");
        generateSudoku(level)
        modal.style.display = "none";
    });
});
