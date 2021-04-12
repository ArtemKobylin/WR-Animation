/**************************************************/
/***********GLOBAL OBJECTS & VARIABLES*************/
const initSystemType = "double rail" //temporary variable for testing
const initPosition = "front" //temporary variable for testing
const initPullingSide = "B" //temporary variable for testing

const showWindowCheckbox = document.getElementById("show-window")
showWindowCheckbox.checked = true
sys.isWindowActive = showWindowCheckbox.checked

const systemTypeSelect = document.getElementById("system-type")
systemTypeSelect.value = initSystemType
const windowPositionSelect = document.getElementById("window-position")
windowPositionSelect.value = initPosition
const pullingSideSelect = document.getElementById("pulling-side")
pullingSideSelect.value = initPullingSide
sys.pullingSide = pullingSideSelect.value 

const angleInputBar = document.getElementById("angle")
angleInputBar.value = 10

const strokeInputBar = document.getElementById("stroke")
strokeInputBar.value = 400

const sliderBar = document.getElementById("strokeRange");
var strokeOutput = document.getElementById("strokeOutput");
strokeOutput.innerHTML = sliderBar.value; // Display the default slider value
sliderBar.setAttribute("max", strokeInputBar.value)
let updatePeriod
/***********GLOBAL OBJECTS & VARIABLES*************/
/**************************************************/

/***************** ANIMATION **************/
const createSystem = () => {
    const inputData = defineInputData(systemTypeSelect.value, windowPositionSelect.value)

    sys.initElem(inputData)
    sys.calculateElem(inputData)
    sys.renderElem(gui.context1, gui.context2)
}

const updateSystem = () => {
    const inputData = defineInputData(systemTypeSelect.value, windowPositionSelect.value)

    sys.updateElem(inputData)
    sys.calculateElem(inputData)
    sys.renderElem(gui.context1, gui.context2)
}

const rerenderSliders = () => {
    gui.clear2()
    sys.slider.forEach(elem => {
        elem.render(gui.context2)
    })
    if (sys.isWindowActive) {
        sys.window.render(gui.context2) 
    }
}
/***************** ANIMATION **************/

/********* RUN THE SCRIPT *********/
const startAnimation = () => {
    gui.start()
    createSystem()

    /***********EVENT HANDLING *** EVENT HANDLING *** EVENT HANDLING*************/

    /************ SET UP CONSTRUCTION **************/
    angleInputBar.addEventListener("change", (event) => {
        if (event.target.value >= -20 && event.target.value <= 20) {
            gui.clear1()
            gui.clear2()
            updateSystem()
        } else {
            alert("Angle interval: [-20°, 20°]")
        }
    })
    strokeInputBar.addEventListener("change", (event) => {
        if (event.target.value >= 100 && event.target.value <= 800) {
            gui.clear1()
            gui.clear2()
            updateSystem()
            sliderBar.setAttribute("max", event.target.value)
        } else {
            alert("Stroke interval: [100mm, 800mm]")
        }
    })
    systemTypeSelect.addEventListener("change", () => {
        gui.clear1()
        gui.clear2()
        sys.deleteElem()
        createSystem()
    })

    windowPositionSelect.addEventListener("change", (event) => {
        angleInputBar.value = event.target.value === "front" ? 10 : 0 //consider how to store initial data in JSON to reduce input-data.js code
        gui.clear1()
        gui.clear2()
        updateSystem()
    })

    pullingSideSelect.addEventListener("change", (event) => {
        sys.pullingSide = event.target.value
        if (systemTypeSelect.value === "double rail") {
            gui.clear1()
            gui.clear2()
            updateSystem()
        } else {
            alert("Pulling side selection is relevant only for double rail system")
        }
    })

    showWindowCheckbox.addEventListener("change", (event) => {
        sys.isWindowActive = event.target.checked
        rerenderSliders()
    })
    /************* SET UP CONSTRUCTION ************/

    /************ MANIPULATION WITH SLIDERS ************/
    sliderBar.addEventListener("input", (event) => {
        strokeOutput.innerHTML = event.target.value

        const teta = -sys.slider[0].angle
        const stroke = event.target.value
        const [strokeX, strokeY] = [stroke * Math.sin(teta) * gui.scale, stroke * Math.cos(teta) * gui.scale]
        
        inputData = defineInputData(systemTypeSelect.value, windowPositionSelect.value)

        //updating sliders position
        sys.slider.forEach((obj, index) => {
            obj.x = inputData.slider[index].x - strokeX
            obj.y = inputData.slider[index].y - strokeY
        })
        sys.window.fp.forEach((obj, index) => {
            obj.x = inputData.slider[index].x - strokeX
            obj.y = inputData.slider[index].y - strokeY
        })
        //updating window control points
        sys.window.cp.forEach((obj, index) => {
            obj.x = inputData.window.controlPoints[index].x - strokeX
            obj.y = inputData.window.controlPoints[index].y - strokeY
        })
        //updating window center of gravity
        sys.window.cog.x = inputData.window.centerOfGravity.x - strokeX
        sys.window.cog.y = inputData.window.centerOfGravity.y - strokeY
        
        const period = 10 // ms
        updatePeriod = setInterval(rerenderSliders, period)
    })

    sliderBar.addEventListener("mouseup", clearInterval(updatePeriod))
    /************* MANIPULATION WITH SLIDERS **********/

    /***********EVENT HANDLING *** EVENT HANDLING *** EVENT HANDLING*************/
}

startAnimation()
/********* RUN THE SCRIPT *********/