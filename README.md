# babocar-monitor
## Starting the test environment
1. ```cd ./babocar-monitor/monitor_new/client && npm start```
2. ```cd ./babocar-monitor/monitor_new/robonuat_server && npm start```
3. Open the client application: ```http://IP_ADDRESS:3000/robonaut```

## Serial communication
### Car structure
- ```car: [posXm, posYm, absAngleDeg, speedMps, distanceM, orientedDistanceM, frontWheelAngleDeg, rearWheelAngleDeg, yawRateDegps]```
- isRemoteControlled: boolean --> coloring the header in the web gui
