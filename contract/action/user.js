const config = require('./../config');
const {
    createAddress,
    toInvalidTransaction,
    setEntry,
    encodePayload,
    toInvalidPayload
} = require('./../lib/helper');

const _createUserAddress = (id) => createAddress(id, config.namespace.user);

module.exports = {
    userRegister: async ({
        context,
        data
    }) => {
        const {
            id
        } = data;
        if (!id) {
            return toInvalidPayload('id');
        }
        const userAddress = _createUserAddress(id);
        const possibleAddressValues = await context.getState([userAddress]).catch(toInvalidTransaction);

        const userValuesRep = possibleAddressValues[userAddress];

        let stateValue;
        if (userValuesRep && userValuesRep.length) {
            stateValue = JSON.parse(userValuesRep);
            if (stateValue) {
                return toInvalidTransaction('User ID already registered');
            }
        }

        stateValue = data;
        return setEntry(context, userAddress, stateValue);
    },
    userLogin: async ({
        context,
        data
    }) => {
        const {
            id,
            timestamp
        } = data;
        if (!id) {
            return toInvalidPayload('id');
        }
        if (!timestamp) {
            return toInvalidPayload('timestamp');
        }
        const userAddress = _createUserAddress(id);
        const possibleAddressValues = await context.getState([userAddress]).catch(toInvalidTransaction);

        const userValuesRep = possibleAddressValues[userAddress];

        let stateValue = {};
        if (!userValuesRep || userValuesRep.length === 0) {
            return toInvalidTransaction('User ID is not registered');
        }
        stateValue = JSON.parse(userValuesRep);
        if (!stateValue) {
            return toInvalidTransaction('State doesn"t contain values');
        }
        if (!stateValue.logins) {
            stateValue.logins = [];
        }
        stateValue.logins.push(timestamp);
        // If any data is supplied otherthan id and timestamp its appended
        // Object.assign(stateValue, data);
        return setEntry(context, userAddress, stateValue);
    },
    userUpdate: async ({
        context,
        data
    }) => {
        const {
            id
        } = data;
        if (!id) {
            return toInvalidPayload('id');
        }
        const userAddress = _createUserAddress(id);
        const possibleAddressValues = await context.getState([userAddress]).catch(toInvalidTransaction);

        const userValuesRep = possibleAddressValues[userAddress];

        let stateValue;
        if (!userValuesRep || userValuesRep.length === 0) {
            return toInvalidTransaction('User Id is not registered');
        }
        stateValue = JSON.parse(userValuesRep);
        if (!stateValue) {
            return toInvalidTransaction('State doesn"t contain values');
        }
        Object.assign(stateValue, data);
        return setEntry(context, userAddress, stateValue);
    },
};