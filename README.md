# Builder's Coin

![Builder's Coin](logo.png "Builder's Coin")

* _Standart_        : ERC20
* _Name_            : Builder's Coin
* _Ticket_          : BLD
* _Decimals_        : 18
* _Emission_        : Mintable
* _Token events_    : 2
* _Fiat dependency_ : No
* _Tokens locked_   : Yes


## Smart-contracts description
Mintable ERC20 token with PreTGE contract. 
Crowdsale contract have special function to retrieve tokens transferred by mistake.

### Social links
* facebook - https://www.facebook.com/ICObuilderscoin
* twitter - https://twitter.com/hashtag/BuildersCoin
* instagram - https://www.instagram.com/builderscoin
* telegram - https://t.me/BuildersCoin_ICO

### Contracts contains
1. _BuildersCoin_ 
2. _PreTGE_

### How to manage contract
To start working with contract you should follow next steps:
1. Compile it in Remix with enamble optimization flag and compiler 0.4.18
2. Deploy bytecode with MyEtherWallet. 

After crowdsale contract manager must call finishMinting. 

### How to invest
To purchase tokens investor should send ETH (more than minimum 0.1 ETH) to corresponding crowdsale contract.
Recommended GAS: 200 000 , GAS PRICE - 30 Gwei.

### Wallets with ERC20 support
1. MyEtherWallet - https://www.myetherwallet.com/
2. Parity 
3. Mist/Ethereum wallet

EXODUS not support ERC20, but have way to export key into MyEtherWallet - http://support.exodus.io/article/128-how-do-i-receive-unsupported-erc20-tokens

Investor should not use other wallets, coinmarkets or stocks. Can lose money.

## Main network configuration

* _Extra tokens_               : 1 000 000 BLD 
* _Extra tokens wallet_        : 

#### Links
* _Token_ - 
* _PreTGE_ - 

#### Pre Token Generation Event
* _Price_                      : 
* _Minimal insvestment limit_  : 0.1 ETH
* _Softcap_                    : 
* _Hardcap_                    :
* _Start_                      : 
* _Period_                     : 30 days
* _Contract manager_           : 
* _Direct mint agent_          : 
* _ETH Wallet_                 : 

## Ropsten network configuration (test #1 - softcap reached)

### Crowdsale stages

### Pre Token General Event
* _Price_                      : 1 ETH = 1 BLD
* _Minimal insvestment limit_  : 0.1 ETH
* _Softcap_                    : 1 BLD
* _Hardcap_                    : 10 BLD
* _Start_                      : Jan 24 2018 23:20:00 GMT+0300
* _Period_                     : 30 days
* _Contract manager_           : 0xf62158b03Edbdb92a12c64E4D8873195AC71aF6A
* _Direct mint agent_          : 
* _ETH Wallet_                 : 0xd89626E2c4218281Ad0Fc5F22AE52dC0FF39DDC4

#### Links
* _Token_  - https://ropsten.etherscan.io/address/0x5eec310846bff2dc918d9640c277b159a54f7a0d
* _PreTGE_ - https://ropsten.etherscan.io/address/0x471216fcad32d353056af585ae4ecd54f23a3902

### Test audit (PreTGE)

#### Purchasers
* Rejected purchase before start, gas = 21797
https://ropsten.etherscan.io/tx/0x695bdd4e1aa8fddb940dd257455db2c989fa8e3a7e9d2f9ea4ea3e6071b59620
* 0.1 Ether => 0.1 token, gas = 128340
https://ropsten.etherscan.io/tx/0x0602e824ab10abe520e7c23bf11958621cf47de6faf7add8ca0933744cceb761
* Rejected purchase with value < minimal investment limit, gas = 21359
https://ropsten.etherscan.io/tx/0x7b4482235d73230661ae7b7fa899b55b6f88de2162fe075faa46b2b83e3e9d38
* 1 Ether => 1 token
https://ropsten.etherscan.io/tx/0x917618faa533263dd77450b9ac9c9a152f82d31f8e6e637943984cbe9632680d
* Rejected refund during the presale, gas = 89555
https://ropsten.etherscan.io/tx/0x9da85356e2ec121db4337fca7d054cbe2e0adc0e184e549acfbe6b3962ba6f50
* 3.5 Ether => 3.5 tokens, gas = 74555
https://ropsten.etherscan.io/tx/0x62385ad538f95db6cdb4b5f8938922ab5cd8089161aea2505c493f32dc726bec
* Rejected purchase after finish, gas = 21584
https://ropsten.etherscan.io/tx/0xa20179aaf47f169e49618b19734c87eb344ea179924a6ffc7ddb57e244a268c4

#### Service operations
* setHardcap, gas = 27928
https://ropsten.etherscan.io/tx/0x6a569a7267b831c26cf5468505ba2500e6ef2d0d2ad0757a00e5ec8dcc214d9b
* finish, gas = 45802
https://ropsten.etherscan.io/tx/0x8ad677bc5fa95677e57d59714391b3d5e7f0af8ce5f97549210c3043e61e537e
* setDirectMintAgent, gas = 28891
https://ropsten.etherscan.io/tx/0x624aadf13acd8b7720b0699682c41eab005d3674268bff5e682eb70995b80ff7
* setDirectMinLimit, gas = 42884
https://ropsten.etherscan.io/tx/0x8544fab38755c94486a965afe2bc7b017d8d71e6c211e7266be6a4c182338b6d
* directMint, gas = 78728
https://ropsten.etherscan.io/tx/0xc7451345b2c096f6f2b572039bc187dc99e713091ed7fc01287f79facb404e12
* rejected directMint outside directMintLimit, gas = 29096
https://ropsten.etherscan.io/tx/0x86e59641ac3271649d54cfc0004f43d09f917bb1609bb2dd596da3ecaffa3954

### Test audit (Token)

#### Purchasers
* Rejected token transfer before unlockTransfer/finishMinting, gas = 24648
https://ropsten.etherscan.io/tx/0xb95888f272277fce9c7b93d8afd57dfb0215d3963527b9b49f5e58806a1a6749
* send token after unlockTransfer, gas = 53139
https://ropsten.etherscan.io/tx/0x4dad09c00554b1b08fa615cd1c8491162a6ea5eb9b2fd897f6322cac5ff8e69e

#### Service operations
* unlockTransfer, gas = 27599
https://ropsten.etherscan.io/tx/0x9906972d238311d4dddeda8513466222a391fe53a6259bbf576a0e2486910fcb

## Ropsten network configuration (test #2 - softcap not reached)

### Crowdsale stages

### Pre Token General Event
* _Price_                      : 1 ETH = 1 BLD
* _Minimal insvestment limit_  : 0.1 ETH
* _Softcap_                    : 1 BLD
* _Hardcap_                    : 10 BLD
* _Start_                      : Jan 25 2018 01:20:00 GMT+0300
* _Period_                     : 30 days
* _Contract manager_           : 0xf62158b03Edbdb92a12c64E4D8873195AC71aF6A
* _Direct mint agent_          : 
* _ETH Wallet_                 : 0xd89626E2c4218281Ad0Fc5F22AE52dC0FF39DDC4

#### Links
* _Token_  - https://ropsten.etherscan.io/address/0xb2f9d32bcc11833d186983198dbf81a3a312a468
* _PreTGE_ - https://ropsten.etherscan.io/address/0x43a325e46aec0ee354dd67a30106f0cca75a55b6

### Test audit (PreTGE)

#### Purchasers
* 0.1 ETH => 0.1 token, gas = 98340
https://ropsten.etherscan.io/tx/0xccfa6dd22b79c7af1cd201028d3bd801035ba5f42163d31292b9fd8b7a46d5e7
* refund, gas = 20089
https://ropsten.etherscan.io/tx/0xec583c50e0075ce16e71cd617730e22333babdf5eeff1b326860ec00c623e956

#### Service operations
* setDirectMintLimit, gas = 42948
https://ropsten.etherscan.io/tx/0x627be124c4886e3e616c6184b8b0123dde9436dab7c0b7934765e4b29f52c03c
* directMint before the sale begins, gas = 108728
https://ropsten.etherscan.io/tx/0x1c38b10c97032174301e9facbb299cdfdde013e856f2962a8a393951a060a887
* finish, gas = 43757
http://ropsten.etherscan.io/tx/0x533e70b6efbbfd896ed2e4ca19bb9b57646367f760ec4b31c94fac3014b2c010

### Test audit (Token)

#### Purchasers
* transfer tokens after finishMinting, gas = 38139
https://ropsten.etherscan.io/tx/0x357f285bf1cf9af71957013a141eec835b1020959b780f56e6abbbcfb6b7a910

#### Service operations
* finishMinting, gas = 34618
https://ropsten.etherscan.io/tx/0xcc98175ccfaea13925cf63cbc581627c2e752f7e3c8f314a47db5c329a671641
