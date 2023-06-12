let car = {
    pos_m: { x: 1, y: 0 },
    angle_rad: 0,
    speed_mps: 1.0,
    frontWheelAngle_rad: 0.0,
    rearWheelAngle_rad: 0.0,
    line: {
        actual: { pos_m: 0.0, angle_rad: 0.0 },
        target: { pos_m: 0.0, angle_rad: 0.0 }
    },
    isRemoteControlled: true
};

let params = {
    motorCtrl_P: 1.0,
    motorCtrl_I: 0.002,
};

const trackControl = {
    type: 'test',
    sections: [
        {
            speed_mps: 1.5,
            rampTime_ms: 800,
            lineGradient: {
                from: { pos_m: 0.0, angle_rad: 0.0 },
                to: { pos_m: 0.0, angle_rad: 0.0 }
            }
        },
        {
            speed_mps: 1.5,
            rampTime_ms: 800,
            lineGradient: {
                from: { pos_m: 0.0, angle_rad: 0.0 },
                to: { pos_m: 0.0, angle_rad: 0.0 }
            }
        }
    ]
};

module.exports = { car, params, trackControl };