module.exports = {
  titleApp: 'CryptoApp',
  url: 'https://min-api.cryptocompare.com/data/pricemultifull?fsyms=BTC,ETH,XRP,BCH,ADA,LTC,XEM,XLM,EOS,NEO,MIOTA,DASH,XMR,TRX,XTZ,DOGE,ETC,VEN,USDT,BNB&tsyms=USD',
  api_neat: 'https://us-central1-neatwebplatform-beta.cloudfunctions.net/cryptoExchange',
  minAmount: 100,
  maxAmount: 100000,

  colors: {
    blueColor: '#038bfd',
    whiteColor: '#ffffff',
    purpleColor: '#9D81EB',
    pinkColor: '#FB79B4',
    lightYellowColor: '#FFDC00',
    darkYellowColor: '#FFA300',
    turquoiseColor: '#02DFB6' ,
    appleGreenColor: '#47E543',
    lightblueColor: '#58C4D8',
    darkBlueColor: '#65A1E0'
  },

  image: {
    bitcoin: require('./../assets/img/bitcoin.jpg'),
    etherum: require('./../assets/img/etherum.jpg'),
    ripple: require('./../assets/img/ripple.jpg'),
    bitcoinCash: require('./../assets/img/bitcoincash.png'),
    cardano: require('./../assets/img/cardano.png'),
    litecoin: require('./../assets/img/litecoin.png'),
    nem: require('./../assets/img/nem.png'),
    stellar: require('./../assets/img/stellar.png'),
    eos: require('./../assets/img/eos.png'),
    neo: require('./../assets/img/neo.png'),

    binanceCoin: require('./../assets/img/binanceCoin.png'),
    dash: require('./../assets/img/dash.png'),
    dogecoin: require('./../assets/img/dogecoin.png'),
    etherumClassic: require('./../assets/img/etherumClassic.png'),
    iota: require('./../assets/img/iota.png'),
    monero: require('./../assets/img/monero.png'),
    tether: require('./../assets/img/tether.png'),
    tezos: require('./../assets/img/tezos.png'),
    tron: require('./../assets/img/tron.png'),
    vechain: require('./../assets/img/vechain.png'),


    default: require('./../assets/img/default.jpg'),
    listEmpty: require('./../assets/img/listEmpty.png')
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

    {name: 'IOTA', symbol: 'MIOTA'},
    {name: 'DASH', symbol: 'DASH'},
    {name: 'MONERO', symbol: 'XMR'},
    {name: 'TRON', symbol: 'TRX'},
    {name: 'TEZOS', symbol: 'XTZ'},
    {name: 'DOGECOIN', symbol: 'DOGE'},
    {name: 'ETHERUM CLASSIC', symbol: 'ETC'},
    {name: 'VECHAIN', symbol: 'VEN'},
    {name: 'TETHER', symbol: 'USDT'},
    {name: 'INANCE COIN', symbol: 'BNB'},
  ]
};
