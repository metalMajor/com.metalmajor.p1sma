# Overview

Converts P1 measurements and acts as an SMA Energy Meter to an SMA Inverter, for example the STP 6.0.

# Install on Homey Pro

Installing the app on your Homey is difficult, it is not on the app store yet.

The short instructions to develop homey apps:
- Install docker
- install nvm, then ```nvm install node``` or install node in any other way
- ```git clone https://github.com/metalMajor/com.metalmajor.p1sma.git```
- ```cd com.metalmajor.p1sma```
- ```npm install homey homey-api```
- ```homey app run --remote``` or ```homey app install```


# Setup in Homey

For every Homewizard P1 Dongle device added to Homey, this app allows to create a virtual SMA Energy Meter that the SMA inverter then can read.

Once the virtual meter is added, it will broadcast information packets using UDP multicast on port 9522, to the address 239.12.255.254

# Inverter Setup

## Ethernet Cable

The inverter needs to be connected to your network using one of the 2 ethernet interfaces. The wifi connection won't be enough, it really needs the ethernet, which they rebranded to "speedwire", yay marketing department! I used the one closed to the wall-side. It will take an IP address using DHCP, so no additional config is required, just plug it to your router. Because it uses multicast, you don't even need to know the ip address. 

## Configuration

Check the "Device Configuration" and you should see there the serial number 100 of the virtual SMA device. 

Under "Device Parameters", you click "Edit parameters" and under "System Communication" you can select the "SMA Energy Meter":

![Confg SMA Energy Meter](/docs/images/config1.png)

You should also see the serial number under the "Meter on speedwire". So you can fill in the number 100 in "Speedwire meter serial no.".

# Resulting improvements in SMA Web view

- System overview:

	![System overview](/docs/images/system-overview-improvement.png)

- Per-meter graph / measurements:

	![Meter graph](/docs/images/graph-improvement.png)

# Tested models

* SUNNY TRIPOWER 6.0 SE

# What is different from a real SMA Energy Meter

## The P1 Homewizard does not give me this info:

* 

# Thanks

Other projects for inspiration for the SMA Energy Meter package format:

* https://github.com/FransOv/SMA-Solar/blob/main/meter.be
* https://github.com/daimoniac/pysmaemeter
* https://api-documentation.homewizard.com/docs/v2/measurement/
* Search the web for "EMETER-Protokoll-TI-en-10.pdf"

# Development tools

Python tool based on the above projects to directly send a value is in this repo:

```
cd sma-tools
python3 send_packet.py --serial 100 --power 0 --energy 0
```

Also, using the free github copilot in VSCode, the "emeter.py" I adapted from the above projects was converted to node code, see sma-emeter-protocol.js
