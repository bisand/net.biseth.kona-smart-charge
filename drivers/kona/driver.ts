import { Driver } from 'homey';
import BlueLinky from "bluelinky";
import PairSession from 'homey/lib/PairSession';

class MyDriver extends Driver {

  /**
   * onInit is called when the driver is initialized.
   */
  async onInit() {
    this.log('MyDriver has been initialized');
  }

  async getVehicles() {

    return new Promise((resolve, reject) => {
      const t = setTimeout(() => {
        reject('Login timed out.');
      }, 30000);

      const client = new BlueLinky({
        username: '',
        password: '',
        brand: 'hyundai',
        region: 'EU',
        pin: ''
      });

      client.on('ready', async () => {
        const vehicles = await client.getVehicles();
        try {
          resolve(vehicles);
        } catch (err) {
          reject(err);
        }
      });

      client.on('error', async (err) => {
        reject(err);
      });
    });
  }

  async onPair(session: PairSession) {
    let username = "";
    let password = "";

    session.setHandler("login", async (data) => {
      username = data.username;
      password = data.password;

      const credentialsAreValid = await DeviceAPI.testCredentials({
        username,
        password,
      });

      // return true to continue adding the device if the login succeeded
      // return false to indicate to the user the login attempt failed
      // thrown errors will also be shown to the user
      return credentialsAreValid;
    });

    session.setHandler("list_devices", async () => {
      const api = await DeviceAPI.login({ username, password });
      const myDevices = await api.getDevices();

      const devices = myDevices.map((myDevice) => {
        return {
          name: myDevice.name,
          data: {
            id: myDevice.id,
          },
          settings: {
            // Store username & password in settings
            // so the user can change them later
            username,
            password,
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

module.exports = MyDriver;