var express = require('express'),
    router = express.Router(),
    balances = require('./balances');

router
    .get('/', async (req, res, next) => {
        
        balances.getBalances(result => {
            
            var data = result.coins.map(x => {
                console.log('ASDFASDF"_')
                return {
                     id: x.stat.id
                }
            });

            

            res.status(200);
            res.send(data);
        }).catch(e => {
            res.status(302);
            res.send(e);
        })
    })

module.exports = router;