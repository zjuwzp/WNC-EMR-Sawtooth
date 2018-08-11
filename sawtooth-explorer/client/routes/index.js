const router = require('express').Router();
const patient = require('./../services/patient');
const document = require('./../services/document');

router.get('/patient', patient.getPatient);

router.post('/patient', patient.createPatient);

router.put('/patient/:id', patient.updatePatient);

router.delete('/patient/:id', patient.deletePatient);

router.post('/document', document.addDocumet);
router.delete('/document', document.deleteDocumet);

module.exports = router;