const relRotate = (rotAxis, vecs, angle) => {
    /*  rotAxis + rotMatrix * (vecs - rotAxis)
        [I - rotMatrix] * rotAxis + rotMatrix * vecs
        matrix = [I - rotMatrix]  */
    const rotMatrix = [[Math.cos(angle), Math.sin(angle)],[-Math.sin(angle), Math.cos(angle)]]
    const matrix = [[1 - Math.cos(angle), -Math.sin(angle)],[Math.sin(angle), 1 - Math.cos(angle)]]
    if (!Array.isArray(vecs)) {
        return {
            x: matrix[0][0] * rotAxis.x + matrix[0][1] * rotAxis.y + 
                rotMatrix[0][0] * vecs.x + rotMatrix[0][1] * vecs.y,
            y: matrix[1][0] * rotAxis.x + matrix[1][1] * rotAxis.y + 
                rotMatrix[1][0] * vecs.x + rotMatrix[1][1] * vecs.y
        }
    } else {
        return vecs.map((vec) => {
            return {
                x: matrix[0][0] * rotAxis.x + matrix[0][1] * rotAxis.y + 
                    rotMatrix[0][0] * vec.x + rotMatrix[0][1] * vec.y,
                y: matrix[1][0] * rotAxis.x + matrix[1][1] * rotAxis.y + 
                    rotMatrix[1][0] * vec.x + rotMatrix[1][1] * vec.y
            }
        })
    }
}

/*Function for converting coordinates of a scope of a slider into coordinates of a scope of another slider,
e.g. calcuation of pulley[0].x value ragarding slider[1]*/
const changeRefPoint = (newReferencePoint, coordinate, coordinateName) => {
    let i = 1, j = 0
    if (coordinateName === "x") {
        if (newReferencePoint === "slider[1]") {
            i = 0
            j = 1
        }
        return coordinate + sys.slider[i].x - sys.slider[j].x
    } else if (coordinateName === "y") {
        if (newReferencePoint === "slider[1]") {
            i = 0
            j = 1
        }
        return coordinate + sys.slider[i].y - sys.slider[j].y
    } else {
        if (!coordinate.hasOwnProperty("x") || !coordinate.hasOwnProperty("y")) {
            console.log("Parameter coordinate is not an object (constructor.js line 517)")
            return
        }
        if (newReferencePoint === "slider[1]") {
            i = 0
            j = 1
        }
        return {
            x: coordinate.x + sys.slider[i].x - sys.slider[j].x,
            y: coordinate.y + sys.slider[i].y - sys.slider[j].y
        }
    }
}

/*************************************************************/
/******CONSTRUCTIONS *** CONSTRUCTIONS *** CONSTRUCTIONS******/

/*****  PRIMITIVES *** PRIMITIVES *** PRIMITIVES *****/
class Circle {
    constructor({x = 100 * gui.scale, y = 100 * gui.scale, radius = 30 * gui.scale}) {
        this.x = x
        this.y = y
        this.radius = radius
    }
    render(ctx) {
        ctx.lineWidth = 12 * gui.scale
        ctx.strokeStyle = "black"
        ctx.fillStyle = "rgb(240, 230, 149)"
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI)
        ctx.stroke()
        ctx.fill()
    }
}

class Rectangle {
    constructor(x, y, width, height, angle) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.angle = angle
    }
    render(ctx) {
        ctx.fillStyle = "rgb(66, 66, 66)"
        ctx.save()
        ctx.translate(this.x, this.y)
        ctx.rotate(this.angle)
        ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height)
        ctx.restore()
    }
}

class Line {
    constructor({x1, y1, x2, y2, color = "black"}, {x: rotAxisX, y: rotAxisY, angle: rotAngle} = 0) {
        this.x1 = x1
        this.y1 = y1
        this.x2 = x2
        this.y2 = y2
        this.color = color
        this.rotAxisX = rotAxisX
        this.rotAxisY = rotAxisY
        this.rotAngle = rotAngle
    }
    render(ctx) {
        ctx.lineWidth = 4 * gui.scale
        ctx.strokeStyle = this.color
        ctx.save()
        ctx.translate(this.rotAxisX, this.rotAxisY)
        ctx.rotate(this.rotAngle)

        ctx.beginPath()
        ctx.moveTo(this.x1, this.y1)
        ctx.lineTo(this.x2, this.y2)
        ctx.stroke()

        ctx.restore()
    }
}

class QuadraticCurve {
    constructor(x1, y1, cpx, cpy, x2, y2) {
        this.x1 = x1
        this.y1 = y1
        this.x2 = x2
        this.y2 = y2
        this.cpx = cpx
        this.cpy = cpy
    }
    render(ctx) {
        ctx.lineWidth = 4 * gui.scale
        ctx.beginPath()
        ctx.moveTo(this.x1, this.y1)
        ctx.quadraticCurveTo(this.cpx, this.cpy, this.x2, this.y2)
        ctx.stroke()
    }
}

/***** WR COMPONENTS *** WR COMPONENTS *** WR COMPONENTS *****/
class Pulley {
    constructor({angle, stroke}, {radius = 30 * gui.scale, position}) {
        this.x = 100 * gui.scale
        this.y = 100 * gui.scale
        this.radius = radius
        this.position = position
        this.angle = angle
        this.stroke = stroke

        this.rotAxisX = 0
        this.rotAxisY = 0

        this.lineWidth = 10 * gui.scale
        this.strokeStyle = "black"
        this.fillStyle = "rgb(0, 181, 154)"
    }
    calculate({x: sliderX, y: sliderY, height: sliderHeight, width: sliderWidth}) {
        const sign = this.position.includes("A") ? 1 : -1
        this.x = sign * (this.radius + sliderWidth / 4)
        if (this.position.includes("upper")) {
            this.y = 0 - this.stroke - 0.5 * sliderHeight - this.radius - this.lineWidth
        } else if (this.position.includes("lower")) {
            this.y = 0.5 * sliderHeight + this.radius + this.lineWidth
        }
        this.rotAxisX = sliderX
        this.rotAxisY = sliderY
    }
    render(ctx) {
        ctx.lineWidth = this.lineWidth
        ctx.strokeStyle = this.strokeStyle
        ctx.fillStyle = this.fillStyle

        ctx.save()
        ctx.translate(this.rotAxisX, this.rotAxisY)
        ctx.rotate(this.angle)

        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI)
        ctx.stroke()
        ctx.fill()

        ctx.restore()
    }
}

class CableDrum { 
    constructor({angle, stroke}, {radius}) {
        this.x = 0
        this.y = 0
        this.radius = radius

        this.angle = angle
        this.stroke = stroke
        this.rotAxisX = 0
        this.rotAxisY = 0
        this.distanceFromSlider = 180

        this.lineWidth = 8 * gui.scale
        this.strokeStyle = "black"
        this.fillStyle = "rgb(180, 180, 180)"
    }
    calculate({x: slider1X, y: slider1Y}) {
        this.x = this.distanceFromSlider * gui.scale
        this.y = -0.6 * this.stroke
        this.rotAxisX = slider1X
        this.rotAxisY = slider1Y
    }
    render(ctx) {
        ctx.lineWidth = this.lineWidth
        ctx.strokeStyle = this.strokeStyle
        ctx.fillStyle = this.fillStyle

        ctx.save()
        ctx.translate(this.rotAxisX, this.rotAxisY)
        ctx.rotate(this.angle)

        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI)
        ctx.stroke()
        ctx.fill()

        ctx.restore()
    }
}


class Slider {
    constructor({angle}, {x, y, width, height, pillar = "none", radius = {tl: 12, tr: 12, br: 6, bl: 6}}) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.pillar = pillar
        this.radius = radius
        this.angle = angle

        this.lineWidth = 8 * gui.scale
        this.strokeStyle = "black"
        this.fillStyle = "rgb(66, 66, 66)"
    }
    render(ctx) {
        ctx.lineWidth = this.lineWidth
        ctx.strokeStyle = this.strokeStyle
        ctx.fillStyle = this.fillStyle
        ctx.save()
        ctx.translate(this.x, this.y)
        ctx.rotate(this.angle)

        ctx.beginPath();
        ctx.moveTo(-this.width / 2 + this.radius.tl, -this.height / 2);
        ctx.lineTo(this.width / 2 - this.radius.tr, -this.height / 2);
        ctx.quadraticCurveTo(this.width / 2, -this.height / 2, this.width / 2, -this.height / 2 + this.radius.tr);
        ctx.lineTo(this.width / 2, this.height / 2 - this.radius.br);
        ctx.quadraticCurveTo(this.width / 2, this.height / 2, this.width / 2 - this.radius.br, this.height / 2);
        ctx.lineTo(-this.width / 2 + this.radius.bl, this.height / 2);
        ctx.quadraticCurveTo(-this.width / 2, this.height / 2, -this.width / 2, this.height / 2 - this.radius.bl);
        ctx.lineTo(-this.width / 2, -this.height / 2 + this.radius.tl);
        ctx.quadraticCurveTo(-this.width / 2, -this.height / 2, -this.width / 2 + this.radius.tl, -this.height / 2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.restore()
    }
}

class Motor extends Slider {
    constructor({width, height} = {}) {
        super({angle: -Math.PI / 2}, {width, height})

        this.angle = angle - Math.PI / 2
        this.lineWidth = 3 * gui.scale
        this.strokeStyle = "black"
        this.fillStyle = "rgb(180, 180, 180)"
    }
    calculate({x: sliderX, y: sliderY, angle: sliderAngle}, {x: cableDrumX, y: cableDrumY}) {
        //debugger
        this.angle = sliderAngle - Math.PI / 2
        let vec = { /* these coordinates stay the same, so they should not be calculated every time
            the calculation function is called, but ones defined in constructor function*/
            x: sliderX + cableDrumX - 56 * gui.scale,
            y: sliderY + cableDrumY + 14 * gui.scale
        }
        vec = relRotate({x: sliderX, y: sliderY}, vec, -sliderAngle)
        this.x = vec.x
        this.y = vec.y
    }
}


class Cable {
    constructor({angle}) {
        this.x1 = 0
        this.y1 = 0
        this.x2 = 0
        this.y2 = 0
        this.lineWidth = 3 * gui.scale

        this.rotAxisX = 0
        this.rotAxisY = 0
        this.angle = angle
    }
    calculate({x: roller1X, y: roller1Y, radius: roller1Radius}, {x: roller2X, y: roller2Y, radius: roller2Radius}, {x: sliderX, y: sliderY, pillar}) {
        let sign = 0
        if (pillar === "A") {
            sign = -1
        } else if (pillar === "B") {
            sign = 1
        }
        this.x1 = roller1X + sign * (roller1Radius + this.lineWidth)
        this.x2 = roller2X + sign * (roller2Radius + this.lineWidth)

        this.y1 = roller1Y
        this.y2 = roller2Y
        this.rotAxisX = sliderX
        this.rotAxisY = sliderY
    }
    render(ctx) {
        ctx.lineWidth = this.lineWidth
        ctx.save()
        ctx.translate(this.rotAxisX, this.rotAxisY)
        ctx.rotate(this.angle)

        ctx.beginPath()
        ctx.moveTo(this.x1, this.y1)
        ctx.lineTo(this.x2, this.y2)
        ctx.stroke()

        ctx.restore()
    }
}

class Bowden {
    constructor({angle, type}) {
        this.x1 = 0
        this.y1 = 0
        this.x2 = 0
        this.y2 = 0
        this.cpx = 0
        this.cpy = 0

        this.rotAxis1X = 0
        this.rotAxis1Y = 0
        this.rotAxis2X = 0
        this.rotAxis2Y = 0
        this.angle = angle
        this.systemType = type

        this.lineWidth = 6 * gui.scale
        this.strokeStyle = "black"
    }
    calculate({x: roller1X, y: roller1Y, radius: roller1Radius, position: roller1Position},
              {x: roller2X, y: roller2Y, radius: roller2Radius, position: roller2Position},
              {x: slider1X, y: slider1Y} = 0,
              {x: slider2X, y: slider2Y} = 0) {      
        this.rotAxis1X = slider1X
        this.rotAxis1Y = slider1Y
        this.rotAxis2X = slider2X
        this.rotAxis2Y = slider2Y
        
        /* !!! BAD CODE !!! BAD CODE !!! BAD CODE !!!*/
        if (roller1Position === "A_upper" && roller2Position === "B_lower") {
            this.x1 = roller1X
            this.y1 = roller1Y - roller1Radius
            this.cpx = roller2X - 2 * roller2Radius
            this.cpy = roller1Y - roller1Radius /*roller1Y (pulley[0]) defined in the coordinate system of slider[0],
            this expression is correct just because of the same Y-coordinate of pulley[2]*/
            this.x2 = roller2X - roller2Radius
            this.y2 = roller2Y
        } else if (roller1Position === "A_upper" && !roller2Position) { //if this.roller2Position === undefined -> cable drum
            this.x1 = roller1X
            this.y1 = roller1Y - roller1Radius
            if (sys.pullingSide === "A" && this.systemType === "double rail") {
                this.cpx = roller2X + 5 * roller2Radius //bowden curvature is bigger for pulling side A
                this.cpy = roller1Y - roller1Radius
            } else {
                this.cpx = roller2X + roller2Radius
                this.cpy = roller1Y - roller1Radius
            }
            this.x2 = roller2X + roller2Radius
            this.y2 = roller2Y
        } else if (roller1Position === "A_lower" && !roller2Position ) {
            this.x1 = roller1X
            this.y1 = roller1Y + roller1Radius
            this.cpx = roller2X + roller2Radius
            this.cpy = roller1Y + roller1Radius
            this.x2 = roller2X + roller2Radius
            this.y2 = roller2Y
        } else if (!roller1Position && roller2Position === "B_upper") {
            this.x1 = roller1X + roller1Radius
            this.y1 = roller1Y 
            this.cpx = slider1X + roller1X + roller1Radius - slider2X  //coordinate sytem conversion from slider[0] to slider[1]
            this.cpy = roller2Y - roller2Radius
            this.x2 = roller2X 
            this.y2 = roller2Y - roller2Radius
        } else if (roller1Position === "A_lower" && roller2Position === "B_upper") {
            this.x1 = roller1X
            this.y1 = roller1Y + roller1Radius
            this.cpx = roller2X - 2 * roller2Radius
            this.cpy = roller1Y - roller1Radius /*roller1Y (pulley[0]) defined in the coordinate system of slider[0],
            this expression is correct just because of the same Y-coordinate of pulley[2]*/
            this.x2 = roller2X - roller2Radius
            this.y2 = roller2Y
        } else if (!roller1Position && roller2Position === "B_lower") {
            this.x1 = roller1X
            this.y1 = roller1Y + roller1Radius
            if (sys.pullingSide === "A" && this.systemType === "double rail") {
                this.cpx = slider1X + 0.45 * roller1X - slider2X //bowden curvature is bigger for pulling side A
                this.cpy = roller2Y + roller1Radius
            } else {
                this.cpx = slider1X + roller1X - slider2X //coordinate sytem conversion from slider[0] to slider[1]
                this.cpy = roller2Y + roller1Radius
            }
            this.x2 = roller2X
            this.y2 = roller2Y + roller2Radius
        } else {
            console.log("Wrong reference objects for bowden provided. Constructor.js line 346.")
        }
    }
    render(ctx) {
        ctx.lineWidth = this.lineWidth
        ctx.strokeStyle = this.strokeStyle
        ctx.save()
        ctx.translate(this.rotAxis1X, this.rotAxis1Y)
        ctx.rotate(this.angle)

        ctx.beginPath()
        ctx.moveTo(this.x1, this.y1)
        if (this.rotAxis2X && this.rotAxis2Y) {
            ctx.restore()

            ctx.save()
            ctx.translate(this.rotAxis2X, this.rotAxis2Y)
            ctx.rotate(this.angle)
        }

        ctx.quadraticCurveTo(this.cpx, this.cpy, this.x2, this.y2)
        ctx.stroke()

        ctx.restore()
    }
}


class Window {
    constructor({centerOfGravity, controlPoints, fixingPoints}, position, angle) {
        this.cog = centerOfGravity
        this.cp = controlPoints
        this.fp = fixingPoints
        this.position = position
        this.angle = angle

        this.strokeStyle = "blue"
        this.fillStyle = "rgb(52, 177, 235, 0.5)"
        this.lineWidth = 5 * gui.scale
    }
    render(ctx) {
        let curvaturePoint
        const cpRot = []
        //window
        ctx.strokeStyle = this.strokeStyle
        ctx.fillStyle = this.fillStyle
        ctx.lineWidth = this.lineWidth
        ctx.beginPath()

        ctx.moveTo(this.cp[0].x, this.cp[0].y) //point 1

        cpRot.push(relRotate(this.cp[0], this.cp[1], -this.angle))
        cpRot.push(relRotate(this.cp[3], this.cp[2], -this.angle))

        ctx.lineTo(cpRot[0].x, cpRot[0].y) //point 2

        if (this.position === "front") {
            curvaturePoint = {
                x: this.cp[2].x*0.4,
                y: this.cp[2].y*1.01
            }
        } else if (this.position === "rear") {
            curvaturePoint = {
                x: this.cp[2].x - 100 * gui.scale,
                y: this.cp[2].y - 180 * gui.scale
            }
        }
        
        ctx.quadraticCurveTo(curvaturePoint.x, curvaturePoint.y, cpRot[1].x, cpRot[1].y) //point 3

        ctx.lineTo(this.cp[3].x, this.cp[3].y) //point 4

        if (this.fp.length === 2) {
            ctx.quadraticCurveTo(this.fp[1].x*1.07, this.cp[3].y, this.fp[1].x, this.fp[1].y) //point 5 (slider left)
            ctx.quadraticCurveTo((this.fp[1].x + this.fp[0].x)/2, this.cp[3].y, this.fp[0].x, this.fp[0].y) //point 6 (slider right)
            ctx.quadraticCurveTo(this.fp[0].x*0.85, this.cp[0].y, this.cp[0].x, this.cp[0].y) //point 1
        } else if (this.fp.length === 1) {
            ctx.quadraticCurveTo(this.fp[0].x*1.25, this.cp[3].y, this.fp[0].x, this.fp[0].y) //point 5 (slider left)
            ctx.quadraticCurveTo(this.fp[0].x*0.7, this.cp[0].y, this.cp[0].x, this.cp[0].y) //point 1
        } else {
            console.log("Wrong sc.length is provided. constructor.js line 432")
        }

        ctx.stroke()
        ctx.fill()
        //window fixing screws
        ctx.strokeStyle = "rgb(200, 200, 200)"
        ctx.fillStyle = "rgb(230, 230, 230)"
        ctx.lineWidth = 20 * gui.scale
        for (let i=0; i < this.fp.length; i++) {
            ctx.beginPath()
            ctx.arc(this.fp[i].x, this.fp[i].y, 10 * gui.scale, 0, 2 * Math.PI)
            ctx.stroke()
            ctx.fill() 
        }
        //center of gravity
        ctx.fillStyle = "red"
        ctx.beginPath()
        ctx.arc(this.cog.x, this.cog.y, 15 * gui.scale, 0, 2 * Math.PI)
        ctx.fill() 
    }
}

class Spring {
    constructor(x1, y1, x2, y2, diameter = 25 * gui.scale) {
        this.x1 = x1
        this.y1 = y1
        this.x2 = x2
        this.y2 = y2
        this.d = diameter

        this.strokeStyle = "rgb(0,0,0)"
        this.lineWidth = 2 * gui.scale
    }
    calculate(systemType, position) {
        const increase = 1.02 //temp constant
        const decrease = 0.98 //temp constant
        const springLength = 60 * gui.scale
        let springBinding1
        let springBinding2
        let distance
        //calculating spring binding points
        if (systemType === "double rail") {
            if (sys.pullingSide === "B") {
                if (position === "upper") {
                    springBinding1 = { //regarding to the slider[0]
                        x: sys.bowden[2].x1,
                        y: sys.bowden[2].y1 - 10
                    }
                    const bowden2CP = changeRefPoint("slider[0]", {x: sys.bowden[2].cpx, y: sys.bowden[2].cpy})

                    distance = Math.sqrt(Math.pow(increase * bowden2CP.x - springBinding1.x, 2)
                    + Math.pow(increase * bowden2CP.y - springBinding1.y, 2))

                    springBinding2 = {
                        x: springBinding1.x + (increase * bowden2CP.x - springBinding1.x) * (springLength/distance),
                        y: springBinding1.y + (increase * bowden2CP.y - springBinding1.y) * (springLength/distance)
                    }
                    this.x1 = springBinding1.x
                    this.y1 = springBinding1.y
                    this.x2 = springBinding2.x
                    this.y2 = springBinding2.y 
                } else if (position === "lower") {
                    springBinding1 = {
                        x: sys.bowden[1].x2,
                        y: sys.bowden[1].y2 + 10
                    }
                    distance = Math.sqrt(Math.pow(sys.bowden[1].cpx - springBinding1.x, 2) + Math.pow(sys.bowden[1].cpy - springBinding1.y, 2))
                    springBinding2 = {
                        x: springBinding1.x + (increase * sys.bowden[1].cpx - springBinding1.x) * (springLength/distance),
                        y: springBinding1.y + (increase * sys.bowden[1].cpy - springBinding1.y) * (springLength/distance)
                    }
                    this.x1 = springBinding1.x
                    this.y1 = springBinding1.y
                    this.x2 = springBinding2.x
                    this.y2 = springBinding2.y 
                } 
            } else if (sys.pullingSide === "A") {
                if (position === "upper") {
                    springBinding1 = {
                        x: sys.bowden[0].x2 + 2,
                        y: sys.bowden[0].y2 - 4
                    }
                    distance = Math.sqrt(Math.pow(sys.bowden[0].cpx - springBinding1.x, 2) + Math.pow(sys.bowden[0].cpy - springBinding1.y, 2))
                    springBinding2 = {
                        x: springBinding1.x + (sys.bowden[0].cpx - springBinding1.x) * (springLength/distance),
                        y: springBinding1.y + (sys.bowden[0].cpy - springBinding1.y) * (springLength/distance)
                    }
                    this.x1 = springBinding1.x
                    this.y1 = springBinding1.y
                    this.x2 = springBinding2.x
                    this.y2 = springBinding2.y 
                } else if (position === "lower") {
                    springBinding1 = {
                        x: sys.bowden[2].x1 - 2,
                        y: sys.bowden[2].y1 + 4
                    }
                    const bowden2CP = changeRefPoint("slider[0]", {x: sys.bowden[2].cpx, y: sys.bowden[2].cpy})

                    distance = Math.sqrt(Math.pow(increase * bowden2CP.x - springBinding1.x, 2) + Math.pow(increase * bowden2CP.y - springBinding1.y, 2))
                    springBinding2 = {
                        x: springBinding1.x + (bowden2CP.x - springBinding1.x) * (springLength/distance),
                        y: springBinding1.y + (bowden2CP.y - springBinding1.y) * (springLength/distance)
                    }
                    this.x1 = springBinding1.x
                    this.y1 = springBinding1.y
                    this.x2 = springBinding2.x
                    this.y2 = springBinding2.y 
                }
            }
        } else if (systemType === "single rail") {
            if (position === "upper") {
                springBinding1 = {
                    x: sys.bowden[0].x2,
                    y: sys.bowden[0].y2 - 10
                }
                distance = Math.sqrt(Math.pow(decrease * sys.bowden[0].cpx - springBinding1.x, 2) + Math.pow(decrease * sys.bowden[0].cpy - springBinding1.y, 2))
                springBinding2 = {
                    x: springBinding1.x + (increase * sys.bowden[0].cpx - springBinding1.x) * (springLength/distance),
                    y: springBinding1.y + (increase * sys.bowden[0].cpy - springBinding1.y) * (springLength/distance)
                }
                this.x1 = springBinding1.x
                this.y1 = springBinding1.y
                this.x2 = springBinding2.x
                this.y2 = springBinding2.y 
            } else if (position === "lower") {
                springBinding1 = {
                    x: sys.bowden[1].x2,
                    y: sys.bowden[1].y2 + 10
                }
                distance = Math.sqrt(Math.pow(decrease * sys.bowden[1].cpx - springBinding1.x, 2) + Math.pow(decrease * sys.bowden[1].cpy - springBinding1.y, 2))
                springBinding2 = {
                    x: springBinding1.x + (increase * sys.bowden[1].cpx - springBinding1.x) * (springLength/distance),
                    y: springBinding1.y + (increase * sys.bowden[1].cpy - springBinding1.y) * (springLength/distance)
                }
                this.x1 = springBinding1.x
                this.y1 = springBinding1.y
                this.x2 = springBinding2.x
                this.y2 = springBinding2.y 
            }
        }
        /* calculating intermediate points */
        this.p = [] //spring points
        const sectorAngle = 20 * Math.PI / 180 //angle between certain two crossing lines
        const sector1Length = this.d * Math.tan(sectorAngle) //half spring pitch
        const sectorNumber = Math.floor(springLength/sector1Length) //number of sectors of this length
        const sector2Length = (springLength - sectorNumber * sector1Length)/2 //rest distance

        this.p.push({
            x: this.x1 + this.d/2,
            y: this.y1 
        })
        this.p.push({
            x: this.x1 - this.d/2,
            y: this.y1
        })
        let signX = 0
        const signY = position === "upper" ? -1 : 1
        for(let i = 0; i <= sectorNumber; i++) {
            signX = i % 2 ? 1 : -1
            this.p.push({
                x: this.x1 + signX * this.d/2,
                y: this.y1 + signY * (sector2Length + i * sector1Length)
            })
        }
        this.p.push({
            x: this.x1 + signX * this.d/2,
            y: this.y1 + signY * (2 * sector2Length + sectorNumber * sector1Length)
        })
        this.p.push({
            x: this.x1 - signX * this.d/2,
            y: this.y1 + signY * (2 * sector2Length + sectorNumber * sector1Length)
        })

        const springAngle = Math.atan2(signY * (this.x2 - this.x1), Math.abs(this.y2 - this.y1))
        this.p = relRotate({x: this.x1, y: this.y1}, this.p, springAngle)
    }
    render(ctx) {
        ctx.strokeStyle = this.strokeStyle
        ctx.lineWidth = this.lineWidth
        ctx.save()
        ctx.translate(sys.slider[0].x, sys.slider[0].y)
        ctx.rotate(sys.slider[0].angle)

        ctx.beginPath()
        ctx.moveTo(this.p[0].x, this.p[0].y)
        for(let i = 1; i < this.p.length; i++) {
           ctx.lineTo(this.p[i].x, this.p[i].y) 
        }
      
        ctx.stroke()
        ctx.restore()
    }
}

class Arrow {
    constructor({fromX, fromY, toX, toY, length, angle = 0, color = "black"}, {x: rotAxisX, y: rotAxisY, angle: rotAngle} = 0) {
        if (fromX && fromY) {
            this.fromX = fromX
            this.fromY = fromY
            this.toX = toX
            this.toY = toY
            this.length = 0
            this.angle = 0
            this.rotAxisX = 0
            this.rotAxisY = 0
            this.rotAngle = 0
        } else {
            this.toX = toX
            this.toY = toY
            this.fromX = toX - length * Math.sin(angle)
            this.fromY = toY + length * Math.cos(angle)
            this.length = length
            this.angle = angle
            this.rotAxisX = rotAxisX
            this.rotAxisY = rotAxisY
            this.rotAngle = rotAngle
        }
        this.color = color
    }
    render(ctx) {
        const headlen = 20 * gui.scale
        const alpha = !this.length ? Math.atan2(this.toY - this.fromY, this.toX - this.fromX) + Math.PI/2: this.angle
        ctx.lineWidth = 1
        ctx.strokeStyle = this.color
        ctx.save()
        ctx.translate(this.rotAxisX, this.rotAxisY)
        ctx.rotate(this.rotAngle)

        ctx.beginPath()
        ctx.moveTo(this.fromX, this.fromY)
        ctx.lineTo(this.toX, this.toY)
        ctx.lineTo(this.toX - Math.sin(alpha - Math.PI / 6) * headlen, this.toY + Math.cos(alpha - Math.PI / 6) * headlen)
        ctx.moveTo(this.toX, this.toY)
        ctx.lineTo(this.toX - Math.sin(alpha + Math.PI / 6) * headlen, this.toY + Math.cos(alpha + Math.PI / 6) * headlen)
        ctx.stroke()

        ctx.restore()
    }
}
/******CONSTRUCTIONS *** CONSTRUCTIONS *** CONSTRUCTIONS******/
/*************************************************************/