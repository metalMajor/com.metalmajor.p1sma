'use strict';

const Homey = require('homey');
const EmeterPacketizer = require('./sma-emeter-protocol.js').EmeterPacketizer;
const dgram = require('dgram');

module.exports = class MyDevice extends Homey.Device {

  /**
   * onInit is called when the device is initialized.
   */
  async onInit() {
    this.log('MyDevice has been initialized:', this.getData());

    this.registerCapabilityListener("onoff", async (value) => {
      this.log("New value: ", value);
    });

    const deviceId = this.getData().input_device_id;
    this.inputDevice = await this.driver.homeyApi.devices.getDevice({ id: deviceId });
    //this.log(this.inputDevice);

    this.emeterPacketizer = new EmeterPacketizer(this.getSetting('serial_number'));
    this.udpSender = dgram.createSocket('udp4');
    this.inputDevice.makeCapabilityInstance('measure_power', value =>{
      this.log('Device measure_power changed to:', value);
      this.driver.homeyApi.devices.getDevice({ id: deviceId }).then( device => {
          const info = device.capabilitiesObj;
          //this.log('Fetched device info:', info);
          
          const packet = this.assemble_packet(info);
          if(packet){

            this.send_packet(packet);
          }
      });
    });
  }

  /**
   * onAdded is called when the user adds the device, called just after pairing.
   */
  async onAdded() {
    this.log('MyDevice has been added');
  }

  /**
   * onSettings is called when the user updates the device's settings.
   * @param {object} event the onSettings event data
   * @param {object} event.oldSettings The old settings object
   * @param {object} event.newSettings The new settings object
   * @param {string[]} event.changedKeys An array of keys changed since the previous version
   * @returns {Promise<string|void>} return a custom message that will be displayed
   */
  async onSettings({ oldSettings, newSettings, changedKeys }) {
    this.log('MyDevice settings where changed:', newSettings);
  }

  /**
   * onRenamed is called when the user updates the device's name.
   * This method can be used this to synchronise the name to the device.
   * @param {string} name The new name
   */
  async onRenamed(name) {
    this.log('MyDevice was renamed');
  }

  /**
   * onDeleted is called when the user deleted the device.
   */
  async onDeleted() {
    this.log('MyDevice has been deleted');
  }

  send_packet(packet) {
    //const packetInHex = packet.toString('hex').toUpperCase();
    //this.log('Sending packet:', packetInHex);
    this.udpSender.send(packet, 0, packet.length, 9522, '239.12.255.254', (err, bytes) => {
      if (err) {
        this.log('UDP send error:', err);
      } else {
        this.log(`UDP packet sent (${bytes} bytes)`);
      }
    });
  }

  assemble_packet(info) {
    const energy = 0;
 //   this.log('Assembling packet from info:', info);
 //   this.log('Using test value:', info['meter_power.consumed']);
    this.log('Device info:');
    for (const key in info) {
      if (Object.prototype.hasOwnProperty.call(info, key)) {
        this.log(`  ${key}: ${info[key].value} ${info[key].units} ${info[key].title}`);
      }
    }

    const pwr = info['measure_power'].value;
    const pwr_l1 = info['measure_power.l1'].value;
    const pwr_l2 = info['measure_power.l2'].value;
    const pwr_l3 = info['measure_power.l3'].value;
    const measurements = {
            "pwr_imp": pwr > 0 ? pwr : 0,
            "enrg_imp": info['meter_power.consumed'].value,
            "pwr_exp": pwr < 0 ? -pwr : 0,
            "enrg_exp": info['meter_power.returned'].value,
            
            //"fact_tot": 1,

            "enrg_imp_t1": info['meter_power.consumed.t1'].value,
            "enrg_imp_t2": info['meter_power.consumed.t2'].value,
            "enrg_exp_t1": info['meter_power.produced.t1'].value,
            "enrg_exp_t2": info['meter_power.produced.t2'].value,
            
            "l1_pwr_imp": pwr_l1 > 0 ? pwr_l1 : 0,
            "l1_pwr_exp": pwr_l1 < 0 ? -pwr_l1 : 0,
            "amp_l1": info['measure_current.l1'].value,
            "volts_l1": info['measure_voltage.l1'].value,
            //"fact_l1": 1,
            
            "l2_pwr_imp": pwr_l2 > 0 ? pwr_l2 : 0,
            "l2_pwr_exp": pwr_l2 < 0 ? -pwr_l2 : 0,
            "amp_l2": info['measure_current.l2'].value,
            "volts_l2": info['measure_voltage.l2'].value,
            //"fact_l2": 1,

            "l3_pwr_imp": pwr_l3 > 0 ? pwr_l3 : 0,
            "l3_pwr_exp": pwr_l3 < 0 ? -pwr_l3 : 0,
            "amp_l3": info['measure_current.l3'].value,
            "volts_l3":  info['measure_voltage.l3'].value,
            //"fact_l3": 1,
            
            "freq": 50,
        }
      this.log('Measurements to send:', measurements);
      
      this.emeterPacketizer.updateValues(measurements);
      const time_ms = Date.now();
      const packet = this.emeterPacketizer.getPacket(time_ms);
      return packet;
  }

};
