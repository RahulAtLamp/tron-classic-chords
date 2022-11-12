// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";
import "./classicChords.sol";
// import "./ERC5006.sol";

contract Market is Ownable,ReentrancyGuard, ERC1155Holder{

    uint256 rentCounter;
    uint256 listingPrice = 0 ether;
    address addressNft;
    classicChords nft;

    using Counters for Counters.Counter;
    Counters.Counter private _itemIds;
    Counters.Counter private _itemsSold;
    Counters.Counter private _itemsDeleted;
    Counters.Counter private _itemsRent;
    Counters.Counter private _usersCount;
    Counters.Counter private _streamCount;


    struct MarketItem{
        uint itemId;
        uint256 tokenId;
        uint quantity;
        uint256 price;
        address payable creator;
        address payable seller;
        address payable owner;
        uint64 expiry;
        uint recordId;
        bool isAvailableOnRent;
        bool isAvailableOnSell; 
        bool sold;               
    }

    struct User{
      uint userId;
      string name;
      string description;  
      string profileImage;
    }

    struct Stream{
      uint stremId;
      string stramCode;
      string title;
      string description;
      bool premium;
      bool isLive;
    }

    mapping (uint256 => MarketItem) public marketItemsMapping;
    mapping (address => User) public userMapping;
    mapping (uint => address) public streamIdToUser;
    mapping (uint => Stream) public streamIdToStream;

  event MarketItemCreated (
    uint indexed itemId,
    uint256 indexed tokenId,
    uint32 quantity,
    address creator,
    address seller,
    address owner,
    uint256 price,
    uint64 expiry,
    uint recordId,
    bool isAvailableOnRent,
    bool isAvailableOnSell,                
    bool sold
  );

  event NFTSold(
    uint256 tokenId,
    address seller,
    address owner,
    uint256 price
  );

  event NFTRented(
    uint256 tokenId,
    address seller,
    address owner,
    uint256 price
  );


  event ProductListed(
    uint256 indexed itemId
  );

  event StreamCreated(
      uint indexed stremId,
      address indexed creator,
      string stramCode,
      string title,
      string description,
      bool premium
  );


    /* Returns the listing price of the contract */
    function getListingPrice() public view returns (uint256) {
        return listingPrice;
    }

    function setListingPrice(uint _listingPrice) public onlyOwner {
        listingPrice = _listingPrice;
    }
    
    /* Returns the token Contract Address of the contract */
    function getTokenContract() public view returns (address) {
        return addressNft;
    }

    function setTokenContract(address _tokenAddress) public onlyOwner {
        addressNft = _tokenAddress;
        nft = classicChords(addressNft);
    } 


    /* Places an item for sale or rent on the marketplace */
    function createMarketItem(
        uint256 _tokenId,
        uint32 _quantity,
        uint256 _price,
        bool _isAvailableOnRent,
        bool _isAvailableOnSell,
        uint64 _expiry
    ) public payable nonReentrant {
    require(_price > 0, "Price must be at least 1 wei");
    require(msg.value == listingPrice, "Price must be equal to listing price");

    _itemIds.increment();
    uint256 itemId = _itemIds.current();
    uint recordId;
    
    nft.transferFrom(msg.sender, address(this), _tokenId, _quantity);
    recordId = 0; 

    // if(_isAvailableOnSell){
    // }
    // if(_isAvailableOnRent){
    //     recordId = nft.createUserRecord(msg.sender, address(this), _tokenId, _quantity, _expiry);
    // }

    marketItemsMapping[itemId] =  MarketItem(
      itemId,
      _tokenId,
      _quantity,
      _price,
      payable(msg.sender),
      payable(msg.sender),
      payable(address(0)),
      _expiry,
      recordId,
      _isAvailableOnRent,
      _isAvailableOnSell,
      false
    );

    emit MarketItemCreated(
      itemId,
      _tokenId,
      _quantity,
      payable(msg.sender),
      payable(msg.sender),
      payable(address(0)),
      _price,
      _expiry,
      recordId,
      _isAvailableOnRent,
      _isAvailableOnSell,
      false
    );
  }


  function buyNft(uint _itemId,uint256 _tokenId, uint32 _quantity) public payable nonReentrant {
    MarketItem memory item = marketItemsMapping[_itemId];
    require(msg.value >= item.price, "Not enough balance to cover asking price");
    require(item.isAvailableOnSell, "Item is not available for Sell");
    require(item.quantity == _quantity, "Quentity must be matching");
    address payable buyer = payable(msg.sender);
    item.seller.transfer(msg.value);
    nft.transferFrom(address(this), buyer, _tokenId, _quantity);
    item.owner = buyer;
    item.sold = true;
    _itemsSold.increment();
    emit NFTSold(_tokenId, item.seller, buyer, msg.value);
  }


    function rentNft(uint _itemId,uint256 _tokenId, uint32 _quantity) public payable nonReentrant {
        MarketItem memory item = marketItemsMapping[_itemId];
        require(msg.value >= item.price, "Not enough balance to cover asking price");
        require(item.isAvailableOnRent, "Item is not available for Rent");
        require(item.quantity == _quantity, "Quentity must be matching");
        address payable buyer = payable(msg.sender);
        item.seller.transfer(msg.value);
        // nft.deleteUserRecord(item.recordId);
        uint recordId = nft.createUserRecord(address(this), msg.sender, _tokenId, _quantity, item.expiry);
        item.recordId = recordId;
        _itemsRent.increment();
        item.sold = true;
        emit NFTSold(_tokenId, item.seller, buyer, msg.value);

  }

    function revokeRent(uint256 _recordId) public {
        nft.deleteUserRecord(_recordId);
    }
    
    function balanceOf(address _userAddress, uint256 _recordId) public view returns(uint256){
        return nft.balanceOf(_userAddress, _recordId);
    }

    function frozenBalanceOf(address _userAddress, uint256 _tokenId) public view returns(uint256){
        return nft.frozenBalanceOf(_userAddress, _tokenId);
    }

    function usableBalanceOf(address _userAddress, uint256 _tokenId) public view returns(uint256){
        return nft.usableBalanceOf(_userAddress, _tokenId);
    }

    function getListedNfts() public view returns (MarketItem[] memory) {
    
    uint256 nftCount = _itemIds.current();
    uint256 unsoldNftsCount = nftCount - _itemsSold.current();

    MarketItem[] memory nfts = new MarketItem[](unsoldNftsCount);
    uint nftsIndex = 0;
    for (uint i = 0; i < nftCount; i++) {
      if (!marketItemsMapping[i + 1].sold) {
        nfts[nftsIndex] = marketItemsMapping[i + 1];
        nftsIndex++;
      }
    }
    return nfts;
  }


  function getUserNfts(address _userAddress) public view returns (MarketItem[] memory) {
    uint nftCount = _itemIds.current();
    uint myNftCount = 0;
    for (uint i = 0; i < nftCount; i++) {
      if (marketItemsMapping[i + 1].owner == _userAddress) {
        myNftCount++;
      }
    }

    MarketItem[] memory nfts = new MarketItem[](myNftCount);
    uint nftsIndex = 0;
    for (uint i = 0; i < nftCount; i++) {
      if (marketItemsMapping[i + 1].owner == _userAddress) {
        nfts[nftsIndex] = marketItemsMapping[i + 1];
        nftsIndex++;
      }
    }
    return nfts;
  }


  function getUserListedNfts(address _userAddress) public view returns (MarketItem[] memory) {
    uint nftCount = _itemIds.current();
    uint myListedNftCount = 0;
    for (uint i = 0; i < nftCount; i++) {
      if (marketItemsMapping[i + 1].seller == _userAddress && !marketItemsMapping[i + 1].sold) {
        myListedNftCount++;
      }
    }

    MarketItem[] memory nfts = new MarketItem[](myListedNftCount);
    uint nftsIndex = 0;
    for (uint i = 0; i < nftCount; i++) {
      if (marketItemsMapping[i + 1].seller == _userAddress && !marketItemsMapping[i + 1].sold) {
        nfts[nftsIndex] = marketItemsMapping[i + 1];
        nftsIndex++;
      }
    }
    return nfts;
  }


  function registerUser(string memory _name, string memory _description, string memory _profileImage) public returns(uint256) {
    _usersCount.increment();
    uint256 userId = _usersCount.current();
    userMapping[msg.sender] = User(
      userId,
      _name,
      _description,
      _profileImage
    );
    return userId;
  }

  function createStream(string memory _streamCode, bool _premium, string memory _title, string memory _description) public {
    _streamCount.increment();
    uint256 streamId = _streamCount.current();
    streamIdToStream[streamId] = Stream(
      streamId,
      _streamCode,
      _title,
      _description,
      _premium,
      true
    );
    streamIdToUser[streamId] = msg.sender;
    emit StreamCreated(
      streamId,
      msg.sender,
      _streamCode,
      _title,
      _description,
      _premium
    );
  }

  function endStream(uint _streamId) public view {
    require(streamIdToUser[_streamId] == msg.sender, "User Don't have right to end the stream !");
    Stream memory stream = streamIdToStream[_streamId];
    stream.isLive = false;
  }

  function getLiveStreams() public view returns (Stream[] memory) {
    uint streamCount = _streamCount.current();
    uint liveStreamCount = 0;
    for (uint i = 0; i < streamCount; i++) {
      if (streamIdToStream[i + 1].isLive == true) {
        liveStreamCount++;
      }
    }

    Stream[] memory streams = new Stream[](liveStreamCount);
    uint stramIndex = 0;
    for (uint i = 0; i < streamCount; i++) {
      if (streamIdToStream[i + 1].isLive == true) {
        streams[stramIndex] = streamIdToStream[i + 1];
        stramIndex++;
      }
    }
    return streams;
  }
}