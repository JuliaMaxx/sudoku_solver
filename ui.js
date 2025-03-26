const slider = document.getElementById("slider");
const output = document.getElementById("sliderValue");

const validSizes = [2, 3, 4, 5, 6, 7].map(num => num * num);

function getClosestValidSize(value) {
    let closest = validSizes.reduce((prev, curr) => 
        Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev
    );
    return closest;
}

function updateSliderBackground() {
    const value = (slider.value - slider.min) / (slider.max - slider.min) * 100;
    slider.style.setProperty('--value', `${value}%`);
}

function initializeSlider() {
    slider.value = getClosestValidSize(slider.value);
    output.textContent = `${slider.value} x ${slider.value}`;
    updateSliderBackground();
}

slider.addEventListener("input", () => {
    slider.value = getClosestValidSize(slider.value);
    output.textContent = `${slider.value} x ${slider.value}`;
    updateSliderBackground();
});

initializeSlider();
