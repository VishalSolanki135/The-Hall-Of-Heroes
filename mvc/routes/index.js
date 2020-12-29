var express = require('express');
var router = express.Router();
const ctrlIndex = require('../controllers/index');

router.get('/', ctrlIndex.getIndex);
router.get('/heroes', ctrlIndex.getHeroesIndex);
router.get('/create-hero', ctrlIndex.getHeroesForms);
router.post('/create-hero', ctrlIndex.createNewHero);
router.post('/delete-hero/:heroid', ctrlIndex.deleteHero);
router.get('/update-hero/:heroid', ctrlIndex.getupdateForm);
router.post('/update-hero/:heroid', ctrlIndex.updateForm);
router.get('/reset', ctrlIndex.reset);
router.get('/squads', ctrlIndex.getSquadsIndex);
router.get('/create-squad', ctrlIndex.getSquadsForm);
router.post('/create-squad', ctrlIndex.createSquad);
router.post('/delete-squad/:squadid', ctrlIndex.deleteSquad);

module.exports = router;
