import capped from './Presale/capped';
import common from './Presale/common';
import refundable from './Presale/refundable';

const BuildersCoin = artifacts.require('BuildersCoin.sol');
const Presale = artifacts.require('Presale.sol');

contract('Presale', function (accounts) {
  describe('Common Crowdsale', function () {
    common(BuildersCoin, Presale, accounts);
  });
  describe('Capped Crowdsale', function () {
    capped(BuildersCoin, Presale, accounts);
  });
  describe('Refundable Crowdsale', function () {
    refundable(BuildersCoin, Presale, accounts);
  });
});
