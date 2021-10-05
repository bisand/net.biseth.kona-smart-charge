import BlueLinky from 'bluelinky';
import { VehicleStatus } from 'bluelinky/dist/interfaces/common.interfaces';
import { Device } from 'homey';
import KonaAPI from '../../kona-api';
import { Config } from '../../Config';

class MyDevice extends Device {
  private _settings: any;
  private _api!: KonaAPI;
  /**
   * onInit is called when the device is initialized.
   */
  async onInit() {
    this._settings = await this.getSettings();

    this.registerCapabilityListener('onoff', onoff => {
      this.log(onoff);
    });

    try {
      const config: Config = {
        username: this._settings.username,
        password: this._settings.password,
        brand: 'hyundai',
        region: 'EU',
        pin: this._settings.pin.join('')
      };

      this._api = await KonaAPI.login(config);
      const vehicle = await this._api.getVehicle(this._settings.vin);
      if (vehicle) {
        const status: VehicleStatus = await vehicle.status({ parsed: true, refresh: false }) as VehicleStatus;
        this.setCapabilityValue('measure_battery', status.engine.batteryCharge).catch(this.error);
      }
    } catch (error) {
      this.error('An error occurred while getting veichle status: ', error);
    }

    this.log('MyDevice has been initialized');
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
  async onSettings({ oldSettings: { }, newSettings: { }, changedKeys: { } }): Promise<string | void> {
    this.log('MyDevice settings where changed');
  }

  /**
   * onRenamed is called when the user updates the device's name.
   * This method can be used this to synchronise the name to the device.
   * @param {string} name The new name
   */
  async onRenamed(name: string) {
    this.log('MyDevice was renamed');
  }

  /**
   * onDeleted is called when the user deleted the device.
   */
  async onDeleted() {
    this.log('MyDevice has been deleted');
  }
}

module.exports = MyDevice;
