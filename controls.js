import { cellValues } from "./config.js";
import { validateCell } from "./config.js";
import { gridSize } from "./config.js";
import { cells } from "./config.js";
import { initializeCellValues } from "./config.js";
import { setCellValues } from "./config.js";
import { subgridSize } from "./config.js";
import { generated } from "./config.js";
import { setGenerate } from "./config.js";
import { solvedGridStyle } from "./config.js";
import { grid } from "./config.js";

const solveButton = document.getElementById("solveButton");
const solveCellButton = document.getElementById("solveCellButton");
const generateButton = document.getElementById("generateButton");
const resetButton = document.getElementById("resetButton");
const modal = document.getElementById("difficultyModal");
const closeModalBtn = document.getElementById("closeModal");
const difficultyButtons = document.querySelectorAll(".difficulty-btn");

export let solutionValues = [];

solveButton.addEventListener("click", () => {
    if (aiSolveSudoku()) {
        console.log("Sudoku Solved with AI!");
    } else {
        console.log("AI failed, using backtracking...");
    }
    updateGridDisplay();
    solvedGridStyle();
})

solveCellButton.addEventListener("click", () => {
    solveSudoku();
    solveCell();
});

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

    generateRandomSudokuSolution();
    solutionValues = cellValues.map(row => [...row]);

    let clues = 
    difficulty === "easy" ? parseInt(gridSize*gridSize * 0.3):
    difficulty === "medium" ? parseInt(gridSize*gridSize * 0.5):
    parseInt(gridSize*gridSize * 0.6)
    
    let puzzle = solutionValues.map(row => [...row]);

    while (clues > 0){
        let row = Math.floor(Math.random() * gridSize);
        let col = Math.floor(Math.random() * gridSize);
        
        
        if (puzzle[row][col] !== 0) {
            let backup = puzzle[row][col];
            puzzle[row][col] = 0;
            
            let tempGrid = puzzle.map(r => [...r]);
            if (!hasUniqueSolution(tempGrid)) {
                puzzle[row][col] = backup; 
            } else {
                clues--;
            }
        }
    }

    setCellValues(puzzle.map(row => [...row]));
    updateGridDisplay();
    setGenerate(true);
}

// MODAL
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

// RESET
function resetGrid(){
    initializeCellValues();
    setGenerate(false);
    grid.classList.remove('solved');
    cellValues.forEach(row => row.fill(0));
    cells.forEach((cell) => {
        cell.classList.remove('valid');
        cell.classList.remove('invalid');
        cell.value = "";
        cell.readOnly = false; 
    });
}

// SOLVE
function findNextEmptyCell() {
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            if (cellValues[row][col] === 0) return [row, col];
        }
    }
    return null;
}

function findNextEmptyCellValue() {
    let empty = null;
    for (let i = 0; i < cells.length; i++){
        if (cells[i].value === '') {
            empty = cells[i];
            break;
        } 
    }
    return empty;
}

function solveSudoku(randomize = false) {
    if (generated){
        setCellValues(solutionValues.map(row => [...row]));
        setGenerate(false);
        return true;
    } else {
        const emptyCell = findNextEmptyCell();
        if (!emptyCell) return true;
    
        const [row, col] = emptyCell;
        const possibleNumbers =  [...Array(gridSize)].map((_, i) => (i + 1));
        if (randomize) shuffleArray(possibleNumbers);
    
        for (let num of possibleNumbers) {
            cellValues[row][col] = num;
            if (validateCell(row, col)) {
                if (solveSudoku()) return true; 
            }
            cellValues[row][col] = 0;
        }
        return false;
    }
}

// AI SOLVE
function applyConstraintPropagation(){
    let progress = false;
    const possibleNumbers =  [...Array(gridSize)].map((_, i) => (i + 1));

    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            if (cellValues[row][col] === 0) {
                if (possibleNumbers.length === 1) {
                    cellValues[row][col] = possibleNumbers[0];
                    progress = true;
                }
            }
        }
    }

    return progress;
}

function aiSolveSudoku() {
    let changed;

    do {
        changed = applyConstraintPropagation(gridSize);
    } while (changed);

    return solveSudoku();
}


function solveCell(){
    let activeCell = null;
    cells.forEach((cell) => {
        if (cell.classList.contains('active')){
            activeCell = cell;
        }
    })

    if (activeCell){
        let row = parseInt(activeCell.dataset.row);
        let col = parseInt(activeCell.dataset.col);
        let value = cellValues[row][col];
        value = value > 9? String.fromCharCode(value + 55) : value;
        activeCell.value = value;
        document.querySelectorAll('.active').forEach(c => c.classList.remove('active'));
    } else {
        let nextCell = findNextEmptyCellValue();
        let row = parseInt(nextCell.dataset.row);
        let col = parseInt(nextCell.dataset.col);
        let value = cellValues[row][col];
        value = value > 9? String.fromCharCode(value + 55) : value;
        nextCell.value = value;
    }
}


// UTILITY
function hasUniqueSolution(grid) {
    let solutions = 0;

    function solver(grid) {
        if (solutions > 1) return; 

        let emptyCell = findNextEmptyCell(grid);
        if (!emptyCell) {
            solutions++;
            return;
        }

        const [row, col] = emptyCell;
        const possibleNumbers = [...Array(gridSize)].map((_, i) => (i + 1));
        shuffleArray(possibleNumbers);

        for (let num of possibleNumbers) {
            grid[row][col] = num;

            if (validateCell(row, col, grid)) {
                solver(grid);
            }

            grid[row][col] = 0; 
        }
    }

    solver(grid.map(r => [...r])); // Solve a copy of the grid
    return solutions === 1;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function generateRandomSudokuSolution() {
    setCellValues(Array.from({ length: gridSize }, () => Array(gridSize).fill(0)));

    for (let i = 0; i < gridSize; i += subgridSize) {
        fillDiagonalSubgrid(i, i);
    }

    solveSudoku(true);

    applyRandomTransformations();
}

function fillDiagonalSubgrid(startRow, startCol) {
    let numbers = [...Array(gridSize)].map((_, i) => i + 1);
    shuffleArray(numbers);

    let index = 0;
    for (let r = startRow; r < startRow + subgridSize; r++) {
        for (let c = startCol; c < startCol + subgridSize; c++) {
            cellValues[r][c] = numbers[index++];
        }
    }
}

function applyRandomTransformations() {
    let transformations = [swapRows, swapColumns, mirrorGrid, transposeGrid];
    shuffleArray(transformations);

    transformations.forEach(transformation => transformation());
}

function swapRows() {
    let subgrid = Math.floor(Math.random() * subgridSize) * subgridSize;
    let row1 = subgrid + Math.floor(Math.random() * subgridSize);
    let row2 = subgrid + Math.floor(Math.random() * subgridSize);

    [cellValues[row1], cellValues[row2]] = [cellValues[row2], cellValues[row1]];
}

function swapColumns() {
    let subgrid = Math.floor(Math.random() * subgridSize) * subgridSize;
    let col1 = subgrid + Math.floor(Math.random() * subgridSize);
    let col2 = subgrid + Math.floor(Math.random() * subgridSize);

    for (let row = 0; row < gridSize; row++) {
        [cellValues[row][col1], cellValues[row][col2]] = [cellValues[row][col2], cellValues[row][col1]];
    }
}

function mirrorGrid() {
    cellValues.forEach(row => row.reverse());
}

function transposeGrid() {
    let newGrid = Array.from({ length: gridSize }, () => Array(gridSize).fill(0));

    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            newGrid[col][row] = cellValues[row][col];
        }
    }

    setCellValues(newGrid);
}

function updateGridDisplay(){
    cells.forEach((cell) => {
        let row = parseInt(cell.dataset.row);
        let col = parseInt(cell.dataset.col);
        let value = cellValues[row][col];
        value = value > 9? String.fromCharCode(value + 55) : value;
    
        if (value !== 0) {
            cell.value = value;
            // cell.readOnly = true; 
        }
    });
}