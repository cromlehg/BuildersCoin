import ether from '../helpers/ether';
import { advanceBlock } from '../helpers/advanceToBlock';
import { increaseTimeTo, duration } from '../helpers/increaseTime';
import latestTime from '../helpers/latestTime';
import EVMRevert from '../helpers/EVMRevert';

const should = require('chai')
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
    this.duration = 30;
    this.end = this.start + duration.days(this.duration);
    this.afterEnd = this.end + duration.seconds(1);
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
    await presale.setDuration(this.duration);
    await presale.setWallet(wallets[2]);
    await presale.setToken(token.address);
    await token.setSaleAgent(presale.address);
    await token.transferOwnership(wallets[1]);
    await presale.transferOwnership(wallets[1]);
  });

  it('presale should be a saleAgent for token', async function () {
    const owner = await token.saleAgent();
    owner.should.equal(presale.address);
  });

  it('end should be equal to start + duration', async function () {
    const start = await presale.start();
    const end = await presale.end();
    end.should.bignumber.equal(start.plus(duration.days(this.duration)));
  });

  it('should reject payments before start', async function () {
    await presale.setStart(this.start + duration.seconds(30), {from: wallets[1]});
    await presale.sendTransaction({value: ether(1), from: wallets[3]}).should.be.rejectedWith(EVMRevert);
  });

  it('should accept payments after start', async function () {
    await presale.sendTransaction({value: ether(1), from: wallets[3]}).should.be.fulfilled;
  });

  it('should reject payments after end', async function () {
    await increaseTimeTo(this.afterEnd);
    await presale.sendTransaction({value: ether(1), from: wallets[3]}).should.be.rejectedWith(EVMRevert);
  });

  it('should increase investedWei', async function () {
    await presale.sendTransaction({value: ether(1), from: wallets[3]});
    const investedWei = await presale.investedWei();
    investedWei.should.be.bignumber.equal(ether(1));
  });

  it('should assign tokens to sender', async function () {
    await presale.sendTransaction({value: ether(1), from: wallets[3]});
    const balance = await token.balanceOf(wallets[3]);
    balance.should.be.bignumber.equal(ether(1));
  });
}
