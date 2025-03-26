import { cellValues } from "./config.js";
import { validateCell } from "./config.js";
import { gridSize } from "./config.js";
import { cells } from "./config.js";

const generateButton = document.getElementById("generateButton");
const resetButton = document.getElementById("resetButton");

generateButton.addEventListener("click", () => {
    generateSudoku("easy");
})

resetButton.addEventListener("click", () => {
    resetGrid();
})

function generateSudoku(difficulty){
    resetGrid();

    let clues = 
    difficulty === "easy" ? parseInt(gridSize*gridSize / 2):
    difficulty === "medium" ? parseInt(gridSize*gridSize / 3):
    parseInt(gridSize*gridSize / 4)

    let placed = 0;
    while (placed < clues){
        let row = Math.floor(Math.random() * 9);
        let col = Math.floor(Math.random() * 9);
        let num = Math.floor(Math.random() * 9) + 1;

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
        let row = cell.dataset.row;
        let col = cell.dataset.col;
        let value = cellValues[row][col];

        if (value !== 0) {
            cell.value = value;
            cell.readOnly = true; 
        }
    });
}

function resetGrid(){
    cellValues.forEach(row => row.fill(0));
    cells.forEach((cell) => {
        cell.value = "";
        cell.readOnly = false; 
    });
}