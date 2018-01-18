import basic from './BuildersCoin/basic';
import mintable from './BuildersCoin/mintable';

const BuildersCoin = artifacts.require('../contracts/Tokens/BuildersCoin.sol');

contract('BuildersCoin', function (accounts) {
  describe('Basic Token', function () {
    basic(BuildersCoin, accounts);
  });
  describe('Mintable Token', function () {
    mintable(BuildersCoin, accounts);
  });
});
