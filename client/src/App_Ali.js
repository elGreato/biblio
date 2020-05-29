import React, { Component } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import getWeb3 from "./getWeb3";
import Button from 'react-bootstrap/Button'
import ipfs from './APIs/IPFSapi'
import "./App.css";

class App extends Component {
  state = { storageValue: 0, web3: null, accounts: null, contract: null, buffer: null };

  componentDidMount = async () => {

    //I already implemented a normal web3js for you to use as an example. 
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

  //TODO: Web3 of Besu (if any)





  //TODO Web3 of Quorum https://github.com/jpmorganchase/quorum.js/






  //this block will be removed later .. this is just to test the smart contract
  runExample = async () => {
    const { accounts, contract } = this.state;

    // Stores a given value, 5 by default.
    await contract.methods.set(5).send({ from: accounts[0] });

    // Get the value from the contract to prove it worked.
    const response = await contract.methods.get().call();

    // Update state with the result.
    this.setState({ storageValue: response });
  };



  //Function to receive a file (pdf) from a user that we upload to IPFS

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


  //Render shows the content of the page

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      //This is a test .. Delete Later: From here>>>>>
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
      //Till here <<<<<<<<<

      //TODO a simple Form to submit a book (this should call the handleFileChange function)


      //TODO: a simple table that shows the list of books we have, with buttons to buy 





      //TODO a simple menu to choose between Quorum and Besu 




      //TODO some other data about the blockchain (Current block, amounts of blocks ....etc. we can discuss this later)


    );
  }
}

export default App;
