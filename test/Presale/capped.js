import ether from '../helpers/ether';
import {advanceBlock} from '../helpers/advanceToBlock';
import {duration} from '../helpers/increaseTime';
import latestTime from '../helpers/latestTime';
import EVMRevert from '../helpers/EVMRevert';

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(web3.BigNumber))
  .should();

export default function (Token, Presale, wallets) {
  let token;
  let presale;

  before(async function () {
    // Advance to the next block to correctly read time in the solidity "now" function interpreted by testrpc
    await advanceBlock();
  });

  beforeEach(async function () {
    this.start = latestTime();
    this.end = this.startTime + duration.days(30);
    this.price = ether(1);
    this.softcap = ether(10);
    this.hardcap = ether(98);
    this.MinInvestmentLimit = ether(0.1);

    token = await Token.new();
    presale = await Presale.new();
    await presale.setPrice(this.price);
    await presale.setMinInvestmentLimit(this.MinInvestmentLimit);
    await presale.setSoftcap(this.softcap);
    await presale.setHardcap(this.hardcap);
    await presale.setStart(this.start);
    await presale.setDuration(30);
    await presale.setWallet(wallets[2]);
    await presale.setToken(token.address);
    await token.setSaleAgent(presale.address);
    await token.transferOwnership(wallets[1]);
    await presale.transferOwnership(wallets[1]);
  });

  it('should accept payments within hardcap', async function () {
    await presale.sendTransaction({value: this.hardcap.minus(1), from: wallets[3]}).should.be.fulfilled;
    await presale.sendTransaction({value: ether(1), from: wallets[4]}).should.be.fulfilled;
  });

  it('should reject payments outside hardcap', async function () {
    await presale.sendTransaction({value: this.hardcap, from: wallets[5]}).should.be.fulfilled;
    await presale.sendTransaction({value: ether(1), from: wallets[4]}).should.be.rejectedWith(EVMRevert);
  });

  it('should accept payments that exceed hardcap', async function () {
    await presale.sendTransaction({value: this.hardcap.plus(1), from: wallets[6]}).should.be.fulfilled;
  });

  it('should be ended if hardcap reached', async function () {
    let hardcapReached;
    hardcapReached = await presale.hardcapReached();
    hardcapReached.should.equal(false);
    await presale.sendTransaction({value: this.hardcap, from: wallets[7]}).should.be.fulfilled;
    hardcapReached = await presale.hardcapReached();
    hardcapReached.should.equal(true);
  });
}
