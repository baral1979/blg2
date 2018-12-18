var otherCoins = [{
    data: {},
    source: 'OfflineWallet', 
    coin: 'BTCP',
    available: 8.25,
    reserved: 0
},
{
    data: {},
    source: 'Kukoin', 
    coin: 'NANO',
    available: 7.72133089,
    reserved: 0
},
{
    data: {},
    source: 'Kukoin', 
    coin: 'ACT',
    available: 19.74235,
    reserved: 0
},
{
    data: {},
    source: 'gate.io', 
    coin: 'NAS',
    available: 5.22,
    reserved: 0
}
]


var coins = () => {return otherCoins;}

module.exports = {
    coins
}