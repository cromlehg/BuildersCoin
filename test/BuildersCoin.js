import basic from './BuildersCoin/basic';
import mintable from './BuildersCoin/mintable';
import standard from './BuildersCoin/standard';

const BuildersCoin = artifacts.require('../contracts/Tokens/BuildersCoin.sol');

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
});
