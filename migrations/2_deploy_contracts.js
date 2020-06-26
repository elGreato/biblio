var SimpleStorage = artifacts.require("./SimpleStorage.sol");
var LibraryContract = artifacts.require("./LibraryContract.sol")

module.exports = function(deployer) {
  deployer.deploy(SimpleStorage);
  deployer.deploy(LibraryContract)
};
