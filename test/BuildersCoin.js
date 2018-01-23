import additional from './BuildersCoin/additional';
import basic from './BuildersCoin/basic';
import mintable from './BuildersCoin/mintable';
import ownable from './BuildersCoin/ownable';
import standard from './BuildersCoin/standard';

const BuildersCoin = artifacts.require('BuildersCoin.sol');

contract('BuildersCoin', function (accounts) {
  describe('Basic Token', function () {
    basic(BuildersCoin, accounts);
  });
  describe('Standard Token', function () {
    standard(BuildersCoin, accounts);
  });
  describe('Mintable Token', function () {
    mintable(BuildersCoin, accounts);
  });
  describe('Ownable Token', function () {
    ownable(BuildersCoin, accounts);
  });
  describe('Additional conditions', function () {
    additional(BuildersCoin, accounts);
  });
});
