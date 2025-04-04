import { setGridSize } from "./config.js";
import { generateGrid } from "./main.js";
import { grid } from "./config.js";

const buttonSize4 = document.getElementById("4sizeButton");
const buttonSize9 = document.getElementById("9sizeButton");
const buttonSize16 = document.getElementById("16sizeButton");
const theme1 = document.getElementById("theme1");
const theme2 = document.getElementById("theme2");
const theme3 = document.getElementById("theme3");
const theme4 = document.getElementById("theme4");
const themes = document.querySelectorAll('.theme');

buttonSize4.addEventListener('click', () => handleSizeButtonClick(4));
buttonSize9.addEventListener('click', () => handleSizeButtonClick(9));
buttonSize16.addEventListener('click', () => handleSizeButtonClick(16));

theme1.addEventListener('click', (event) => handleTheme(event, '#000000', '#F2C4DA', `327, 100%, 50%`))
theme2.addEventListener('click', (event) => handleTheme(event, '#000000', '#F2E8DF', '132, 97%, 39%'))
theme3.addEventListener('click', (event) => handleTheme(event, '#e2a75e','#003c00', '43, 100%, 50%'))
theme4.addEventListener('click', (event) => handleTheme(event, '#ba7ee2','#140126', '307, 100%, 50%'))


function handleSizeButtonClick(size){
    grid.innerHTML = "";
    setGridSize(size);
    generateGrid();
}

function handleTheme(event, primaryColor, secondaryColor, neonColor){
    if (event.target === theme1 || event.target === theme2) {
        document.documentElement.style.setProperty('--row-highlight', 'rgba(56, 255, 56, 0.3)');
        document.documentElement.style.setProperty('--col-highlight', 'rgba(65, 65, 255, 0.3)');
        document.documentElement.style.setProperty('--subgrid-highlight', 'rgba(255, 255, 62, 0.3)');
    } else {
        document.documentElement.style.setProperty('--row-highlight', 'rgba(0, 154, 149, 0.3)');
        document.documentElement.style.setProperty('--col-highlight', 'rgba(160, 0, 51, 0.3)');
        document.documentElement.style.setProperty('--subgrid-highlight', 'rgba(145, 152, 0, 0.3)');
    }
    document.documentElement.style.setProperty('--primary-color', primaryColor);
    document.documentElement.style.setProperty('--primary-color-transparent', `${primaryColor}84`);
    document.documentElement.style.setProperty('--background-color', secondaryColor);
    document.documentElement.style.setProperty('--neon-glow', neonColor);
    deselectThemes();
    event.target.classList.add('selected');
}

function deselectThemes(){
    [...themes].forEach(theme => {
        theme.classList.remove('selected');
    });
}