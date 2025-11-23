'use strict';

const Homey = require('homey');
const { HomeyAPI } = require('homey-api');

module.exports = class P1SMADriver extends Homey.Driver {

  async onInit() {
    this.homeyApi = await HomeyAPI.createAppAPI({
      homey: this.homey,
    });
  }

  async onPairListDevices() {
    let me = this;
    let listPromise = new Promise((resolve, reject) => {
      me.homeyApi.devices.getDevices().then(devices => {
        let energyInputDevices = [];
        let serial_number = 100;
        const deviceKeys = Object.keys(devices);
        for (const deviceId of deviceKeys) {
          const device = devices[deviceId];
          if (device.driverId == "homey:app:com.homewizard:energy") {
            energyInputDevices.push({
              name: 'Virtual SMA EM: ' + device.name,
              data: {
                id: 'sma-energy-meter-virtual-' + device.id,
                input_device_id: device.id
              },
              settings: {
                serial_number: serial_number
              }
            });
            serial_number += 1;
          }
        }
        resolve(energyInputDevices);
      });
    });

    return listPromise;
  }

};
