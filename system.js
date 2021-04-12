/************************************************/
/*********** ALL ELEMENTS OF THE GUI ************/

/* NOTATION
    slider[0] - left slider (A/B pillar)
    slider[1] - right slider (B/C pillar)
    pulley[0] - upper left pulley
    pulley[1] - lower left pulley
    pulley[2] - upper right pulley
    pulley[3] - lower right pulley
    cable[0]  - left cable
    cable[1]  - right cable
double rail A side
    bowden[0] - between pulley[0] and cable drum
    bowden[1] - between cable drum and pulley[3]
    bowden[2] - between pulley[1] and pulley[2]
double rail B side
    bowden[0] - between pulley[0] and pulley[3]
    bowden[1] - between pulley[1] and cable drum
    bowden[2] - between cable drum and pulley[2]
single rail
    bowden[0] - between pulley[0] and cable drum
    bowden[1] - between pulley[1] and cable drum

    spring[0] - upper spring
    spring[1] - lower spring
window
    wp[0] - lower left point
    wp[1] - upper left point
    wp[2] - upper right point
    wp[3] - lower right point
*/

const sys = {
    isWindowActive: false,
    pullingSide: "B",
    pulley: [],
    cableDrum: {},
    motor: {},
    slider: [],
    window: {},
    cable: [],
    bowden: [],
    spring: [],
    initElem({system, slider, pulley, cableDrum, motor = {}, window}) {
        this.slider[0] = new Slider(system, slider[0])
        for (let i = 0; i < 2; i++) {
            this.pulley[i] = new Pulley(system, pulley[i])
        }
        this.cable[0] = new Cable(system)
        this.cableDrum = new CableDrum(system, cableDrum)
        this.motor = new Motor(motor)

        if (system.type === "single rail") {
            for (let i = 0; i < 2; i++) {
                this.bowden[i] = new Bowden(system)
            }
        } else if (system.type === "double rail") {
            this.slider[1] = new Slider(system, slider[1])
            for (let i = 2; i < 4; i++) {
                this.pulley[i] = new Pulley(system, pulley[i])
            }
            this.cable[1] = new Cable(system)
            for (let i = 0; i < 3; i++) {
                this.bowden[i] = new Bowden(system)
            }
        }

        for (let i = 0; i < 2; i++) {
            this.spring[i] = new Spring()
        }
        this.window = new Window(window, system.position, system.angle)
    },
    calculateElem({system}) {
        for (let i = 0; i < 2; i++) {
            this.pulley[i].calculate(this.slider[0])
        }
        this.cable[0].calculate(this.pulley[0], this.pulley[1], this.slider[0])

        this.cableDrum.calculate(this.slider[0])
        this.motor.calculate(this.slider[0], this.cableDrum)

        if (system.type === "single rail") {
            for (let i = 0; i < 2; i++) {
                this.bowden[i].calculate(this.pulley[i], this.cableDrum, this.slider[0])
            }
        } else if (system.type === "double rail") {
            for (let i = 2; i < 4; i++) {
                this.pulley[i].calculate(this.slider[1])
            }
            this.cable[1].calculate(this.pulley[2], this.pulley[3], this.slider[1])

            if (this.pullingSide === "A") {
                this.bowden[0].calculate(this.pulley[0], this.cableDrum, this.slider[0])
                this.bowden[1].calculate(this.pulley[1], this.pulley[2], this.slider[0], this.slider[1])
                this.bowden[2].calculate(this.cableDrum, this.pulley[3], this.slider[0], this.slider[1])
            } else if (this.pullingSide === "B") {
                this.bowden[0].calculate(this.pulley[0], this.pulley[3], this.slider[0], this.slider[1])
                this.bowden[1].calculate(this.pulley[1], this.cableDrum, this.slider[0])
                this.bowden[2].calculate(this.cableDrum, this.pulley[2], this.slider[0], this.slider[1])
            }
        }
        this.spring[0].calculate(system.type, "upper")
        this.spring[1].calculate(system.type, "lower")
    },
    updateElem({system, slider, pulley, cableDrum, motor, window}) {
        this.slider.forEach((elem, index) => {
            elem.x = slider[index].x
            elem.y = slider[index].y
            elem.height = slider[index].height
            elem.width = slider[index].width
            elem.angle = system.angle
        })
        this.pulley.forEach((elem, index) => {
            elem.stroke = system.stroke
            elem.angle = system.angle
            elem.radius = pulley[index].radius
        })
        this.cable.forEach((elem) => {
            elem.angle = system.angle
        })

        this.cableDrum.angle = system.angle
        this.cableDrum.stroke = system.stroke
        this.cableDrum.radius = cableDrum.radius
        this.motor.width = motor.width
        this.motor.height = motor.height

        this.bowden.forEach((elem) => {
            elem.angle = system.angle
            elem.systemType = system.type
        })

        this.window.cog = window.centerOfGravity
        this.window.cp = window.controlPoints
        this.window.fp = window.fixingPoints
        this.window.position = system.position
        this.window.angle = system.angle
    },
    renderElem(ctx1, ctx2) {
        this.cable.forEach(elem => {
            elem.render(ctx1)
        })
        this.bowden.forEach(elem => {
            elem.render(ctx1)
        })
        this.motor.render(ctx1)
        this.cableDrum.render(ctx1)
        this.pulley.forEach(elem => {
            elem.render(ctx1)
        })
        this.slider.forEach(elem => {
            elem.render(ctx2)
        })
        this.spring.forEach(elem => {
            elem.render(ctx1)
        })
        if (this.isWindowActive) {
           this.window.render(ctx2) 
        }
    },
    deleteElem() {
        this.slider.splice(0, this.slider.length)
        this.pulley.splice(0, this.pulley.length)
        this.cable.splice(0, this.cable.length)
        this.bowden.splice(0, this.bowden.length)
    }
}