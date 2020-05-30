import React, { Component } from "react";
//import SimpleStorageContract from "./contracts/SimpleStorage.json";
import LibraryContract from "./contracts/LibraryContract.json";
import getWeb3 from "./getWeb3";
//import Button from 'react-bootstrap/Button'
//import ipfs from './APIs/IPFSapi'
import 'bootstrap/dist/css/bootstrap.min.css';
//import "./App.css";
import { Input, FormGroup, Label, Modal, ModalHeader, ModalBody, ModalFooter, Table, Button, FormText } from 'reactstrap';
 
//Input Javi from Tutoriol ipfs
// const ipfsClient = require('ipfs-http-client')
// const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' }) // leaving out the arguments will default to these values


class App extends Component {
  //state = { storageValue: 0, web3: null, accounts: null, contract: null, buffer: null };
  state = { accounts: null, booksCount: null, books: [], loading: true, buffer: null, web3: null, contract: null };

  //Input Javi --> Tutorial
  // async componentWillMount() {
  //   await this.loadWeb3()
  //   await this.loadBlockchainData()
  // }

  // async loadWeb3() {
  //   if (window.ethereum) {
  //     window.web3 = new Web3(window.ethereum)
  //     await window.ethereum.enable()
  //   }
  //   else if (window.web3) {
  //     window.web3 = new Web3(window.web3.currentProvider)
  //   }
  //   else {
  //     window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
  //   }
  // }

  // async loadBlockchainData() {
  //   const web3 = window.web3
  //   // Load account
  //   const accounts = await web3.eth.getAccounts()
  //   this.setState({ account: accounts[0] })
  //   const networkId = await web3.eth.net.getId()
  //   const networkData = LibraryContrac.networks[networkId]
  // const networkData = SimpleStorage.networks[networkId] //ipfs smartcontract
  // if(networkData) {
  //   const contract = web3.eth.Contract(SimpleStorageHash.abi, networkData.address)
  //   this.setState({ contract })
  //   const simglestorageHash = await contract.methods.get().call()
  //   this.setState({ simplestorageHash }) //ipfs input from tutorial
  //   if(networkData) {
  //     const librarycontract = web3.eth.Contract(LibraryContract.abi, networkData.address)
  //     this.setState({ librarycontract })
  //     const booksCount = await librarycontract.methods.booksCount().call()
  //     this.setState({ booksCount })
  //     // Load books
  //     for (var i = 1; i <= booksCount; i++) {
  //       const book = await librarycontract.methods.books(i).call()
  //       this.setState({
  //         books: [...this.state.books, book]
  //       })
  //     }
  //     this.setState({ loading: false})
  //   } else {
  //     window.alert('Smart contract not deployed to detected network.')
  //   }
  // }

  constructor(props) {
    super(props)
/*     this.state = {
      account: '',
      booksCount: 0,
      books: [],
      loading: true,
      buffer: null,
      web3: null,
      contract: null
    } */

    //this.createBook = this.createBook.bind(this)
    // this.purchaseBook = this.purchaseBook.bind(this)
  }


  createBook(bookTitle, bookType, bookDescription, bookPrice, bookLocation) {
    this.setState({ loading: true })
    this.state.libarycontract.methods.createBook(bookTitle, bookType, bookDescription, bookPrice, bookLocation).send({ from: this.state.account })
    .once('receipt', (receipt) => {
      this.setState({ loading: false })
    })
  }

  // purchaseBook(bookID, bookPrice) {
  //   this.setState({ loading: true })
  //   this.state.librarycontract.methods.purchaseBook(id).send({ from: this.state.account, value: bookPrice })
  //   .once('receipt', (receipt) => {
  //     this.setState({ loading: false })
  //   })
  // }


  componentDidMount = async () => {

    //I already implemented a normal web3js for you to use as an example. 
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      //const deployedNetwork = SimpleStorageContract.networks[networkId];
      const deployedNetwork = LibraryContract.networks[networkId];
      const instance = new web3.eth.Contract(
        //SimpleStorageContract.abi,
        LibraryContract.abi,
        deployedNetwork && deployedNetwork.address,
      );
      
      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.runExample);
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


/*   simplestorage_render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Good to Go!</h1>
        <p>Your Truffle Box is installed and ready.</p>
        <h2>Smart Contract Example</h2>
        <p>
          If your contracts compiled and migrated successfully, below will show
          a stored value of 5 (by default).
        </p>
        <p>
          Try changing the value stored on <strong>line 40</strong> of App.js.
        </p>
        <div>The stored value is: {this.state.storageValue}</div>
      </div>
    );
  } */

  render3() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Good to Go!</h1>
        <p>Your Truffle Box is installed and ready.</p>
        <h2>Smart Contract Example</h2>
        <p>
          If your contracts compiled and migrated successfully, below will show
          a stored value of 5 (by default).
        </p>
        <p>
          Try changing the value stored on <strong>line 40</strong> of App.js.
        </p>
        <div>The stored value is: {this.state.booksCount}</div>
      </div>
    );
  }

/*   render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Good to Go!</h1>
        <p>Your Truffle Box is installed and ready.</p>
        <h2>Smart Contract Example</h2>
        <p>
          If your contracts compiled and migrated successfully, below will show
          a stored value of 5 (by default).
        </p>
        <p>
          Try changing the value stored on <strong>line 40</strong> of App.js.
        </p>
        <div>The stored value is: {this.state.storageValue}</div>
      </div>
    );
  } */


/*   runExample = async () => {
    const { accounts, contract } = this.state;

    // Stores a given value, 5 by default.
    await contract.methods.set(5).send({ from: accounts[0] });

    // Get the value from the contract to prove it worked.
    const response = await contract.methods.get().call();

    // Update state with the result.
    this.setState({ storageValue: response });
  }; */


  runExample = async () => {
    const { accounts, contract } = this.state;
/*
    // Stores a given value, 5 by default.
    await contract.methods.set(5).send({ from: accounts[0] });

     // Get the value from the contract to prove it worked.
    const response = await contract.methods.get().call();

    // Update state with the result.
    this.setState({ storageValue: response }); */

    await contract.methods.setBooksCount().send({ from: accounts[0] });

    //const response2 = await contract.methods.setBooksCount().call();
    const response = await contract.methods.getBooksCount().call();
    
    this.setState({ booksCount: response });
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
    //  let result =  ipfs(file) //what comes out here?
    }
  // onSubmit = (event) => {
  //   event.preventDefault()
  //   console.log("Submitting file to ipfs...")
  //   ipfs.add(this.state.buffer, (error,result) => {
  //     console.log('Ipfs result', reslt)
  //     if(error) {
  //       HTMLFormControlsCollection.error(error)
  //       return
  //     }
  //     this.state.contract.methods.set(result[0].hash).send({ from: this.state.account }).then((r) => {
  //       return this.setState({ simplestorageHash: result[0].hash })
  //     })
  //   })  
  // }

  toggleNewBookModal() {
    this.setState({
      newBookModal: ! this.state.newBookModal
    });
  }
  toggleBuyBookModal() {
    this.setState({
      buyBookModal: ! this.state.buyBookModal
    });
  }
  toggleDescriptionModal() {
    this.setState({
      descriptionModal: ! this.state.descriptionModal
    });
  }
  addBook() {
    // introduce createbook function
  } 
  
  buyBook(id, title, rating) {
    this.setState({
      buyBookData: { id, title, rating }, buyBookModal: ! this.state.buyBookModal
    });
  } //guess ipfs source should be added instead of http://localhost:3000/books


  //Render shows the content of the page

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App container">
        <h1>Books App</h1>    
          <Button className="my-3" color="primary" onClick={this.toggleNewBookModal.bind(this)}>Add Book</Button>
          <Modal isOpen={this.state.newBookModal} toggle={this.toggleNewBookModal.bind(this)}>
              <ModalHeader toggle={this.toggleNewBookModal.bind(this)}>Add a new book</ModalHeader>
              <ModalBody>
                <FormGroup>
                    <Label for="bookTitle">Book Title</Label>
                    <Input 
                    id="bookTitle"
                    ref={(input) => { this.bookTitle = input}}
                    required
                    />
                </FormGroup>
                <FormGroup>
                    <Label for="bookDescription">Description</Label>
                    <Input type="textarea" id="bookDescription" 
                    ref={(input) => { this.bookDescription = input}}
                    required
                    />
                </FormGroup>
                <FormGroup>
                    <Label for="bookType">Type</Label>
                    <Input 
                    type="select" 
                    id="bookType"
                    ref={(input) => { this.bookType = input}}
                    required>
                      <option disabled selected value>Please select</option>
                      <option>Technical</option>
                      <option>Manuals</option>
                      <option>OTHER</option>
                      </Input>
                </FormGroup>
                <FormGroup>
                    <Label for="price">Price (in Ether)</Label>
                    <Input 
                    id="bookPrice"
                    ref={(input) => { this.bookPrice = input}} 
                    required
                    />
                </FormGroup>
                <FormGroup onSubmit={this.onSubmit}>
                    <Label for="bookLocation">Location</Label>
                    <Input 
                    id="bookLocation"
                    type="file"
                    onChange={this.handleFileChange}//Put into IPFS 
                    required
                    />
                </FormGroup>
              </ModalBody>
              
              <ModalFooter>
                <Button color="primary" onClick={this.addBook.bind(this)}>Add Book</Button>{' '}
                <Button color="secondary" onClick={this.toggleNewBookModal.bind(this)}>Cancel</Button>
              </ModalFooter>
            </Modal>

            <Modal isOpen={this.state.buyBookModal} toggle={this.toggleBuyBookModal.bind(this)}>
              <ModalHeader toggle={this.toggleBuyBookModal.bind(this)}>Thank you for your purchase!</ModalHeader>
              <ModalBody>
                <FormGroup>
                  <Label for="location">Location</Label>
                  <FormText>
                    Here should appear the IPFS-address
                  </FormText>
                </FormGroup>
              </ModalBody>
                
              <ModalFooter>
                <Button color="primary">Download Book</Button>{' '}
                <Button color="secondary" onClick={this.toggleBuyBookModal.bind(this)} >Cancel</Button>
              </ModalFooter>
            </Modal>

            <Modal isOpen={this.state.descriptionModal} toggle={this.toggleDescriptionModal.bind(this)}>
              <ModalHeader toggle={this.toggleDescriptionModal.bind(this)}>Book Title</ModalHeader>
              <ModalBody>
                <FormGroup>
                  <FormText>The description should be fetch from the blockchain
                  </FormText>
                </FormGroup>
              </ModalBody>
                
              <ModalFooter>
                <Button color="secondary" onClick={this.toggleDescriptionModal.bind(this)}>Cancel</Button>
              </ModalFooter>
            </Modal>

      <Table>
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Book Title</th>
            <th scope="col"></th>
            <th scope="col">Type</th>
            <th scope="col">Price (in Ether)</th>
            <th scope="col"></th>
          </tr>
        </thead>

        <tbody id="booksList">
          {/* { this.props.books.map((book, key) => {
            return(
              <tr key={key}>
                <th scoope="row">{book.bookId.toString()}</th>
                <td>{book.bookTitle}</td>
                <td>{}</td>
                <td>{book.bookType}</td>
                <td>{window.web3.utils.fromWei(book.bookPrice.toString(), 'Ether')} Eth</td>
                <td><Button 
                color="success" size="sm" className="mr-2" 
                onClick={this.toggleBuyBookModal.bind(this)}
                name={book.bookId}
                onClick={(event) => {
                  this.props.purchaseBook(event.target.name, event.target.value)
                }}
                >Buy
                  </Button>
                  </td>
              </tr>
            )
          })} */}
          </tbody>
          <tbody>
          <tr>
            <td>1</td>
            <td>{this.state.booksCount} Harry Potter and the Philosopher's Stone</td>
            <td>
              <Button color="info" size="sm" onClick={this.toggleDescriptionModal.bind(this)}
              >Description</Button></td>
            <td>Fantasy</td>
            <td>0.24</td>
            <td>
              <Button color="success" size="sm" className="mr-2" onClick={this.toggleBuyBookModal.bind(this)}
              >Buy</Button>
            </td>
          </tr>
          
        </tbody>
      </Table>
    
</div>
    );
  }
}
  //TODO a simple Form to submit a book (this should call the handleFileChange function)
  //TODO: a simple table that shows the list of books we have, with buttons to buy 
  //TODO a simple menu to choose between Quorum and Besu 
  //TODO some other data about the blockchain (Current block, amounts of blocks ....etc. we can discuss this later)


export default App;
