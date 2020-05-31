pragma solidity >=0.4.21;

contract LibraryContract {
    //state var
    string public contractName;

    //use this not to point at empty mapping
    uint256 public booksCount = 0;

    //similar to linkedList
    mapping(uint256 => Book) public books;

    //enum of Book Types
    enum BookType {Technical, Manuals, OTHER}

    constructor() public {
        contractName = "Camerino Decnetralized Library";
    }

    struct Book {

        uint256 bookId;
        BookType bookType; //change this to enum
        string bookTitle;
        string bookDescribtion;
        uint256 bookPrice;
        string bookLocation; //link to IPFS
        address payable owner;

    }

    event BookCreated(
        uint256 BookId,
        BookType bookType,
        string BookTitle,
        string BookDescribtion,
        string BookLocation,
        uint256 BookPrice,
        address payable owner
    );

    event BookPurchased(
        uint256 bookId,
        BookType bookType,
        string bookTitle,
        string bookDescribtion,
        string bookLocation,
        uint256 bookPrice,
        address payable owner
    );

    function createBook(
        BookType _bookType,
        string memory _bookTitle,
        string memory _bookDescribtion,
        string memory _bookLocation,
        uint256 _bookPrice
         ) public {

        //requires valid name and price
        require(bytes(_bookTitle).length > 0, "Book Title is not valid!");
        require(_bookPrice > 0, "Book price is not valid!");

        booksCount++;

        //create the Book
        books[booksCount] = Book(booksCount,
        _bookType,
        _bookTitle,
        _bookDescribtion,
        _bookPrice,
        _bookLocation,
        msg.sender
        );

        //emit the event
        emit BookCreated(booksCount,
        _bookType,
        _bookTitle,
        _bookDescribtion,
        _bookLocation,
        _bookPrice,
        msg.sender
        );

    }


    function purchaseBook(uint256 _bookId)public payable{

        //fetch the Book
        Book memory _book = books[_bookId];

        //fetch the owner
        address payable _seller = _book.owner;

        //ensure Book has a valid id
        require(_book.bookId>0 && _book.bookId<=booksCount, "wrong Book id");

         //require that it has enough Ether
        require(msg.value>=_book.bookPrice, "not enough token (whatever we call this token later, maybe CamiToken)");


        //require that buyer is not seller
        require(_seller != msg.sender, "can't buy your own Books");

        //now we ensured all, transfer ownership and mark as Purchased
        _book.owner = msg.sender;


        //update the list
        books[_bookId] = _book;

        //pay the seller
        _seller.transfer(msg.value);

        //trigger purchase event
        emit BookPurchased(booksCount,_book.bookType,_book.bookTitle,_book.bookDescribtion,
        _book.bookLocation,_book.bookPrice,msg.sender);

    }

}
