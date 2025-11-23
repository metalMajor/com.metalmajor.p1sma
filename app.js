'use strict';

const Homey = require('homey');

module.exports = class MyApp extends Homey.App {

  /**
   * onInit is called when the app is initialized.
   */
  async onInit() {
    this.log('MyApp has been initialized');
//    this.energyAppApi = this.homey.api.getApiApp('com.homewizard');

//    this.energyAppApi.on('realtime', (event) => {
//      console.log('energyAppApi.onRealtime', event);
//    });
//        this.log('MyApp has been initialized: done');
  }

};
