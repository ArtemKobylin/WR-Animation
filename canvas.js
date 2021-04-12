const mainCanvasContainer = document.querySelector(".canvas")
/* const initSystemType = "double rail" //temporary variable for testing
const initPosition = "rear" //temporary variable for testing */

const gui = {
    canvas1: document.getElementById("canvas1"),
    canvas2: document.getElementById("canvas2"),
    scale: 0.5,
    simXScope: {
        xMin: 1500,
        xMax: 2700,
        yMin: 900,
        yMax: 2300,
        xTransform(externX) {
            externX = gui.scale * (externX - this.xMin) //scope for "this" operator??????
            return externX
        },
        yTransform(externY) {
            externY = gui.canvas1.height - gui.scale * (externY - this.yMin)
            return externY
        }
    },
    start() {
        this.canvas1.width = this.scale * (this.simXScope.xMax - this.simXScope.xMin)
        this.canvas1.height = this.scale * (this.simXScope.yMax - this.simXScope.yMin)
        mainCanvasContainer.style.width = this.canvas1.width + "px"
        mainCanvasContainer.style.height = this.canvas1.height + "px"
        this.context1 = this.canvas1.getContext("2d")

        this.canvas2.width = this.canvas1.width
        this.canvas2.height = this.canvas1.height
        this.context2 = this.canvas2.getContext("2d")
    },
    clear1() {
        this.context1.clearRect(0, 0, this.canvas1.width, this.canvas1.height)
    },
    clear2() {
        this.context2.clearRect(0, 0, this.canvas2.width, this.canvas2.height)
    }
}