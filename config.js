// DOM
export const grid = document.getElementById("sudoku-grid");

export let gridSize = 9;
export const subgridSize = Math.sqrt(gridSize);
export const cells = [];
export const cellValues = Array.from({length: gridSize}, () => Array(gridSize).fill(0));