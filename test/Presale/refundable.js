import ether from '../helpers/ether';
import { advanceBlock } from '../helpers/advanceToBlock';
import { increaseTimeTo, duration } from '../helpers/increaseTime';
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
    this.afterEnd = this.end + duration.seconds(1);
    this.price = ether(1);
    this.softcap = ether(10);
    this.hardcap = ether(98);
    this.MinInvestmentLimit = ether(0.1);
    this.developersLimit = ether(3.5);

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

  it('should deny refunds before end', async function () {
    await presale.sendTransaction({value: ether(1), from: wallets[3]});
    await presale.refund({from: wallets[3]}).should.be.rejectedWith(EVMRevert);
  });

  it('should deny refunds after end if goal was reached', async function () {
    await presale.sendTransaction({value: this.softcap, from: wallets[3]});
    await increaseTimeTo(this.afterEnd);
    await presale.refund({from: wallets[3]}).should.be.rejectedWith(EVMRevert);
  });

  it('should allow refunds after end if goal was not reached', async function () {
    const investment = this.softcap.minus(1);
    await presale.sendTransaction({value: investment, from: wallets[3]});
    await increaseTimeTo(this.afterEnd);
    await presale.finish({from: wallets[1]});
    const pre = web3.eth.getBalance(wallets[3]);
    await presale.refund({from: wallets[3], gasPrice: 0}).should.be.fulfilled;
    const post = web3.eth.getBalance(wallets[3]);
    post.minus(pre).should.be.bignumber.equal(investment);
  });

  it('should correctly calculate refund', async function () {
    const investment1 = ether(1);
    const investment2 = ether(2);
    await presale.sendTransaction({value: investment1, from: wallets[3]});
    await presale.sendTransaction({value: investment2, from: wallets[3]});
    await increaseTimeTo(this.afterEnd);
    await presale.finish({from: wallets[1]});
    const pre = web3.eth.getBalance(wallets[3]);
    await presale.refund({from: wallets[3], gasPrice: 0}).should.be.fulfilled;
    const post = web3.eth.getBalance(wallets[3]);
    post.minus(pre).should.bignumber.equal(investment1.plus(investment2));
  });

  it('should forward funds to wallet after end if goal was reached', async function () {
    const investment = this.softcap;
    await presale.sendTransaction({value: investment, from: wallets[3]});
    await increaseTimeTo(this.afterEnd);
    const pre = web3.eth.getBalance(wallets[2]);
    await presale.finish({from: wallets[1]}).should.be.fulfilled;
    const post = web3.eth.getBalance(wallets[2]);
    post.minus(pre).should.be.bignumber.equal(investment - this.developersLimit);
  });
}
