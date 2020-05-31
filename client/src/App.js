import React, { Component } from "react";
import Web3 from "web3";
//import SimpleStorageContract from "./contracts/SimpleStorage.json";
import LibraryContract from "./contracts/LibraryContract.json";
import getWeb3 from "./getWeb3";
//import Button from 'react-bootstrap/Button'
//import ipfs from './APIs/IPFSapi'
import 'bootstrap/dist/css/bootstrap.min.css';
//import "./App.css";
import { Input, FormGroup, Form, Label, Modal, ModalHeader, ModalBody, ModalFooter, Table, Button, FormText } from 'reactstrap';

//Input Javi from Tutoriol ipfs
// const ipfsClient = require('ipfs-http-client')
// const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' }) // leaving out the arguments will default to these values


class App extends Component {
  state = { accounts: null, booksCount: null, books: [], loading: true, buffer: null, web3: null, contract: null, value: null, bookTitle: null };

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

    this.createBook = this.createBook.bind(this)
    this.purchaseBook = this.purchaseBook.bind(this)
  }


  createBook(bookType, bookTitle, bookDescription, bookLocation, bookPrice) {
    //this.setState({ loading: true })
    //console.log(this.state.accounts)
    this.state.contract.methods.createBook(bookType, bookTitle, bookDescription, bookLocation, bookPrice).send({ from: this.state.accounts[0] })
    /*     .once('receipt', (receipt) => {
          this.setState({ loading: false })
        }) */
  }
  
  purchaseBook(bookId, bookPrice) {
    //   this.setState({ loading: true })
    this.state.contract.methods.purchaseBook(bookId).send({ from: this.state.accounts[0], value: bookPrice })
    //   .once('receipt', (receipt) => {
    //     this.setState({ loading: false })
    //   })
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

  runExample = async () => {
    /*
        // Stores a given value, 5 by default.
        await contract.methods.set(5).send({ from: accounts[0] });
    
         // Get the value from the contract to prove it worked.
        const response = await contract.methods.get().call();
    
        // Update state with the result.
        this.setState({ storageValue: response }); */

    //await contract.methods.setBooksCount().send({ from: accounts[0] });

    //const response2 = await contract.methods.setBooksCount().call();

    const response = await this.state.contract.methods.getBooksCount().call();

    for (var i = 1; i <= response; i++) {
      const book = await this.state.contract.methods.books(i).call()
      this.setState({
        books: [...this.state.books, book]
      })
    }

    console.log(this.state.books[1])

    this.setState({ booksCount: response });
  };

  //Function to receive a file (pdf) from a user that we upload to IPFS

  handleFileChange = async (event) => {
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

  /*   toggleNewBookModal() {
      this.setState({
        newBookModal: !this.state.newBookModal
      });
    }
    toggleBuyBookModal() {
      this.setState({
        buyBookModal: !this.state.buyBookModal
      });
    }
    toggleDescriptionModal() {
      this.setState({
        descriptionModal: !this.state.descriptionModal
      });
    }
  
    addBook(e) {
  
      alert('The value is: ' + this.bookTitle.value);
      /*    alert('The value is: ' + this.bookDescription.value);
          alert('The value is: ' + this.bookType.value);
          alert('The value is: ' + this.bookPrice.value); */

  //   this.createBookBlockchain();
  //    this.state.instance.method.createBook(this.bookType.value, this.bookTitle.value, this.bookDescription.value, "123", this.bookPrice.value).send({ from: this.accounts[0] });


  /*  }
  
     buyBook(id, title, rating) {
      this.setState({
        buyBookData: { id, title, rating }, buyBookModal: !this.state.buyBookModal
      });
    } */ //guess ipfs source should be added instead of http://localhost:3000/books


  //Render shows the content of the page

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App container">
        <h1>Books App</h1>

        <table className="table">
          <tbody id="bookList">
            {this.state.books.map((book, key) => {
              return (
                <tr key={key}>
                  <td>
                    {book.bookType}
                  </td>
                  <td>
                    {book.bookTitle}
                  </td>
                  <td>
                    {book.bookDescription}
                  </td>
                  <td>
                    {book.bookLocation}
                  </td>
                  <td>
                    {book.bookPrice}
                  </td>
                  <td>
                    <button className="btn btn-primary"
                      name={book.bookId}
                      value={book.bookPrice}
                      onClick={(event) => {
                        this.purchaseBook(event.target.name, event.target.value)
                      }
                      }
                    >Buy</button>
                  </td>
                </tr>

              )
            })}
          </tbody>
        </table>

        <form onSubmit={(event) => {
          event.preventDefault()
          const type = this.bookType.value
          const title = this.bookTitle.value
          const description = this.bookDescription.value
          const location = this.bookLocation.value
          const price = this.bookPrice.value
          this.createBook(type, title, description, location, price)
        }}><div>
            <input
              id="bookType"
              type="text"
              ref={(input) => { this.bookType = input }}
              className="form-control"
              placeholder="Book Type"
              required />
          </div>
          <div>
            <input
              id="bookTitle"
              type="text"
              ref={(input) => { this.bookTitle = input }}
              className="form-control"
              placeholder="Book Title"
              required />
          </div>
          <div>
            <input
              id="bookDescription"
              type="text"
              ref={(input) => { this.bookDescription = input }}
              className="form-control"
              placeholder="Book Description"
              required />
          </div>
          <div>
            <input
              id="bookLocation"
              type="text"
              ref={(input) => { this.bookLocation = input }}
              className="form-control"
              placeholder="Book Location"
              required />
          </div>
          <div>
            <input
              id="bookPrice"
              type="text"
              ref={(input) => { this.bookPrice = input }}
              className="form-control"
              placeholder="Book Price"
              required />
          </div>
          <button type="submit" className="btn btn-primary">Add Book</button>
        </form>
      </div>
    );
  }
}
//TODO a simple Form to submit a book (this should call the handleFileChange function)
//TODO: a simple table that shows the list of books we have, with buttons to buy 
//TODO a simple menu to choose between Quorum and Besu 
//TODO some other data about the blockchain (Current block, amounts of blocks ....etc. we can discuss this later)


export default App;
