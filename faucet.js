const fs = require("fs");
const RippleAPI = require('ripple-lib').RippleAPI;
const RippleKeys = require('ripple-keypairs');
const Accounts = require('web3-eth-accounts');
const accounts = new Accounts('');
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
})
const xrplAPI = new RippleAPI({
  server: 'wss://s.altnet.rippletest.net:51233'
});

//This is the public key hex of an account on the XRPL that is used for burning testnet XRP.
const costonFaucetPub = 'C1FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF';

async function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
} 

async function xrplConnectRetry(error) {
  console.log('XRPL Testnet connecting...')
  sleep(1000).then(() => {
    xrplAPI.connect().catch(xrplConnectRetry);
  })
}

async function xrplDisconnectRetry(error) {
  console.log('XRPL Testnet disconnecting...')
  sleep(1000).then(() => {
    xrplAPI.disconnect().catch(process.exit());
  })
}

async function checkTransactionStatus(txHash) {
  xrplAPI.getTransaction(txHash)
  .catch(error => {
    console.log('Transaction finalizing in the XRPL...');
    sleep(5000).then(() => {
      return checkTransactionStatus(txHash);
    })
  })
  .then(response => {
    if (typeof response !== 'undefined'){
      if (response.outcome.result == 'tesSUCCESS'){
        txHashURL = '\nSuccess! View transaction here:\nhttps://testnet.xrpl.org/transactions/' + txHash + '\n';
        console.log(txHashURL);
        xrplAPI.disconnect().catch(xrplDisconnectRetry);
      }
    }
  })
}

xrplAPI.on('connected', () => {
  console.log('\x1b[34mXRPL Testnet connected.\x1b[0m\nGenerate XRPL Testnet credentials at:\nhttps://xrpl.org/xrp-testnet-faucet.html \n');
  var xrpFaucetAddr = RippleKeys.deriveAddress(costonFaucetPub);
  var evmDestAcct = accounts.create();

  readline.question(`XRPL Testnet Address: `, (input) => {
    var xrpFundAddr = input;
    readline.question(`XRPL Testnet Secret: `, (input) => {
      readline.close()

      console.log('\nCoston Network credentials:\nAddress:\x1b[32m',evmDestAcct.address,'\x1b[0m\nSecret:\x1b[32m',evmDestAcct.privateKey,'\x1b[0m');
      var accountString = '{\"address\":\"'+ evmDestAcct.address +'\",\"privateKey\":\"' + evmDestAcct.privateKey + '\"}';      
      fs.writeFile('costonAccount.json', accountString, function (err) {
        if (err) return console.log(err);
        console.log('Saving credentials to file.');
      });
      
      const faucetPayment = {
        "source": {
          "address": xrpFundAddr,
          "maxAmount": {
            "value": "500",
            "currency": "XRP"
          }
        },
        "destination": {
          "address": xrpFaucetAddr,
          "amount": {
            "value": "500",
            "currency": "XRP"
          }
        },
        "memos": [{
          "data": evmDestAcct.address
        }]
      };

      return xrplAPI.preparePayment(xrpFundAddr, faucetPayment)
      .then(preparedPayment=> {
        return xrplAPI.sign(preparedPayment['txJSON'], input);
      })
      .then(signedPayment=> {
        console.log('\nSending \x1b[32m500 XRP\x1b[0m to your Coston Network address.');
        return xrplAPI.submit(signedPayment.signedTransaction);
      })
      .then((response)=> {
        if (response.resultCode != 'tesSUCCESS'){
          console.error('\nError:\n',response);
          process.exit();
        } else {
          console.log('Transaction submitted to the XRPL.')
          return checkTransactionStatus(response.tx_json.hash);
        }
      })
    })
  })
}) 

xrplAPI.on('disconnected', () => {
  process.exit();
})

console.log('\x1b[4m\nCoston Testnet Faucet\x1b[0m\n');
xrplAPI.connect().catch(xrplConnectRetry);