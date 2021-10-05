import { Brand } from "bluelinky/dist/interfaces/common.interfaces";

export interface Config {
    username: string;
    password: string;
    brand: Brand;
    region: 'US' | 'CA' | 'EU';
    pin?: string;
}
