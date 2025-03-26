document.addEventListener("DOMContentLoaded", () => {
    const slider = document.getElementById("slider");
    const output = document.getElementById("sliderValue");

    function updateSliderBackground() {
        const value = (slider.value - slider.min) / (slider.max - slider.min) * 100;
        slider.style.setProperty('--value', `${value}%`); 
    }

    updateSliderBackground();

    slider.addEventListener("input", () => {
        output.textContent = `${slider.value}x${slider.value}`;
        updateSliderBackground();
    });
});
