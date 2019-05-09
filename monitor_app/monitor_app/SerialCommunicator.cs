using System;
using System.Diagnostics;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Text.RegularExpressions;
using Windows.Devices.SerialCommunication;
using Windows.Devices.Enumeration;

namespace monitor_app
{
    class SerialCommunicator
    {
        public delegate void ListDevicesDelegate(List<DeviceInformation> devices);
        public delegate void ConnectedDelegate();

        event ListDevicesDelegate ListDevicesFinishedEvent;
        event ConnectedDelegate ConnectedEvent;

        private SerialDevice serialPort;

        public SerialCommunicator(ListDevicesDelegate listDevicesDelegate, ConnectedDelegate connectedDelegate)
        {
            ListDevicesFinishedEvent += listDevicesDelegate;
            ConnectedEvent += connectedDelegate;
        }

        public async void ListDevicesAsync()
        {
            string aqs = SerialDevice.GetDeviceSelector();
            DeviceInformationCollection devices = await DeviceInformation.FindAllAsync(aqs);

            Regex comRegex = new Regex(@".*\(COM(\d+)\)");

            List<DeviceInformation> comDevices = new List<DeviceInformation>();

            foreach (var dev in devices)
            {
                //var serialDevice = await SerialDevice.FromIdAsync(item.Id);
                Debug.WriteLine(dev.Name);

                if (comRegex.Match(dev.Name).Success)
                {
                    comDevices.Add(dev);
                }
            }

            ListDevicesFinishedEvent(comDevices);
        }

        public async void ConnectAsync(DeviceInformation device)
        {
            serialPort = await SerialDevice.FromIdAsync(device.Id);

            if (serialPort == null)
            {
                Debug.WriteLine("Error: serialPort is null");
            }
            else
            {
                serialPort.WriteTimeout = TimeSpan.FromMilliseconds(1000);
                serialPort.ReadTimeout = TimeSpan.FromMilliseconds(1000);
                serialPort.BaudRate = 115200;
                serialPort.Parity = SerialParity.None;
                serialPort.StopBits = SerialStopBitCount.One;
                serialPort.DataBits = 8;
                serialPort.Handshake = SerialHandshake.None;

                Debug.WriteLine("Connected to serial port: " + device.Name);
                ConnectedEvent();
            }
        }

        public void Disconnect()
        {
            serialPort.Dispose();
        }
    }
}
