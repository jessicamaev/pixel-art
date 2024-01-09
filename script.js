//initial reference

let container = document.querySelector(".container");
let gridButton = document.getElementById("submit-grid");
let clearGridButton = document.getElementById("clear-grid");
let gridWidth = document.getElementById("width-range");
let gridHeight = document.getElementById("height-range");
let colorButton = document.getElementById("color-input");
let eraseBtn = document.getElementById("erase-btn");
let paintBtn = document.getElementById("paint-btn");
let widthValue = document.getElementById("width-value");
let heightValue = document.getElementById("height-value");

//Create events object
let events = {
    mouse: {
        down: "mousedown",
        move: "mousemove",
        up: "mouseup",
    },
    touch: {
        down: "touchstart",
        move: "touchmove",
        up: "touchend",
    },
};

let deviceType = "";

//Initially draw and erase would be false

let draw = false;
let erase = false;

//Function to detect touch device
const isTouchDevice = () => {
    try {
        //We try to create TouchEvent(it would fail for desktop and throw error)
        document.createEvent("TouchEvent");
        deviceType = "touch";
        return true;
    } catch (e) {
        deviceType = "mouse";
        return false;
    }
};

isTouchDevice();

// Function to create grid

gridButton.addEventListener("click", () => {
    //Start with clear grid
    container.innerHTML = "";
    //count variable for generating unique ids
    let count = 0;
    //loop for creating rows
    for (let i = 0; i < gridHeight.value; i++) {
        //incrementing count by 2
        count += 2;
        //Create row div
        let div = document.createElement("div");
        div.classList.add("gridRow");
        //Create columns
        for (let j = 0; j < gridWidth.value; j++) {
            count += 2;
            let col = document.createElement("div");
            col.classList.add("gridCol");
            // unique id for all columns (for touchscreen)
            col.setAttribute("id", `gridCol${count}`);

            col.addEventListener(events[deviceType].down, () => {
                //user start drawing
                draw = true;
                //if erase = true then background = transparent colour
                if (erase) {
                    col.style.backgroundColor = "transparent";
                } else {
                    col.style.backgroundColor = colorButton.value;
                }
            });

            col.addEventListener(events[deviceType].move, (e) => {
                let elementId = document.elementFromPoint(
                    !isTouchDevice() ? e.clientX : e.touches[0].clientX,
                    !isTouchDevice() ? e.clientY : e.touches[0].clientY
                ).id;
                //checker
                checker(elementId);
            });
            //stop drawing
            col.addEventListener(events[deviceType].up, () => {
                draw = false;
            });
            // append columns
            div.appendChild(col);
        }
        //append grid to container
        container.appendChild(div);
    }
});
function checker(elementId) {
    let gridColumns = document.querySelectorAll(".gridCol");
    //loop through all boxes
    gridColumns.forEach(element => {
        //if id matches then color
        if (elementId == element.id) {
            if (draw && !erase) {
                element.style.backgroundColor = colorButton.value;
            }
            else if (draw && erase) {
                element.style.backgroundColor = "transparent";
            }
        }
    });
}

//add event listeners to clear grid
clearGridButton.addEventListener("click", () => {
    container.innerHTML = "";
});
//erase button
eraseBtn.addEventListener("click", () => {
    erase = true;
});
//paint brush
paintBtn.addEventListener("click", () => {
    erase = false;
});

//Display grid width and height

gridWidth.addEventListener("input", () => {
    widthValue.innerHTML =
        gridWidth.value < 9 ? `0${gridWidth.value}` : gridWidth.value;
});

gridHeight.addEventListener("input", () => {
    heightValue.innerHTML =
        gridHeight.value < 9 ? `0${gridHeight.value}` : gridHeight.value;
});

window.onload = () => {
    gridWidth.value = 0;
    gridHeight.value = 0;
};