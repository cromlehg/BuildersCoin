import capped from './Presale/capped';

const BuildersCoin = artifacts.require('BuildersCoin.sol');
const Presale = artifacts.require('Presale.sol');

contract('Presale', function (accounts) {
  describe('Capped Crowdsale', function () {
    capped(BuildersCoin, Presale, accounts);
  });
});
