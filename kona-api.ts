import BlueLinky from "bluelinky";
import { Brand } from "bluelinky/dist/interfaces/common.interfaces";
import EuropeanVehicle from "bluelinky/dist/vehicles/european.vehicle";
import { Vehicle } from "bluelinky/dist/vehicles/vehicle";

interface Config {
    username: string;
    password: string;
    brand: Brand;
    region: 'US' | 'CA' | 'EU';
    pin?: string;

}

class KonaAPI {
    static async testCredentials(config: Config): Promise<boolean> {

        return new Promise<boolean>((resolve, reject) => {
            const t = setTimeout(() => {
                clearTimeout(t);
                console.error('Login timed out.');
                reject(false);
            }, 30000);

            const client = new BlueLinky({
                username: config.username,
                password: config.password,
                brand: config.brand,
                region: config.region,
                pin: config.pin
            });

            client.on('ready', async () => {
                clearTimeout(t);
                resolve(true);
            });

            client.on('error', async (err) => {
                clearTimeout(t);
                console.error(err);
                reject(false);
            });
        });
    }

    private _client: BlueLinky;
    constructor(bluelinkyClient: BlueLinky) {
        this._client = bluelinkyClient;
    }

    static async login(config: Config): Promise<KonaAPI> {

        return new Promise<KonaAPI>((resolve, reject) => {
            const t = setTimeout(() => {
                clearTimeout(t);
                reject('Login timed out.');
            }, 30000);

            const client = new BlueLinky({
                username: config.username,
                password: config.password,
                brand: config.brand,
                region: config.region,
                pin: config.pin
            });

            client.on('ready', async () => {
                clearTimeout(t);
                resolve(new KonaAPI(client));
            });

            client.on('error', async (err) => {
                clearTimeout(t);
                reject(err);
            });
        });
    }

    public async getVehicles(): Promise<EuropeanVehicle[]> {
        return new Promise<EuropeanVehicle[]>(async (resolve, reject) => {
            if (this._client === undefined)
                reject('Login before using this method');
            try {
                const vehicles = await this._client.getVehicles();
                if (vehicles !== undefined)
                    resolve(vehicles);
                reject('Unable to get vehicles.')
            } catch (error) {
                reject(error);
            }
        });
    }

    public async getVehicle(id: string): Promise<EuropeanVehicle> {
        return new Promise<EuropeanVehicle>((resolve, reject) => {
            if (this._client === undefined)
                reject('Login before using this method');
            try {
                const vehicle = this._client.getVehicle(id);
                if (vehicle)
                    resolve(vehicle);
                reject('Unable to get vehicle.')
            } catch (error) {
                reject(error);
            }
        });
    }
}

export default KonaAPI;