module.exports = {
  titleApp: 'CryptoApp',

  minAmount: 100,
  maxAmount: 100000,

  colors: {
    blueColor: '#038bfd',
    whiteColor: '#ffffff'
  },

  image: {
    bitcoin: require('./../assets/img/bitcoin.jpg'),
    etherum: require('./../assets/img/etherum.jpg'),
    ripple: require('./../assets/img/ripple.jpg'),
    bitcoinCash: require('./../assets/img/bitcoincash.png'),
    cardano: require('./../assets/img/cardano.png'),
    litecoin: require('./../assets/img/litecoin.png'),
    default: require('./../assets/img/default.jpg'),
  },

  coins: [
    {name: 'Bitcoin', symbol: 'BTC'},
    {name: 'Etherum', symbol: 'ETH'},
    {name: 'Ripple', symbol: 'XRP'},
    {name: 'Bitcoin Cash', symbol: 'BCH'},
    {name: 'Cardano', symbol: 'ADA'},
    {name: 'Litecoin', symbol: 'LTC'},
    {name: 'NEM', symbol: 'XEM'},
    {name: 'Stellar', symbol: 'XLM'},
    {name: 'EOS', symbol: 'EOS'},
    {name: 'NEO', symbol: 'NEO'},
  ]
};
