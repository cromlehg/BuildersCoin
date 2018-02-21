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

    presale.setPrice(1400000000000000000000); // 1 ETH = 1400 BLD
    presale.setMinInvestmentLimit(100000000000000000); // 0.1 ETH
    presale.setDirectMintLimit(1000000000000000000000000); // 1 000 000 BLD
    presale.setHardcap(357142857000000000000); // 357.142857 ETH
    presale.setStart(1521543600); // Mar 20 2018 14:00:00 GMT+0300
    presale.setDuration(30); // 30 days
    presale.setWallet(0x8617f1ba539d45dcefbb18c40141e861abf288b7);
    presale.setToken(token);

    token.setSaleAgent(presale);

    address manager = 0x9DFF939e27e992Ac8635291263c3aa41654f3228;

    token.transferOwnership(manager);
    presale.transferOwnership(manager);
  }

}
