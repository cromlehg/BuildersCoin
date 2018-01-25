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

  // Since token has the same decimals as an ether, we can use ether() function here
  const tokens = value => ether(value);

  before(async function () {
    // Advance to the next block to correctly read time in the solidity "now" function interpreted by testrpc
    await advanceBlock();
  });

  beforeEach(async function () {
    this.start = latestTime();
    this.duration = duration.days(30);
    this.end = this.startTime + this.duration;
    this.price = ether(1);
    this.softcap = ether(10);
    this.hardcap = ether(98);
    this.MinInvestmentLimit = ether(0.1);
    this.directMintLimit = tokens(10);

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
    await presale.setDirectMintAgent(wallets[3]);
    await presale.setDirectMintLimit(this.directMintLimit);
    await token.setSaleAgent(presale.address);
    await token.transferOwnership(wallets[1]);
    await presale.transferOwnership(wallets[1]);
  });

  it('should directMint', async function () {
    await presale.directMint(wallets[4], ether(1), {from: wallets[1]}).should.be.fulfilled;
    const balance = await token.balanceOf(wallets[4]);
    balance.should.bignumber.equal(tokens(1));
  });

  it('should change mintedDirectly value', async function () {
    let mintedDirectly = await presale.mintedDirectly();
    mintedDirectly.should.bignumber.equal(0);
    await presale.directMint(wallets[4], ether(1), {from: wallets[1]}).should.be.fulfilled;
    mintedDirectly = await presale.mintedDirectly();
    mintedDirectly.should.bignumber.equal(ether(1));
  });

  it('should directMint regardless of the sale time', async function () {
    let pre;
    let post;
    await presale.setStart(this.start + duration.seconds(30), {from: wallets[1]});
    await presale.sendTransaction({value: ether(1), from: wallets[3]}).should.be.rejectedWith(EVMRevert);
    pre = await token.balanceOf(wallets[4]);
    await presale.directMint(wallets[4], tokens(1), {from: wallets[1]}).should.be.fulfilled;
    post = await token.balanceOf(wallets[4]);
    post.minus(pre).should.bignumber.equal(tokens(1));
    await presale.setStart(this.start - duration.days(this.duration), {from: wallets[1]});
    await presale.sendTransaction({value: ether(1), from: wallets[3]}).should.be.rejectedWith(EVMRevert);
    await presale.directMint(wallets[4], tokens(0.5), {from: wallets[1]}).should.be.fulfilled;
    pre = await token.balanceOf(wallets[4]);
    await presale.directMint(wallets[4], tokens(0.5), {from: wallets[1]}).should.be.fulfilled;
    post = await token.balanceOf(wallets[4]);
    post.minus(pre).should.bignumber.equal(tokens(0.5));
  });

  it('should reject directMint outside directMintLimit', async function () {
    await presale.directMint(wallets[4], tokens(0.001), {from: wallets[1]}).should.be.fulfilled;
    await presale.directMint(wallets[4], this.directMintLimit, {from: wallets[1]}).should.be.rejectedWith(EVMRevert);
  });

  it('should not change mintedDirectly or totalSupply when directMint is rejected ', async function () {
    const pre = await token.totalSupply();
    await presale.directMint(wallets[5], this.directMintLimit.add(tokens(0.01)), {from: wallets[1]}).should.be.rejectedWith(EVMRevert);
    const post = await token.totalSupply();
    pre.minus(post).should.bignumber.equal(0);
    const balance = await token.balanceOf([wallets[5]]);
    balance.should.bignumber.equal(0);
    const mintedDirectly = await presale.mintedDirectly();
    mintedDirectly.should.bignumber.equal(0);
  });
}
