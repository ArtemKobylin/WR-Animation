//temporary variables should be replaced with input fields values or database values
const cableDrumRadius = 32
const pulleyRadius = 20
const sliderWidth = 100
const sliderHeight = 160
const motorWidth = 40
const motorHeight = 100

const defineInputData = (systemType, position) => {
    if (position === "front") {
        if (systemType === "double rail") {
            return {
                system: {
                    type: "double rail",
                    position: "front",
                    pullingSide: "B",
                    angle: angleInputBar.value * Math.PI / 180,
                    stroke: strokeInputBar.value * gui.scale 
                },
                slider: [{
                    x: gui.simXScope.xTransform(1800),
                    y: gui.simXScope.yTransform(1169),
                    width: sliderWidth * gui.scale,
                    height: sliderHeight * gui.scale,
                    pillar: "A"
                }, {
                    x: gui.simXScope.xTransform(2200),
                    y: gui.simXScope.yTransform(1169),
                    width: sliderWidth * gui.scale,
                    height: sliderHeight * gui.scale,
                    pillar: "B"
                }],
                pulley: [{
                    radius: pulleyRadius * gui.scale,
                    position: "A_upper",
                    type: "circular"
                }, {
                    radius: pulleyRadius * gui.scale,
                    position: "A_lower",
                    type: "circular"
                }, {
                    radius: pulleyRadius * gui.scale,
                    position: "B_upper",
                    type: "circular"
                }, {
                    radius: pulleyRadius * gui.scale,
                    position: "B_lower",
                    type: "circular"
                }],
                cableDrum: {
                    radius: cableDrumRadius * gui.scale
                },
                motor: {
                    width: motorWidth * gui.scale,
                    height: motorHeight * gui.scale
                },
                window: {
                    centerOfGravity: {
                        x: gui.simXScope.xTransform(2063),
                        y: gui.simXScope.yTransform(1454)
                    },
                    controlPoints: [{
                        x: gui.simXScope.xTransform(1629),
                        y: gui.simXScope.yTransform(1239)
                    }, {
                        x: gui.simXScope.xTransform(1629),
                        y: gui.simXScope.yTransform(1498)
                    }, {
                        x: gui.simXScope.xTransform(2505),
                        y: gui.simXScope.yTransform(1722)
                    }, {
                        x: gui.simXScope.xTransform(2508),
                        y: gui.simXScope.yTransform(1278)
                    }],
                    fixingPoints: [{
                        x: gui.simXScope.xTransform(1800),
                        y: gui.simXScope.yTransform(1169),
                    }, {
                        x: gui.simXScope.xTransform(2200),
                        y: gui.simXScope.yTransform(1169),
                    }]
                }
            }
        } else if (systemType === "single rail") {
            return {
                system: {
                    type: "single rail",
                    position: "front",
                    pullingSide: "B",
                    angle: angleInputBar.value * Math.PI / 180,
                    stroke: strokeInputBar.value * gui.scale 
                },
                slider: [{
                    x: gui.simXScope.xTransform(1998),
                    y: gui.simXScope.yTransform(1169),
                    width: sliderWidth * gui.scale,
                    height: sliderHeight * gui.scale,
                    pillar: "A"
                }],
                pulley: [{
                    radius: pulleyRadius * gui.scale,
                    position: "A_upper",
                    type: "circular"
                }, {
                    radius: pulleyRadius * gui.scale,
                    position: "A_lower",
                    type: "circular"
                }],
                cableDrum: {
                    radius: cableDrumRadius * gui.scale
                },
                motor: {
                    width: motorWidth * gui.scale,
                    height: motorHeight * gui.scale
                },
                window: {
                    centerOfGravity: {
                        x: gui.simXScope.xTransform(2063),
                        y: gui.simXScope.yTransform(1454)
                    },
                    controlPoints: [{
                        x: gui.simXScope.xTransform(1629),
                        y: gui.simXScope.yTransform(1239)
                    }, {
                        x: gui.simXScope.xTransform(1629),
                        y: gui.simXScope.yTransform(1498)
                    }, {
                        x: gui.simXScope.xTransform(2505),
                        y: gui.simXScope.yTransform(1722)
                    }, {
                        x: gui.simXScope.xTransform(2508),
                        y: gui.simXScope.yTransform(1278)
                    }],
                    fixingPoints: [{
                        x: gui.simXScope.xTransform(1998),
                        y: gui.simXScope.yTransform(1169)
                    }]
                }
            }
        }
    } else if (position === "rear") {
        if (systemType === "double rail") {
            return {
                system: {
                    type: "double rail",
                    position: "rear",
                    pullingSide: "B",
                    angle: angleInputBar.value * Math.PI / 180,
                    stroke: strokeInputBar.value * gui.scale 
                },
                slider: [{
                    x: gui.simXScope.xTransform(1800),
                    y: gui.simXScope.yTransform(1169),
                    width: sliderWidth * gui.scale,
                    height: sliderHeight * gui.scale,
                    pillar: "A"
                }, {
                    x: gui.simXScope.xTransform(2200),
                    y: gui.simXScope.yTransform(1169),
                    width: sliderWidth * gui.scale,
                    height: sliderHeight * gui.scale,
                    pillar: "B"
                }],
                pulley: [{
                    radius: pulleyRadius * gui.scale,
                    position: "A_upper",
                    type: "circular"
                }, {
                    radius: pulleyRadius * gui.scale,
                    position: "A_lower",
                    type: "circular"
                }, {
                    radius: pulleyRadius * gui.scale,
                    position: "B_upper",
                    type: "circular"
                }, {
                    radius: pulleyRadius * gui.scale,
                    position: "B_lower",
                    type: "circular"
                }],
                cableDrum: {
                    radius: cableDrumRadius * gui.scale
                },
                motor: {
                    width: motorWidth * gui.scale,
                    height: motorHeight * gui.scale
                },
                window: {
                    centerOfGravity: {
                        x: gui.simXScope.xTransform(2040),
                        y: gui.simXScope.yTransform(1454)
                    },
                    controlPoints: [{
                        x: gui.simXScope.xTransform(1629),
                        y: gui.simXScope.yTransform(1239)
                    }, {
                        x: gui.simXScope.xTransform(1629),
                        y: gui.simXScope.yTransform(1722)
                    }, {
                        x: gui.simXScope.xTransform(2400),
                        y: gui.simXScope.yTransform(1540)
                    }, {
                        x: gui.simXScope.xTransform(2400),
                        y: gui.simXScope.yTransform(1278)
                    }],
                    fixingPoints: [{
                        x: gui.simXScope.xTransform(1800),
                        y: gui.simXScope.yTransform(1169),
                    }, {
                        x: gui.simXScope.xTransform(2200),
                        y: gui.simXScope.yTransform(1169),
                    }]
                }
            }
        } else if (systemType === "single rail") {
            return {
                system: {
                    type: "single rail",
                    position: "rear",
                    pullingSide: "B",
                    angle: angleInputBar.value * Math.PI / 180,
                    stroke: strokeInputBar.value * gui.scale 
                },
                slider: [{
                    x: gui.simXScope.xTransform(1998),
                    y: gui.simXScope.yTransform(1169),
                    width: sliderWidth * gui.scale,
                    height: sliderHeight * gui.scale,
                    pillar: "A"
                }],
                pulley: [{
                    radius: pulleyRadius * gui.scale,
                    position: "A_upper",
                    type: "circular"
                }, {
                    radius: pulleyRadius * gui.scale,
                    position: "A_lower",
                    type: "circular"
                }],
                cableDrum: {
                    radius: cableDrumRadius * gui.scale
                },
                motor: {
                    width: motorWidth * gui.scale,
                    height: motorHeight * gui.scale
                },
                window: {
                    centerOfGravity: {
                        x: gui.simXScope.xTransform(2040),
                        y: gui.simXScope.yTransform(1454)
                    },
                    controlPoints: [{
                        x: gui.simXScope.xTransform(1629),
                        y: gui.simXScope.yTransform(1239)
                    }, {
                        x: gui.simXScope.xTransform(1629),
                        y: gui.simXScope.yTransform(1722)
                    }, {
                        x: gui.simXScope.xTransform(2400),
                        y: gui.simXScope.yTransform(1540)
                    }, {
                        x: gui.simXScope.xTransform(2400),
                        y: gui.simXScope.yTransform(1278)
                    }],
                    fixingPoints: [{
                        x: gui.simXScope.xTransform(1998),
                        y: gui.simXScope.yTransform(1169)
                    }]
                }
            }
        }
    }
}