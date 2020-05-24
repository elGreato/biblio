import React, { Component } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import getWeb3 from "./getWeb3";
import Button from 'react-bootstrap/Button'
import ipfs from './APIs/IPFSapi'
import "./App.css";

class App extends Component {
  state = { storageValue: 0, web3: null, accounts: null, contract: null, buffer: null };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SimpleStorageContract.networks[networkId];
      const instance = new web3.eth.Contract(
        SimpleStorageContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  //this block will be removed later
  runExample = async () => {
    const { accounts, contract } = this.state;

    // Stores a given value, 5 by default.
    await contract.methods.set(5).send({ from: accounts[0] });

    // Get the value from the contract to prove it worked.
    const response = await contract.methods.get().call();

    // Update state with the result.
    this.setState({ storageValue: response });
  };

  handleFileChange = async(event) => {
    event.preventDefault();
     //fetch the file
     const file = event.target.files[0]

     //reader converts file to a buffer
     const reader = new window.FileReader()
     reader.readAsArrayBuffer(file)
     reader.onloadend = () => {
       this.setState({ buffer: Buffer(reader.result) })
     }
     let result =  ipfs(file)
     
  }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Good to Go!</h1>
        <p>just initiated our project Biblio.</p>
        <h2>Smart Contract Example</h2>
        <h3>Nico, Richard and Javi. this application requires that you have Metamask. please make sure that you have it</h3>
        <p>
          this is just a test contract. it should give the value 5 if it is on the blockchain
        </p>
        <p>
         click on the button, the vlue should come from the smart contract.
        </p>
         <Button variant="primary" onClick={this.runExample}>
           Check contract {this.state.storageValue}
           </Button>
           <div class="form-group">
                    <label for="caseFile">File input</label>
                    <input
                      type="file"
                      onChange= {event => {this.handleFileChange(event)}}
                      class="form-control-file"
                      id="caseFile"
                    />
                  </div>
        <div>The stored value is: </div>
      </div>
    );
  }
}

export default App;
