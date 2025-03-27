import { setGridSize } from "./config.js";
import { generateGrid } from "./main.js";
import { grid } from "./config.js";

const buttonSize4 = document.getElementById("4sizeButton");
const buttonSize9 = document.getElementById("9sizeButton");
const buttonSize16 = document.getElementById("16sizeButton");

buttonSize4.addEventListener('click', () => handleSizeButtonClick(4));
buttonSize9.addEventListener('click', () => handleSizeButtonClick(9));
buttonSize16.addEventListener('click', () => handleSizeButtonClick(16));

function handleSizeButtonClick(size){
    grid.innerHTML = "";
    setGridSize(size);
    generateGrid();
}