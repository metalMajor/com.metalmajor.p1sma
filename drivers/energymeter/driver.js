'use strict';

const Homey = require('homey');
const { HomeyAPI } = require('homey-api');

module.exports = class MyDriver extends Homey.Driver {

  /**
   * onInit is called when the driver is initialized.
   */
  async onInit() {
    this.homeyApi = await HomeyAPI.createAppAPI({
      homey: this.homey,
    });
    this.log('MyDriver has been initialized');
  }
      
  /**
   * onPairListDevices is called when a user is adding a device
   * and the 'list_devices' view is called.
   * This should return an array with the data of devices that are available for pairing.
   */
  async onPairListDevices() {
    let me = this;
    me.log('Listing devices...');
    let listPromise = new Promise((resolve, reject) => {
        me.homeyApi.devices.getDevices().then(devices => {
          //me.log('Devices:', devices);
          let energyInputDevices = [];
          let serial_number = 100;
          const deviceKeys = Object.keys(devices);
          for (const deviceId of deviceKeys) {
            const device = devices[deviceId];
            if(device.driverId == "homey:app:com.homewizard:energy") {
              energyInputDevices.push( {
                name: 'Virtual SMA Energy Meter: ' + device.name,
                data: {
                  id: 'sma-energy-meter-virtual-' + device.id,
                  input_device_id: device.id
                },
                store: {
                  address: '239.12.255.254',
                  port: 9522,
                  input_device_id: device.id
                },
                settings: {
                  serial_number: serial_number
                }
              } );
              serial_number += 1;
            }
          }
          resolve(energyInputDevices);
        });
    });

    return listPromise;
  }  

};
