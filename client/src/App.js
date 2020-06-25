import React, { Component } from 'react';
import LibraryContract from './contracts/LibraryContract.json';
import getWeb3 from './getWeb3';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FormGroup, Label, Modal, ModalHeader, ModalBody, ModalFooter, Table, Button, FormText } from 'reactstrap';

const ipfsClient = require('ipfs-api');

const ipfs = new ipfsClient({
	host: 'ipfs.infura.io',
	port: 5001,
	protocol: 'https'
});

class App extends Component {
	state = {
		accounts: null,
		booksCount: null,
		books: [],
		loading: true,
		buffer: null,
		web3: null,
		contract: null,
		value: null,
		bookTitle: null
	};

	constructor(props) {
		super(props);

		/*this.handleFileChange = this.handleFileChange.bind(this);
		this.runExample = this.runExample.bind(this);
		this.onSubmit = this.onSubmit.bind(this);*/

		this.createBook = this.createBook.bind(this);
		this.purchaseBook = this.purchaseBook.bind(this);
	}

	componentDidMount = async () => {
		//I already implemented a normal web3js for you to use as an example.
		try {
			// Get network provider and web3 instance.
			const web3 = await getWeb3();

			// Use web3 to get the user's accounts.
			const accounts = await web3.eth.getAccounts();

			// Get the contract instance.
			const networkId = await web3.eth.net.getId();
			const deployedNetwork = LibraryContract.networks[networkId];
			const instance = new web3.eth.Contract(LibraryContract.abi, deployedNetwork && deployedNetwork.address);

			// Set web3, accounts, and contract to the state, and then proceed with an
			// example of interacting with the contract's methods.
			this.setState({ web3, accounts, contract: instance }, this.loadBooks);
		} catch (error) {
			// Catch any errors for any of the above operations.
			alert(`Failed to load web3, accounts, or contract. Check console for details.`);
			console.error(error);
		}
	};

	//TODO Web3 of Quorum https://github.com/jpmorganchase/quorum.js/
	loadBooks = async () => {
		const response = await this.state.contract.methods.booksCount().call();

		for (var i = 1; i <= response; i++) {
			const book = await this.state.contract.methods.books(i).call();
			this.setState({
				books: [...this.state.books, book]
			});
		}

		this.setState({ booksCount: response });
	};

	//Function to receive a file (pdf) from a user that we upload to IPFS

	handleFileChange = async event => {
		event.preventDefault();
		//fetch the file
		const file = event.target.files[0];
		//reader converts file to a buffer
		const reader = new window.FileReader();
		reader.readAsArrayBuffer(file);
		reader.onloadend = () => {
			this.setState({ buffer: Buffer(reader.result) });
			console.log(this.state.buffer); //
		};
	};

	toggleNewBookModal() {
		this.setState({
			newBookModal: !this.state.newBookModal
		});
	}

	toggleDescriptionModal() {
		this.setState({
			descriptionModal: !this.state.descriptionModal
		});
	}

	toggleDescriptionModal2(bookTitle, bookDescription) {
		this.setState({
			bookTitle: bookTitle,
			bookDescription: bookDescription,
			descriptionModal: !this.state.descriptionModal
		});
	}

	createBook(bookType, bookTitle, bookDescription, bookLocation, bookPrice) {
		//this.setState({ loading: true })
		//console.log(this.state.accounts)
		this.state.contract.methods.createBook(bookType, bookTitle, bookDescription, bookLocation, bookPrice).send({ from: this.state.accounts[0] });
		/*     .once('receipt', (receipt) => {
          this.setState({ loading: false })
        }) */
	}

	purchaseBook(bookId, bookPrice) {
		//   this.setState({ loading: true })
		this.state.contract.methods.purchaseBook(bookId).send({ from: this.state.accounts[0], value: bookPrice });
		//   .once('receipt', (receipt) => {
		//     this.setState({ loading: false })
		//   })
	}

	//Upload to IPFS
	uploadBook = async event => {
		event.preventDefault();
		const type = this.bookType.value;
		const title = this.bookTitle.value;
		const description = this.bookDescription.value;
		const price = this.bookPrice.value;

		await ipfs.files.add(this.state.buffer, (error, result) => {
			if (error) {
				console.error(error);
				console.log('error happened here');
				return;
			}
			this.setState({ loc: 'https://ipfs.infura.io/ipfs/' + result[0].hash });
			console.log('to view the file, go to: ', this.state.loc);
			this.createBook(type, title, description, this.state.loc, price);
		});
	};

	//Render shows the content of the page
	render() {
		if (!this.state.web3) {
			return <div>Loading Web3, accounts, and contract...</div>;
		}
		return (
			<div className="App container">
				<h1>Books App</h1>

				<Button className="my-3" color="primary" onClick={this.toggleNewBookModal.bind(this)}>
					Add Book
				</Button>
				<Modal isOpen={this.state.newBookModal} toggle={this.toggleNewBookModal.bind(this)}>
					<ModalHeader toggle={this.toggleNewBookModal.bind(this)}>Add a new book</ModalHeader>

					<form onSubmit={this.uploadBook}>
						<ModalBody>
							<FormGroup>
								<Label for="bookTitle">Book Title</Label>
								<div>
									<input
										id="bookTitle"
										type="text"
										ref={input => {
											this.bookTitle = input;
										}}
										className="form-control"
										placeholder=""
										required
									/>
								</div>
							</FormGroup>

							<FormGroup>
								<Label for="bookType">Book Type</Label>
								<div>
									<select
										id="bookType"
										type="text"
										ref={input => {
											this.bookType = input;
										}}
										className="form-control"
										placeholder=""
										required
									>
										<option disabled selected>
											Please select
										</option>
										<option value="1">Technical</option>
										<option value="2">Manual</option>
										<option value="3">OTHERS</option>
									</select>
								</div>
							</FormGroup>
							<FormGroup>
								<Label for="bookDescription">Book Description</Label>
								<div>
									<textarea
										id="bookDescription"
										type="text"
										ref={input => {
											this.bookDescription = input;
										}}
										className="form-control"
										placeholder=""
										required
									/>
								</div>
							</FormGroup>
							<FormGroup>
								<Label for="bookPrice">Book Price (in Ether)</Label>
								<div>
									<input
										id="bookPrice"
										type="text"
										ref={input => {
											this.bookPrice = input;
										}}
										className="form-control"
										required
									/>
								</div>
							</FormGroup>

							<FormGroup>
								<Label for="bookLocation">Book Location</Label>
								<div>
									<input id="bookLocation" type="file" onChange={this.handleFileChange} required />
								</div>
							</FormGroup>

							<button type="submit" className="btn btn-primary">
								Add Book
							</button>
						</ModalBody>
					</form>
				</Modal>

				<Modal isOpen={this.state.descriptionModal} toggle={this.toggleDescriptionModal.bind(this)}>
					<ModalHeader toggle={this.toggleDescriptionModal.bind(this)}>{this.state.bookTitle}</ModalHeader>
					<ModalBody>
						<FormGroup>
							<FormText>{this.state.bookDescription}</FormText>
						</FormGroup>
					</ModalBody>

					<ModalFooter>
						<Button color="secondary" onClick={this.toggleDescriptionModal.bind(this)}>
							Cancel
						</Button>
					</ModalFooter>
				</Modal>

				<Table className="table">
					<thead>
						<tr>
							<th scope="col">ID</th>
							<th scope="col">Owner</th>
							<th scope="col">Book Title</th>
							<th scope="col"></th>
							<th scope="col">Type</th>
							<th scope="col">Price (in Ether)</th>
							<th scope="col"></th>
						</tr>
					</thead>
					<tbody id="bookList">
						{this.state.books.map((book, key) => {
							return (
								<tr key={key}>
									<td>{book.bookId}</td>
									<td>{book.owner}</td>
									<td>{book.bookTitle}</td>
									<td>
										<Button
											color="info"
											size="sm"
											name={book.bookTitle}
											value={book.bookDescribtion}
											onClick={event => {
												this.toggleDescriptionModal2(event.target.name, event.target.value);
											}}
										>
											Description
										</Button>
									</td>
									<td>{book.bookType}</td>
									<td>{book.bookPrice}</td>
									<td>{book.bookLocation}</td>
									<td>
										<button
											className="btn btn-primary"
											name={book.bookId}
											value={book.bookPrice}
											onClick={event => {
												this.purchaseBook(event.target.name, event.target.value);
											}}
										>
											Buy
										</button>
									</td>
								</tr>
							);
						})}
					</tbody>
				</Table>
			</div>
		);
	}
}
//TODO a simple menu to choose between Quorum and Besu
//TODO some other data about the blockchain (Current block, amounts of blocks ....etc. we can discuss this later)

export default App;
