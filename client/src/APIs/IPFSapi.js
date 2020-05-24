/*
    API to IPFS service. 
    use this api to upload books to IPFS or to get book from IPFS

    When you upload a book or whatever to IPFS, the file will be available at ipfs.infura.io/ipfs/TheHashofTheBook
    e.g. ipfs.infura.io/ipfs/QmVpeceu7JCWLBskJgudkdQ8XnM2ExMZRorsv6sQchACjW

*/

const ipfsClient = require('ipfs-http-client');

const ipfs = ipfsClient({
	host: 'ipfs.infura.io',
	port: 5001,
	protocol: 'https',
});

//to use this funtion, pass a file (event) as an argument: e.g. const file = event.target.files[0]
const uploadToIPFS = async (fileToUpload) => {
	console.log('loading ..');

	var promise = new Promise((resolve, reject) => {
		ipfs.add(fileToUpload, (err, res) => {
			resolve(res); //Result should be a hash e.g. QmVpeceu7JCWLBskJgudkdQ8XnM2ExMZRorsv6sQchACjW

			if (err) {
				console.error(err);
				return;
			}
		});
	});

	promise.then((res) => {
		let bookLocation = res[0].path;
		return bookLocation;
	});
};

module.exports = uploadToIPFS;
