import { setGridSize } from "./config.js";
import { generateGrid } from "./main.js";
import { grid } from "./config.js";

const buttonSize4 = document.getElementById("4sizeButton");
const buttonSize9 = document.getElementById("9sizeButton");
const buttonSize16 = document.getElementById("16sizeButton");
const blackPinkTheme = document.getElementById("blackPink");
const blackWhiteTheme = document.getElementById("blackWhite");
const blackYellowTheme = document.getElementById("blackYellow");
const blackPurpleTheme = document.getElementById("blackPurple");
const themes = document.querySelectorAll('.theme');

buttonSize4.addEventListener('click', () => handleSizeButtonClick(4));
buttonSize9.addEventListener('click', () => handleSizeButtonClick(9));
buttonSize16.addEventListener('click', () => handleSizeButtonClick(16));

blackPinkTheme.addEventListener('click', (event) => handleTheme(event, '#000000', 'pink'))
blackWhiteTheme.addEventListener('click', (event) => handleTheme(event, '#000000', '#F2E8DF'))
blackYellowTheme.addEventListener('click', (event) => handleTheme(event, '#000000', '#fec279'))
blackPurpleTheme.addEventListener('click', (event) => handleTheme(event, '#000000', '#D2A2F2'))


function handleSizeButtonClick(size){
    grid.innerHTML = "";
    setGridSize(size);
    generateGrid();
}

function handleTheme(event, primaryColor, secondaryColor){
    document.documentElement.style.setProperty('--primary-color', primaryColor);
    document.documentElement.style.setProperty('--primary-color-transparent', `${primaryColor}84`);
    document.documentElement.style.setProperty('--background-color', secondaryColor);
    deselectThemes();
    event.target.classList.add('selected');
}

function deselectThemes(){
    [...themes].forEach(theme => {
        theme.classList.remove('selected');
    });
}