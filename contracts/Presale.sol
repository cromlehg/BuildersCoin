pragma solidity ^0.4.18;

import './math/SafeMath.sol';
import './ownership/Ownable.sol';
import './BuildersCoin.sol';

contract Presale is Ownable {

  using SafeMath for uint;

  uint public price;
  uint public start;
  uint public end;
  uint public duration;
  uint public softcap;
  uint public hardcap;
  uint public minInvestmentLimit;
  uint public investedWei;
  uint public directMintLimit;
  uint public mintedDirectly;
  bool public softcapReached;
  bool public hardcapReached;
  bool public refundIsAvailable;
  address public directMintAgent;
  address public wallet;
  BuildersCoin public token;
  mapping(address => uint) balances;

  event SoftcapReached();
  event HardcapReached();
  event RefundIsAvailable();

  modifier onlyOwnerOrDirectMintAgent() {
    require(msg.sender == owner || msg.sender == directMintAgent);
    _;
  }

  //---------------------------------------------------------------------------
  // Configuration setters
  //---------------------------------------------------------------------------

  function setDirectMintAgent(address _directMintAgent) public onlyOwner {
    directMintAgent = _directMintAgent;
  }

  function setDirectMintLimit(uint _directMintLimit) public onlyOwner {
    directMintLimit = _directMintLimit;
  }

  function setMinInvestmentLimit(uint _minInvestmentLimit) public onlyOwner {
    minInvestmentLimit = _minInvestmentLimit;
  }

  function setPrice(uint _price) public onlyOwner {
    price = _price;
  }

  function setToken(address _token) public onlyOwner {
    token = BuildersCoin(_token);
  }

  function setWallet(address _wallet) public onlyOwner {
    wallet = _wallet;
  }

  function setStart(uint _start) public onlyOwner {
    start = _start;
  }

  function setDuration(uint _duration) public onlyOwner {
    duration = _duration;
    end = start.add(_duration.mul(1 days));
  }

  function setSoftcap(uint _softcap) public onlyOwner {
    softcap = _softcap;
    if (investedWei >= softcap) {
      SoftcapReached();
      softcapReached = true;
    }
  }

  function setHardcap(uint _hardcap) public onlyOwner {
    hardcap = _hardcap;
  }

  //---------------------------------------------------------------------------
  // Mint functions
  //---------------------------------------------------------------------------

  function mintAndTransfer(address _to, uint _tokens) internal {
    token.mint(this, _tokens);
    token.transfer(_to, _tokens);
  }

  function mint(address _to, uint _investedWei) internal {
    require(_investedWei >= minInvestmentLimit && !hardcapReached && now >= start && now < end);
    uint tokens = _investedWei.mul(1 ether).div(price);
    mintAndTransfer(_to, tokens);
    balances[_to] = balances[_to].add(_investedWei);
    investedWei = investedWei.add(_investedWei);
    if (investedWei >= softcap && ! softcapReached) {
      SoftcapReached();
      softcapReached = true;
    }
    if (investedWei >= hardcap) {
      HardcapReached();
      hardcapReached = true;
    }
  }

  function directMint(address _to, uint _tokens) public onlyOwnerOrDirectMintAgent {
    mintedDirectly = mintedDirectly.add(_tokens);
    require(mintedDirectly <= directMintLimit);
    mintAndTransfer(_to, _tokens);
  }

  //---------------------------------------------------------------------------
  // Withdraw functions
  //---------------------------------------------------------------------------

  function refund() public {
    require(refundIsAvailable && balances[msg.sender] > 0);
    uint value = balances[msg.sender];
    balances[msg.sender] = 0;
    msg.sender.transfer(value);
  }

  function withdraw() public onlyOwner {
    require(softcapReached);
    wallet.transfer(this.balance);
  }

  //---------------------------------------------------------------------------
  // Service functions
  //---------------------------------------------------------------------------

  function finish() public onlyOwner {
    if (investedWei < softcap) {
      RefundIsAvailable();
      refundIsAvailable = true;
    } else {
      withdraw();
    }
  }

  //---------------------------------------------------------------------------
  // Fallback function
  //---------------------------------------------------------------------------

  function () external payable {
    mint(msg.sender, msg.value);
  }

}
