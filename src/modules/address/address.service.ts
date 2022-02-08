import { ICreateAddress } from "./address.interface.js";
import addressRepository from "./address.repository.js";

class AddressService {
    async getAddressById(address_id: number) {
        const address = await addressRepository.getAddressById(address_id);
        return address;
    }

    async createAddress(create_address: ICreateAddress) {
        const address = await addressRepository.createAddress(create_address);
        return address;
    }
}

const addressService = new AddressService();

export default addressService;
