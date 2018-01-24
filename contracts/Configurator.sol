pragma solidity ^0.4.18;

import './ownership/Ownable.sol';
import './BuildersCoin.sol';
import './Presale.sol';

contract Configurator is Ownable {

  BuildersCoin public token;
  Presale public presale;

  function deploy() public onlyOwner {

    token = new BuildersCoin();
    presale = new Presale();

    presale.setPrice(1000000000000000000); // 1 BLD = 1 ETH
    presale.setMinInvestmentLimit(100000000000000000); // 0.1 ETH
    presale.setSoftcap(1000000000000000000); // 1 ETH
    presale.setHardcap(10000000000000000000); // 10 ETH
    presale.setStart(1516791600); // Jan 24 2018 14:00:00 GMT+0300
    presale.setDuration(30); // 30 days
    presale.setWallet(0xd89626E2c4218281Ad0Fc5F22AE52dC0FF39DDC4); // my test wallet in Ropsten
    presale.setToken(token);

    token.setSaleAgent(presale);

    address manager = 0xf62158b03Edbdb92a12c64E4D8873195AC71aF6A; // my test wallet in Ropsten

    // remove this two lines if directMintAgent == manager
    presale.setDirectMintLimit(1000000000000000000000000); // 1 000 000 BLD
    presale.setDirectMintAgent(0xf62158b03Edbdb92a12c64E4D8873195AC71aF6A);

    token.transferOwnership(manager);
    presale.transferOwnership(manager);
  }

}
