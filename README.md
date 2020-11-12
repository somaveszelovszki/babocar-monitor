# babocar-monitor

## Raspberry Pi login
IP address: 192.168.0.31
username: pi
password: raspberry

## Starting the test environment
1. ```cd ./babocar-monitor/gui && npm start```
2. ```cd ./babocar-monitor/serial-monitor && npm start```
3. Open the client application: ```http://IP_ADDRESS:3000```

## Serial communication
### Car structure
- ```car: [posXm, posYm, absAngleDeg, speedMps, distanceM, orientedDistanceM, frontWheelAngleDeg, rearWheelAngleDeg, yawRateDegps]```
- isRemoteControlled: boolean --> coloring the header in the web gui
