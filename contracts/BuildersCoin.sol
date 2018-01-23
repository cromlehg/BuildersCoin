pragma solidity ^0.4.18;

import './token/MintableToken.sol';

contract BuildersCoin is MintableToken {

  string public constant name = 'Builders Coin';
  string public constant symbol = 'BLD';
  uint32 public constant decimals = 18;
  address public saleAgent;

  modifier notLocked() {
    require(msg.sender == owner || msg.sender == saleAgent || mintingFinished);
    _;
  }

  modifier onlyOwnerOrSaleAgent() {
    require(msg.sender == owner || msg.sender == saleAgent);
    _;
  }

  function setSaleAgent(address newSaleAgnet) public {
    require(msg.sender == owner || msg.sender == saleAgent);
    saleAgent = newSaleAgnet;
  }

  function mint(address _to, uint256 _amount) onlyOwnerOrSaleAgent canMint public returns (bool) {
    totalSupply = totalSupply.add(_amount);
    balances[_to] = balances[_to].add(_amount);
    Mint(_to, _amount);
    Transfer(address(0), _to, _amount);
    return true;
  }

  function finishMinting() public onlyOwnerOrSaleAgent returns (bool) {
    return super.finishMinting();
  }

  function transfer(address _to, uint256 _value) public notLocked returns (bool) {
    return super.transfer(_to, _value);
  }

  function transferFrom(address from, address to, uint256 value) public notLocked returns (bool) {
    return super.transferFrom(from, to, value);
  }

}
