var express = require('express');

var actions = require('../methods/pgactions');

var router = express.Router();

router.post('/auth0', actions.auth0);
router.get('/container', actions.getcontainer);
router.get('/vessel', actions.getvessel);
router.get('/vesselcgo', actions.getvesselcgo);
router.get('/vesseldate', actions.getvesseldate);
router.get('/bookingref', actions.getbookingref);
router.get('/bookinglist', actions.getbookinglist);
router.get('/bookingcontlist', actions.getbookingcontlist);
router.get('/depot', actions.getDepot);
router.get('/ndsb', actions.getNdsb);
router.get('/depotdg', actions.getDepotDg);
router.get('/depotvtc', actions.getDepotVtc);
router.get('/vgm', actions.getVgm);
router.get('/vesselbk', actions.getVesselBk);

module.exports = router;

