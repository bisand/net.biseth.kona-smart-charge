import { Driver } from 'homey';
import BlueLinky from "bluelinky";
import PairSession from 'homey/lib/PairSession';
import KonaAPI from '../../kona-api';

class KonaDriver extends Driver {

  /**
   * onInit is called when the driver is initialized.
   */
  async onInit() {
    this.log('KonaDriver has been initialized');
  }

  async onPair(session: PairSession) {
    let username: string = '';
    let password: string = '';
    let pin = '';

    session.setHandler("login", async (data) => {
      username = data.username;
      password = data.password;

      const credentialsAreValid = await KonaAPI.testCredentials({ username, password, brand: 'hyundai', region: 'EU' });
      return credentialsAreValid;
    });

    session.setHandler("pincode", async (pincode) => {
      // The pincode is given as an array of the filled in values
      pin = pincode
      return true;
    });

    session.setHandler("list_devices", async () => {
      const api = await KonaAPI.login({ username, password, brand: 'hyundai', region: 'EU', pin });
      const myDevices = await api.getVehicles();

      const devices = myDevices.map((myDevice) => {
        return {
          name: myDevice.name(),
          data: {
            id: myDevice.vin(),
          },
          settings: {
            // Store username & password in settings
            // so the user can change them later
            username,
            password,
            pin,
            vin: myDevice.vin()
          },
        };
      });

      return devices;
    });
  }

  /**
   * onPairListDevices is called when a user is adding a device and the 'list_devices' view is called.
   * This should return an array with the data of devices that are available for pairing.
   */
  async onPairListDevices() {
    return [
      // Example device data, note that `store` is optional
      // {
      //   name: 'My Device',
      //   data: {
      //     id: 'my-device',
      //   },
      //   store: {
      //     address: '127.0.0.1',
      //   },
      // },
    ];
  }
}

module.exports = KonaDriver;