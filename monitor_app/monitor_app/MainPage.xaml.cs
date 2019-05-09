using System;
using System.Collections.Generic;
using System.Diagnostics;
using Windows.Devices.Enumeration;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Controls;

// The Blank Page item template is documented at https://go.microsoft.com/fwlink/?LinkId=402352&clcid=0x409

namespace monitor_app
{
    /// <summary>
    /// An empty page that can be used on its own or navigated to within a Frame.
    /// </summary>
    public sealed partial class MainPage : Page
    {
        public MainPage()
        {
            this.InitializeComponent();
            communicator = new SerialCommunicator(ListDevicesFinished, Connected);
            communicator.ListDevicesAsync();
        }

        public void ListDevicesFinished(List<DeviceInformation> devices)
        {
            if (devices.Count > 0)
            {
                foreach(var dev in devices)
                {
                    Debug.WriteLine("COM port: " + dev.Name);
                    comPortsListView.Items.Add(dev.Name);
                }
            }
            else
            {
                comPortsListView.Items.Add("No COM ports available. Please connect a device.");
            }
        }

        public void Connected()
        {

        }


        private async void Button_Click(object sender, RoutedEventArgs e)
        {
            MediaElement mediaElement = new MediaElement();
            var synth = new Windows.Media.SpeechSynthesis.SpeechSynthesizer();
            Windows.Media.SpeechSynthesis.SpeechSynthesisStream stream = await synth.SynthesizeTextToStreamAsync("Ahoi Captain");
            mediaElement.SetSource(stream, stream.ContentType);
            mediaElement.Play();
        }

        private SerialCommunicator communicator;
    }
}
