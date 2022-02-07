import addressRepository from "./address.repository.js";

class AddressService {
    async getAddressById(address_id: number) {
        const address = await addressRepository.getAddressById(address_id);
        return address;
    }
}

const addressService = new AddressService();

export default addressService;
