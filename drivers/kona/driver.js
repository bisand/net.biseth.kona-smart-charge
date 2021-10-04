'use strict';

const { Driver } = require('homey');

class MyDriver extends Driver {

  /**
   * onInit is called when the driver is initialized.
   */
  async onInit() {
    const showToastActionCard = this.homey.flow.getActionCard('show_toast');

    showToastActionCard.registerRunListener(async ({ device, message }) => {
      await device.createToast(message);
    });

    this.log('MyDriver has been initialized');
  }

  /**
   * onPairListDevices is called when a user is adding a device
   * and the 'list_devices' view is called.
   * This should return an array with the data of devices that are available for pairing.
   */
  async onPairListDevices() {
    return [
      {
        name: "Foo Device",
        data: {
          id: "abcd1234",
        },
      },
    ];
  }

}

module.exports = MyDriver;
