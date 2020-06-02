import React, { Component } from 'react';
import SimpleStorageContract from './contracts/SimpleStorage.json';
import getWeb3 from './getWeb3';
import Button from 'react-bootstrap/Button';
import './App.css';

const ipfsClient = require('ipfs-api');

const ipfs = new ipfsClient({
	host: 'ipfs.infura.io',
	port: 5001,
	protocol: 'https',
});

class App extends Component {
	constructor(props) {
		super(props);
		this.state = { storageValue: 0, web3: null, accounts: null, contract: null, buffer: null, loc: '' };
		this.handleFileChange = this.handleFileChange.bind(this);
		this.runExample = this.runExample.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
	}

	componentDidMount = async () => {
		try {
			// Get network provider and web3 instance.
			const web3 = await getWeb3();

			// Use web3 to get the user's accounts.
			const accounts = await web3.eth.getAccounts();

			// Get the contract instance.
			const networkId = await web3.eth.net.getId();
			const deployedNetwork = SimpleStorageContract.networks[networkId];
			const instance = new web3.eth.Contract(SimpleStorageContract.abi, deployedNetwork && deployedNetwork.address);

			// Set web3, accounts, and contract to the state, and then proceed with an
			// example of interacting with the contract's methods.
			this.setState({ web3, accounts, contract: instance });
		} catch (error) {
			// Catch any errors for any of the above operations.
			alert(`Failed to load web3, accounts, or contract. Check console for details.`);
			console.error(error);
		}
	};


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

	handleFileChange = (event) => {
		console.log('got a file');
		event.preventDefault();
		//fetch the file
		const file = event.target.files[0];

		//reader converts file to a buffer
		const reader = new window.FileReader();
		reader.readAsArrayBuffer(file);
		reader.onloadend = () => {
			this.setState({ buffer: Buffer(reader.result) });
			console.log(this.state.buffer);
		};
  };

  //Upload to IPFS
  
	onSubmit(event) {
		event.preventDefault()
    ipfs.files.add(this.state.buffer, (error, result) => {
      if(error) {
        console.error(error)
        return
      }
         this.setState({ loc: "https://ipfs.infura.io/ipfs/"+result[0].hash })
        console.log("to view the file, go to: ", this.state.loc)
    })
	}

	//Render shows the content of the page

	render() {
		if (!this.state.web3) {
			return <div>Loading Web3, accounts, and contract...</div>;
		}
		return (
			//This is a test .. Delete Later: From here>>>>>
			<div className='App'>
				<h1>Good to Go!</h1>

				<p>click on the button, the vlue should come from the smart contract.</p>
				<Button variant='primary' onClick={this.runExample}>
					Check contract {this.state.storageValue}
				</Button>

				<form onSubmit={this.onSubmit}>
					<div class='form-group'>
						<label for='caseFile'>File input</label>
						<input type='file' onChange={this.handleFileChange} class='form-control-file' id='caseFile' />
					</div>
					<button type='submit' class='btn btn-primary'>
						Submit
					</button>
					<div>Location of your File : {this.state.loc}</div>
				</form>
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
