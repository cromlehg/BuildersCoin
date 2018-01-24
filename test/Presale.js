import capped from './Presale/capped';
import common from './Presale/common';
import refundable from './Presale/refundable';

const BuildersCoin = artifacts.require('BuildersCoin.sol');
const Presale = artifacts.require('Presale.sol');

contract('Presale - common test', function (accounts) {
  common(BuildersCoin, Presale, accounts);
});

contract('Presale - capped crowdsale test', function (accounts) {
  capped(BuildersCoin, Presale, accounts);
});

contract('Presale - refundable crowdsale test', function (accounts) {
  refundable(BuildersCoin, Presale, accounts);
});
