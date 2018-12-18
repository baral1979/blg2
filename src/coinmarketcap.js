var fetch = require('node-fetch');

const coinIds = [{
    id: "zencash",
    name: "ZenCash",
    symbol: "ZEN"
}, {
    id: "zcash",
    name: "Zcash",
    symbol: "ZEC"
},
{
    id: "zclassic",
    name: "ZClassic",
    symbol: "ZCL"
},
{
    id: "ethereum",
    name: "Ether",
    symbol: "ETH"
},
{
    id: "cardano",
    name: "Cardano",
    symbol: "ADA"
},
{
    id: "achain",
    name: "Achain",
    symbol: "ACT"
},
{
    id: "komodo",
    name: "Komodo",
    symbol: "KMD"
},
{
    id: "nav-coin",
    name: "NavCoin",
    symbol: "NAV"
}, {
    id: "bitcoin",
    name: "Bitcion",
    symbol: "BTC"
}, {
    id: "feathercoin",
    name: "FeatherCoin",
    symbol: "FTC"
},
{
    id: "vertcoin",
    name: "VertCoin",
    symbol: "VTC"
},
{
    id: "stellar",
    name: "Stellar Lumen",
    symbol: "XLM"
},
{
    id: "nano",
    name: "Nano",
    symbol: "NANO"
},
{
    id: "bitcoin-gold",
    name: "Bitcoin Gold",
    symbol: "BTG"
},
{
    id: "verge",
    name: "Verge",
    symbol: "XVG"
},
{
    id: "monero",
    name: "Monero",
    symbol: "XMR"
},
{
    id: "nebulas-token",
    name: "Nebulas",
    symbol: "NAS"
}, {
    id: "bitcoin-private",
    name: "Bitcoin Private",
    symbol: "BTCP"
},
{
    id: "eos",
    name: "EOS",
    symbol: "EOS"
},
{
    id: "vechain",
    name: "VeChain",
    symbol: "VEN"
},
];

const grabContent = url => fetch(url).then(res => res.text()).then(html => {
    var data = JSON.parse(html);
    //console.log(data);
    if (data && data.length === 1)
        return data[0];
});

var getStats = (coins) => {
    var urls = [];
    for (var i = 0; i < coins.length; i++) {
        var symbols = coinIds.filter(x => { return x.symbol === coins[i] })
        if (symbols && symbols.length === 1)
            urls.push(`https://api.coinmarketcap.com/v1/ticker/${symbols[0].id}`);
    }

    return Promise.all(urls.map(grabContent));
}

module.exports = {
    getStats
}