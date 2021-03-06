import expectThrow from '../helpers/expectThrow';

export default function (BuildersCoin, accounts) {
  let token;

  beforeEach(async function () {
    token = await BuildersCoin.new();
  });

  it('should start with a totalSupply of 0', async function () {
    const totalSupply = await token.totalSupply();
    assert.equal(totalSupply, 0);
  });

  it('should return mintingFinished false after construction', async function () {
    const mintingFinished = await token.mintingFinished();
    assert.equal(mintingFinished, false);
  });

  it('should mint a given amount of tokens to a given address', async function () {
    const result = await token.mint(accounts[0], 100);
    assert.equal(result.logs[0].event, 'Mint');
    assert.equal(result.logs[0].args.to.valueOf(), accounts[0]);
    assert.equal(result.logs[0].args.amount.valueOf(), 100);
    assert.equal(result.logs[1].event, 'Transfer');
    assert.equal(result.logs[1].args.from.valueOf(), 0x0);

    const balance0 = await token.balanceOf(accounts[0]);
    assert(balance0, 100);

    const totalSupply = await token.totalSupply();
    assert(totalSupply, 100);
  });

  it('should fail to mint after call to finishMinting', async function () {
    await token.finishMinting();
    assert.equal(await token.mintingFinished(), true);
    await expectThrow(token.mint(accounts[0], 100));
  });
}
