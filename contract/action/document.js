const config = require('./../config');
const {
    createAddress,
    toInvalidTransaction,
    setEntry,
    toInvalidPayload,
    encodePayload
} = require('./../lib/helper');

const _createDocumentAddress = (id) => createAddress(id, config.namespace.document);
const _createPatienttAddress = (id) => createAddress(id, config.namespace.patient);

module.exports = {
    addDocument: async ({
        context,
        data
    }) => {
        const {
            id,
            patientId
        } = data;
        if (!id || !patientId) {
            return toInvalidPayload(!id ? 'id' : 'patientId');
        }
        const documentAddress = _createDocumentAddress(id);
        const patientAddress = _createPatienttAddress(patientId);
        const possibleAddressValues = await context.getState([documentAddress, patientAddress]).catch(toInvalidTransaction);

        let patientStateValueRep = possibleAddressValues[patientAddress];
        let documenttStateValueRep = possibleAddressValues[documentAddress];

        let patientStateValue;
        let documentStateValue;
        // Check if patient record exists
        if (!patientStateValueRep && patientStateValueRep.length === 0) {
            return toInvalidTransaction(`No patient record - ${patientId}`);
        }
        patientStateValue = JSON.parse(patientStateValueRep);
        // If no document attached start fresh list
        if (!patientStateValue.documents) {
            patientStateValue.documents = [];
        }
        // delete data.patientId;
        // patientStateValue.documents.push(documentStateValue);
        // Push document ID and document Address
        patientStateValue.documents.push({
            id,
            address: documentAddress
        });
        documentStateValue = data;
        const entries = {
            [patientAddress]: encodePayload(patientStateValue),
            [documentAddress]: encodePayload(documentStateValue),
        };
        return context.setState(entries).catch(toInvalidTransaction);
    },
    deleteDocument: async ({
        context,
        data
    }) => {
        const {
            id
        } = data;
        if (!id) {
            return toInvalidPayload('id');
        }
        const address = _createDocumentAddress(id);
        const possibleAddressValues = await context.getState([address]).catch(toInvalidTransaction);
        const stateValueRep = possibleAddressValues[address];
        // Check if Document record is created already
        // If not deletion will not be required
        if (!stateValueRep || stateValueRep.length === 0) {
            return toInvalidTransaction(`No Document record found to be created with this ${id}`);
        }
        // Since the delete request is raised this transaction 
        // An NULL value is set mark empty
        return context.deleteState([address]).catch(toInvalidTransaction);
    }
}