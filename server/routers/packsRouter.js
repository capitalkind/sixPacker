var express     = require('express'),
    Pack        = require('../models/pack'),
    packsRouter = express.Router();


packsRouter.post('/', function (req, res){
  var packData = req.body.pack;
  var newPack = new Pack(packData)
  newPack.save(function (err, databasePacks) {
    res.json( databasePacks );
  });
})

packsRouter.get('/', function (req, res){
  databasePacks = Pack.all;
  Pack.find({}, function (err, databasePacks) {
    res.json( {packs: databasePacks} );
  });
})

packsRouter.delete('/:id', function (req, res) {
  Pack.findByIdAndRemove(req.params.id, function(err){
    if (err) {res.status(500).end(); }
    res.status(204).end();
  });
})

packsRouter.put('/:id', function (req, res) {
  var packId = req.params.id;
  Pack.findByIdAndUpdate(packId, req.body, function(err, databasePacks) {
    res.json( databasePacks );
  });
})

module.exports = packsRouter;
