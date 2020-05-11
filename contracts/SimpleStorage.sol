pragma solidity >=0.4.21 <0.7.0;


//This contract is just for testing puposes
contract SimpleStorage {
  uint storedData;

  function set(uint x) public {
    storedData = x;
  }

  function get() public view returns (uint) {
    return storedData;
  }
}
