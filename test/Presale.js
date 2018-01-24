import capped from './Presale/capped';
import refundable from './Presale/refundable';

const BuildersCoin = artifacts.require('BuildersCoin.sol');
const Presale = artifacts.require('Presale.sol');

contract('Presale', function (accounts) {
  describe('Capped Crowdsale', function () {
    capped(BuildersCoin, Presale, accounts);
  });
  describe('Refundable Crowdsale', function () {
    refundable(BuildersCoin, Presale, accounts);
  });
});
