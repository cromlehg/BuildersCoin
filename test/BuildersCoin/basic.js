import assertRevert from '../helpers/assertRevert';

export default function (BuildersCoin, accounts) {
  let token;

  beforeEach(async function () {
    token = await BuildersCoin.new();
  });

  it('should return correct balances after transfer', async function () {
    await token.mint(accounts[0], 100);
    await token.transfer(accounts[1], 100);
    let firstAccountBalance = await token.balanceOf(accounts[0]);
    assert.equal(firstAccountBalance, 0);
    let secondAccountBalance = await token.balanceOf(accounts[1]);
    assert.equal(secondAccountBalance, 100);
  });

  it('should throw an error when trying to transfer more than balance', async function () {
    await token.mint(accounts[0], 100);
    await assertRevert(token.transfer(accounts[1], 101));
  });

  it('should throw an error when trying to transfer to 0x0', async function () {
    await token.mint(accounts[0], 100);
    await assertRevert(token.transfer(0x0, 100));
  });
}
