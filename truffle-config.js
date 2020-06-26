const path = require("path");

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    development: {
      host: '127.0.0.1',
      port: 7545,
      gas: 4612388, // Gas limit used for deploys
      network_id: '*', // Match any network id
    },
    quorum:{
      host: '127.0.0.1', 
      port: 22000,
      network_id: "*",
      gas:0,
      gasPrice:0,
      type: "quorum"
    }
  }
};
