# Coston Test Network

Coston is a test network for Flare, a next-generation blockchain which enables smart contracts with XRP that settle on the XRP ledger.

## Features

- A testbed for developers that want to utilize Flare with test-XRP to develop and test applications before risking actual value.
- Systems testing of various functionality and smart contracts that will form the core trust-minimized utility of the Flare Network.

## Get Started with XRP on Coston

This repo can be downloaded via the commandline:
```
git clone https://github.com/flare-eng/coston
```
You can navigate to the `coston` repo using:
```
cd coston
```

Coston leverages Node.js for its faucet and also for Web3 applications such as Truffle. Install Node.js v6 or higher (Node.js v10 LTS is recommended) using a package manager [here](https://nodejs.org/en/download/package-manager/). After you have installed Node.js, you can check the version of the node binary from a command line using: `node --version`. On some platforms, the binary is named nodejs instead: `nodejs --version`.

Coston uses Yarn to manage dependencies; Yarn v1.13.0 is recommended and can be installed [here](https://classic.yarnpkg.com/en/docs/install#mac-stable). After you have installed Yarn, you can check the version of the yarn binary from a command line: `yarn --version`.

Use Yarn to install Coston's dependencies:
```
yarn
```


### Use the Coston Faucet

To get test-XRP onto the Coston network, first generate XRPL Testnet credentials [here](https://xrpl.org/xrp-testnet-faucet.html). After you have generated the credentials, you can run the faucet system which transfers 500 test-XRP to the Coston network:
```
node faucet.js
```

This program will ask for the XRPL Testnet credentials that you generated in the previous step, use these credentials to transfer value to the Coston network, and then save your Coston network credentials in a file called: `costonAccount.json`. 

### XRP on MetaMask

MetaMask is an in-browser wallet & gateway to blockchain apps. MetaMask can be downloaded [here](https://metamask.io/). After you have installed MetaMask, you can hook it into Coston by clicking the network drop-down button in the top-center of the MetaMask app, then selecting the 'Custom RPC' option and entering the following fields:

- Network Name: `Coston Test Network`
- New RPC URL: `http://coston.flare.network:9650/ext/bc/C/rpc`
- Symbol: `FXRP`

After you have created and toggled to the Coston Test Network, you can now load in your Coston network credentials to MetaMask that were saved in the previous step to `costonAccount.json`. In MetaMask, click the 'My Accounts' button in the top-right corner of the app, navigate to 'Import Account' and then paste in your Coston network private key. After your account has loaded, you can refresh MetaMask by selecting the Coston Test Network RPC endpoint again in the network drop-down menu. Your balance of tokens on the Coston network should then appear as:

![XRP on MetaMask](https://github.com/flare-eng/coston/blob/master/costonMetaMask.png)

### Smart Contracts with XRP

Coston is compatible with the latest Ethereum Virtual Machine functionality, including the complete [Web3](https://web3js.readthedocs.io/en/v1.2.7/) suite of tools such as [Truffle](https://www.trufflesuite.com/truffle). Truffle was automatically installed earlier as a dependency using Yarn. To get started testing out a Truffle smart contract project on Coston, you can download this example project called MetaCoin:

```
git clone https://github.com/truffle-box/metacoin-box.git
```
After the project has been downloaded, its deployment configuration can be updated for Coston using:
```
cd metacoin-box
cp ../truffle-config.js truffle-config.js
```
Deploy the smart contract project to Coston using:
```
truffle migrate --network coston --reset
```
After the deployment is complete, you can interact with the Truffle development console using:
```
truffle console --network coston
```
After opening the Truffle development console, you can interact with the MetaCoin smart contract project using the following commands. Begin by establishing both the deployed MetaCoin contract instance and the Coston account that you sent XRP to in an earlier step:
```
truffle(coston)> let instance = await MetaCoin.deployed()
truffle(coston)> let accounts = await web3.eth.getAccounts()
```
Generate a new account:
```
truffle(coston)> let newAccount = web3.eth.accounts.create()
truffle(coston)> accounts[1] = newAccount.address
```
Check the metacoin balance of the account that deployed the contract:
```
truffle(coston)> let balance = await instance.getBalance(accounts[0])
truffle(coston)> balance.toNumber()
```
See how much FXRP that balance is worth (and note that the contract defines a metacoin to be worth 2 FXRP):
```
truffle(coston)> let fxrp = await instance.getBalanceInEth(accounts[0])
truffle(coston)> fxrp.toNumber()
```
Transfer some metacoin from one account to another:
```
truffle(coston)> instance.sendCoin(accounts[1], 500)
```
Check the balance of the account that received the metacoin:
```
truffle(coston)> let received = await instance.getBalance(accounts[1])
truffle(coston)> received.toNumber()
```
Check the balance of the account that sent the metacoin:
```
truffle(coston)> let newBalance = await instance.getBalance(accounts[0])
truffle(coston)> newBalance.toNumber()
```

### Continue learning
This quickstart showed you the basics of the Truffle project lifecycle, but there is much more to learn. Please continue on with the rest of Truffle's [documentation](https://www.trufflesuite.com/docs) and especially the [tutorials](https://www.trufflesuite.com/tutorials) to learn more.
