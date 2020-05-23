import React, { Component } from 'react';
import axios from 'axios';
import { Input, FormGroup, Label, Modal, ModalHeader, ModalBody, ModalFooter, Table, Button, FormText } from 'reactstrap';


class App extends Component {
  state = {
    books: [],
    newBookData: {
      title: '',
      type: '',
      description: '',
      price: '',
      location: ''
    },
    buyBookData: {
      id: '',
      rating: ''
    }, // not sure what data is required for buying
    newBookModal: false,
    buyBookModal: false,
    descriptionModal: false
  }
  componentWillMount() {
    this._refreshBooks();
  }
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
    axios.post('http://localhost:3000/books'. this.state.newBookData).then((response) => {
      let { books } = this.state;
      books.push(response.data);
      this.setState({ books, newBookModal: false, newBookData: {
        title: '',
        type: '',
        description: '',
        price: '',
        location: ''
      }});
    });
  } //guess ipfs source should be added instead of http://localhost:3000/books
  updateBook() {
    let  { title, rating } = this.state.buyBookData;
    axios.put('http://localhost:3000/books/' + this.state.buyBookData.id, {
      title, rating
    }).then((response) => {
      this._refreshBooks() ;
      this.setState({
        buyBookModal: false, buyBookData: { id: '', title: '', rating: ''}
      })
    });
  } // think not really required
  buyBook(id, title, rating) {
    this.setState({
      buyBookData: { id, title, rating }, buyBookModal: ! this.state.buyBookModal
    });
  } //guess ipfs source should be added instead of http://localhost:3000/books
  _refreshBooks() {
    axios.get('http://localhost:3000/books').then((response) => {
      this.setState({
        books: response.data
    })
  });
}

  render() {
    let books = this.state.books.map((book) => {
      return(
        <tr key={book.id}>
            <td>{book.id}</td>
            <td>{book.title}</td>
            <td>
              <Button color="info" size="sm" onClick={this.toggleDescriptionModal.bind(this)}
              >Description</Button></td>
            <td>{book.price}</td>
            <td>
              <Button color="success" size="sm" className="mr-2" onClick={this.toggleBuyBookModal.bind(this)}
              >Buy</Button>
            </td>
          </tr>
      )
    });
    return (
    <div className="App container">
    <h1>Books App</h1>    

    <Button className="my-3" color="primary" onClick={this.toggleNewBookModal.bind(this)}>Add Book</Button>
      <Modal isOpen={this.state.newBookModal} toggle={this.toggleNewBookModal.bind(this)}>
        <ModalHeader toggle={this.toggleNewBookModal.bind(this)}>Add a new book</ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label for="title">Book Title</Label>
            <Input id="title" value={this.state.newBookData.title} onChange={(e) => {
              let { newBookData } = this.state;
              newBookData.title = e.target.value;  
              this.setState({ newBookData })
           }}/>
          </FormGroup>
          <FormGroup>
            <Label for="description">Description</Label>
            <Input type="textarea" id="description" value={this.state.newBookData.description} onChange={(e) => {
              let { newBookData } = this.state;
              newBookData.description = e.target.value;  
              this.setState({ newBookData })
           }}/>
          </FormGroup>
          <FormGroup>
            <Label for="type">Type</Label>
            <Input id="type" value={this.state.newBookData.type} onChange={(e) => {
              let { newBookData } = this.state;
              newBookData.type = e.target.value;  
              this.setState({ newBookData })
           }}/>
          </FormGroup>
          <FormGroup>
            <Label for="price">Price (in Ether)</Label>
            <Input id="price" value={this.state.newBookData.price} onChange={(e) => {
              let { newBookData } = this.state;
              newBookData.price = e.target.value;  
              this.setState({ newBookData })
           }}/>
          </FormGroup>
          <FormGroup>
            <Label for="location">Location</Label>
            <Input id="location" value={this.state.newBookData.title} onChange={(e) => {
              let { newBookData } = this.state;
              newBookData.title = e.target.value;  
              this.setState({ newBookData })
           }}/>
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
              www.harrypoterlink.com
            </FormText>
          </FormGroup>
        </ModalBody>
          
        <ModalFooter>
          <Button color="primary" onClick={this.updateBook.bind(this)}>Download Book</Button>{' '}
          <Button color="secondary" onClick={this.toggleBuyBookModal.bind(this)} >Cancel</Button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={this.state.descriptionModal} toggle={this.toggleDescriptionModal.bind(this)}>
        <ModalHeader toggle={this.toggleDescriptionModal.bind(this)}>The Soul of a New Machine</ModalHeader>
        <ModalBody>
          <FormGroup>
            <FormText>Tracy Kidder’s The Soul of a New Machine is one of the few must-read histories about the world of Computer Science. First published in 1981, Kidder’s classic remains one of the most highly regarded books about computers to ever hit the shelves. The Soul of a New Machine carefully recounts the drama, comedy, and excitement of the early years of computers, at the time when there was but one company making the effort to bring a new microcomputer to the mass market. Computer Science majors will also appreciate the go-for-broke approach to business that is only briefly referenced here, but has become an approach that so many high-tech companies still maintain.
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
            <th>ID</th>
            <th>Book Title</th>
            <th></th>
            <th>Type</th>
            <th>Price (in Ether)</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {books}
          <tr>
            <td>1</td>
            <td>Harry Potter and the Philosopher's Stone</td>
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
          <tr>
            <td>2</td>
            <td>The History of the Ancient World</td>
            <td>
              <Button color="info" size="sm" onClick={this.toggleDescriptionModal.bind(this)}
              >Description</Button></td>
            <td>History</td>
            <td>0.36</td>
            <td>
              <Button color="success" size="sm" className="mr-2" onClick={this.toggleBuyBookModal.bind(this)}
              >Buy</Button>
            </td>
          </tr>
          <tr>
            <td>3</td>
            <td>The Soul of a New Machine</td>
            <td>
              <Button color="info" size="sm" onClick={this.toggleDescriptionModal.bind(this)}
              >Description</Button></td>
            <td>Computer Science</td>
            <td>0.49</td>
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

export default App;

//Source import: Replacing the http://localhost:3000/books with the IPFS source
//Row 196 to 234 are only to show some conent but can be deleted as soon the app is connected to our datasource
//the function ...buyBook... must be coded properly. I did not how it would work
//the function "updatebook" i guess can be deleted
