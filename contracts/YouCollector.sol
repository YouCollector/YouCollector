// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/extensions/ERC1155BurnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/extensions/ERC1155SupplyUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

/// @custom:security-contact hi@youcollector.art
contract YouCollector is Initializable, ERC1155Upgradeable, AccessControlUpgradeable, PausableUpgradeable, ERC1155BurnableUpgradeable, ERC1155SupplyUpgradeable {
    bytes32 public constant URI_SETTER_ROLE = keccak256("URI_SETTER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

    uint public constant DAY = 24 * 60 * 60;

    uint256 public constant VIDEO_ID_ID = 0;
    uint256 public constant COLLECTION_ID = 1;
    uint256 public constant SLOT_ID = 2;
    uint256 public constant MARKETPLACE_ITEM_ID = 2;

    address payable private creatorAddress;

    uint256 public videoIdMintingPrice = 0;
    uint256 public collectionMintingPrice = 1 * 10**18;
    uint256 public slotMintingPrice = 0.333 * 10**18;
    uint256 public marketplaceItemMintingPrice = 0;
    uint public videoIdTransferPlatformFeeRatio = 5; // 5% // TODO setter
    uint public videoIdTransferAuthorFeeRatio = 5; // 5% // TODO figure it out
    uint public marketplaceItemMinimumBidTime = 1 * DAY; // TODO setter

    struct Collection {
        uint256 id;
        string name;
        uint256 slots;
        string[] videoIds;
    }
    uint256 private _currentCollectionId = 0; // id generator
    uint256 public newCollectionSlots = 8;
    string public newCollectionName = "My Collection";

    struct MarketplaceItem {
        uint256 id;
        address owner; // TODO prevent from bidding
        string videoId;
        uint256 price; // Direct buy price
        uint256 bid; // 0 if no bidding allowed
        address bidder;
        int bidCount;
        uint bidDate; // 0 if no bidder
        uint endDate; // 0 if direct buy
    }
    uint256 private _currentMarketplaceItemId = 0; // id generator

    mapping (address => uint) public userToRegistrationDate;
    mapping (address => Collection[]) public ownerToCollections;
    mapping (string => address) public videoIdToOwner;
    mapping (string => address) public videoIdToAuthor;
    mapping (string => uint256) public videoIdToCollectionId;
    uint256[] public marketplaceItemIds;
    mapping (string => MarketplaceItem) public videoIdToMarketplaceItem;
    mapping (uint256 => MarketplaceItem) public marketplaceItemsIdToMarketplaceItem;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() initializer {}

    function initialize() initializer public {
        __ERC1155_init("https://youcollector.art/metadatas/{id}.json");
        __AccessControl_init();
        __Pausable_init();
        __ERC1155Burnable_init();
        __ERC1155Supply_init();

        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(URI_SETTER_ROLE, msg.sender);
        _grantRole(PAUSER_ROLE, msg.sender);

        creatorAddress = payable(msg.sender);
    }

    /* ---
        GETTERS
    --- */

    function getVideoInfo(string memory videoId) public view returns (address owner, address author,  uint256 collectionId, string memory collectionName, MarketplaceItem marketplaceItem) {
        require(bytes(videoId).length > 0, "videoId is empty!");
        require(videoIdToOwner[videoId] != 0, "videoId does not exist!");

        owner = videoIdToOwner[videoId];
        author = videoIdToAuthor[videoId];
        collectionId = videoIdToCollectionId[videoId];
        collectionName = ownerToCollections[owner][collectionId].name;
        marketplaceItem = videoIdToMarketplaceItem[videoId];
    }

    /* ---
        REGISTRATION
    --- */

    function registerNewUser(string[] memory videoIds) public payable returns (uint256) {
        require(userToRegistrationDate[msg.sender] == 0, "User already registered");
        require(videoIds.length <= newCollectionSlots, "To many videoIds to mint!");

        for (uint i = 0; i < videoIds.length; i++) {
            require(bytes(videoIds[i]).length > 0, "videoIds contains an empty string");
        }

        uint256 collectionId = mintCollection(newCollectionName);
        int256 collectionIndex = _getCollectionIndex(ownerToCollections[msg.sender], collectionId);

        _mint(msg.sender, VIDEO_ID_ID, videoIds.length, "");

        for (uint i = 0; i < videoIds.length; i++) {
            videoIdToCollectionId[videoIds[i]] = collectionId;
        }

        ownerToCollections[msg.sender][uint256(collectionIndex)].videoIds = videoIds;
        userToRegistrationDate[msg.sender] = block.timestamp;
        creatorAddress.transfer(msg.value);

        return collectionId;
    }

    /* ---
        MINTING
    --- */

    function mintCollection(string memory collectionName) public payable returns (uint256) {
        require(bytes(collectionName).length > 0, "collectionName is empty");
        require(ownerToCollections[msg.sender].length == 0 || msg.value >= collectionMintingPrice, "Not enought value was sent to mint a collection!");

        uint256[] memory ids = new uint256[](2);
        ids[0] = COLLECTION_ID;
        ids[1] = SLOT_ID;

        uint256[] memory amounts = new uint256[](2);
        amounts[0] = 1;
        amounts[1] = newCollectionSlots;

        _mintBatch(msg.sender, ids, amounts, "");

        _currentCollectionId++;
        ownerToCollections[msg.sender].push(Collection(_currentCollectionId, collectionName, newCollectionSlots, new string[](0)));
        creatorAddress.transfer(msg.value);

        return _currentCollectionId;
    }

    function mintCollectionSlots(uint256 collectionId, uint256 slotAmount) public payable returns (uint256) {
        require(collectionId <= _currentCollectionId, "collectionId is not valid!");
        require(slotAmount > 0, "slotAmount must be greater than 0!");

        int256 collectionIndex = _getCollectionIndex(ownerToCollections[msg.sender], collectionId);

        require(collectionIndex >= 0, "User does not own this collection!");
        require(msg.value >= slotMintingPrice, "Not enought value was sent to mint a slot!");

        _mint(msg.sender, SLOT_ID, slotAmount, "");

        uint256 newSlotAmount = ownerToCollections[msg.sender][uint256(collectionIndex)].slots += slotAmount;

        creatorAddress.transfer(msg.value);

        return newSlotAmount;
    }

    function mintVideoId(string memory videoId, uint256 collectionId) public payable {
        require(bytes(videoId).length > 0, "videoId is empty!");
        require(collectionId <= _currentCollectionId, "collectionId is not valid!");
        require(videoIdToOwner[videoId] != address(0x0), "Video already minted!");

        int256 collectionIndex = _getCollectionIndex(ownerToCollections[msg.sender], collectionId);

        require(collectionIndex >= 0, "User does not own this collection!");

        Collection storage collection = ownerToCollections[msg.sender][uint256(collectionIndex)];

        require(collection.slots > collection.videoIds.length, "No more slots available in this collection!");
        require(msg.value >= videoIdMintingPrice, "Not enought value was sent to mint a video!");

        _mint(msg.sender, VIDEO_ID_ID, 1, "");

        videoIdToOwner[videoId] = msg.sender;
        collection.videoIds.push(videoId);
        creatorAddress.transfer(msg.value);
    }

    function mintMarketplaceItem(string memory videoId, uint256 price, uint256 bid, uint bidEndDate) public payable {
        require(bytes(videoId).length > 0, "videoId is empty!");
        require(videoIdToOwner[videoId] == msg.sender, "User does not own this video!");
        require(price > 0, "price must be greater than 0!");
        require(bidEndDate > block.timestamp, "bidEndDate must be greater than current block timestamp!");


        creatorAddress.transfer(msg.value);
    }

    /* ---
        COLLECTIONS
    --- */

    function renameCollection(uint256 collectionId, string memory newName) public {
        require(collectionId <= _currentCollectionId, "collectionId is not valid!");
        require(bytes(newName).length > 0, "newName is empty!");

        int256 collectionIndex = _getCollectionIndex(ownerToCollections[msg.sender], collectionId);

        require(collectionIndex >= 0, "User does not own this collection!");

        ownerToCollections[msg.sender][uint256(collectionIndex)].name = newName;
    }

    function moveCollection(uint256 collectionId, int256 indexDelta) public {
        require(collectionId <= _currentCollectionId, "collectionId is not valid!");
        require(indexDelta != 0, "indexDelta is 0!");

        int256 collectionIndex = _getCollectionIndex(ownerToCollections[msg.sender], collectionId);

        require(collectionIndex >= 0, "User does not own this collection!");

        int256 newIndex = collectionIndex + indexDelta;

        require(newIndex >= 0, "New index is out of bounds!");

        uint256 unsignedNewIndex = uint256(newIndex);
        uint256 unsignedIndex = uint256(collectionIndex);

        require(unsignedNewIndex < ownerToCollections[msg.sender].length, "New index is out of bounds!");

        Collection memory swapCollection = ownerToCollections[msg.sender][unsignedNewIndex];
        ownerToCollections[msg.sender][unsignedNewIndex] = ownerToCollections[msg.sender][unsignedIndex];
        ownerToCollections[msg.sender][unsignedIndex] = swapCollection;
    }

    /* ---
        MARKETPLACE
    --- */

    function getMarketplaceItems(uint sort, uint skip) public returns (MarketplaceItem[] memory) {

    }

    function sellVideoId(string memory videoId, uint256 price, uint256 bid, uint bidEndDate) public {
        require(bytes(videoId).length > 0, "videoId is empty!");
        require(videoIdToOwner[videoId] == msg.sender, "User does not own this video!");

        if (videoIdToMarketplaceItem[videoId] == 0) {
            _mint(msg.sender, MARKETPLACE_ITEM_ID, 1, "");

            MarketplaceItem memory marketplaceItem = MarketplaceItem();
            videoIdToMarketplaceItem[videoId] = ;
        }
    }

    /* ---
        DONATION
    --- */

    function donate() public payable returns (string memory){
        creatorAddress.transfer(msg.value);

        return "Thank you for your donation!";
    }

    /* ---
        ADMIN METHODS
    --- */

    function setURI(string memory newuri) public onlyRole(URI_SETTER_ROLE) {
        _setURI(newuri);
    }

    function pause() public onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause() public onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    function setVideoIdMintingPrice(uint256 newPrice) public onlyRole(DEFAULT_ADMIN_ROLE) {
        videoIdMintingPrice = newPrice;
    }

    function setCollectionMintingPrice(uint256 newPrice) public onlyRole(DEFAULT_ADMIN_ROLE) {
        collectionMintingPrice = newPrice;
    }

    function setSlotMintingPrice(uint256 newPrice) public onlyRole(DEFAULT_ADMIN_ROLE) {
        slotMintingPrice = newPrice;
    }

    function setNewCollectionSlots(uint256 newSlots) public onlyRole(DEFAULT_ADMIN_ROLE) {
        newCollectionSlots = newSlots;
    }

    /* ---
        HELPERS
    --- */

    function _getCollectionIndex(Collection[] memory collections, uint256 collectionId) internal pure returns (int256) {
        for (uint256 i = 0; i < collections.length; i++) {
            if (collections[i].id == collectionId) {
                return int256(i);
            }
        }

        return -1;
    }

    /* ---
        INTERNALS
    --- */

    function _beforeTokenTransfer(address operator, address from, address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data)
        internal
        whenNotPaused
        override(ERC1155Upgradeable, ERC1155SupplyUpgradeable)
    {
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }

    // The following functions are overrides required by Solidity.

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC1155Upgradeable, AccessControlUpgradeable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
