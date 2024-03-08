const enhanceX2 = document.getElementById("enhanceX2");
const enhanceX3 = document.getElementById("enhanceX3");
const enhanceX4 = document.getElementById("enhanceX4");
const radioTwo = document.getElementById("radioTwo");
const radioThree = document.getElementById("radioThree");
const radioFour = document.getElementById("radioFour");

// get default setting

document.getElementById("downloadButton").addEventListener("click",
    function() { eel.bruh() });
document.getElementById("previewButton").addEventListener("click", print);

enhanceX2.addEventListener("click", function() { setRadioButton(radioTwo, 2); });
enhanceX3.addEventListener("click", function() { setRadioButton(radioThree, 3); });
enhanceX4.addEventListener("click", function() { setRadioButton(radioFour, 4); });

function print() {
    console.log("hello world");
}

function setRadioButton(radioInput, buttonInput) {
    radioInput.checked = true;
    enhanceX2.style.color = "wheat";
    enhanceX3.style.color = "wheat";
    enhanceX4.style.color = "wheat";
    enhanceX2.style.border = "15px outset black";
    enhanceX3.style.border = "15px outset black";
    enhanceX4.style.border = "15px outset black";
    
    switch(buttonInput) {
        case 2:
            enhanceX2.style.border = "15px inset orange";
            // set value of the default enhance level
        break;
        case 3:
            enhanceX3.style.border = "15px inset orange";
            // set value of the default enhance level
        break;
        case 4:
            enhanceX4.style.border = "15px inset orange";
            // set value of the default enhance level
        break;
    }

}

eel.expose(my_javascript_function);
function my_javascript_function(a, b, c, d) {
  if (a < b) {
    console.log(c * d);
  }
}