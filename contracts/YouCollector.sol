// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/extensions/ERC1155BurnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/extensions/ERC1155SupplyUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

//TODO write events
//TODO write upgrade logic
//TODO optimize for gas
//TODO follow users and favorite videos
//TODO list top users
//TODO save video market value
/// @custom:security-contact hi@youcollector.art
contract YouCollector is Initializable, ERC1155Upgradeable, AccessControlUpgradeable, PausableUpgradeable, ERC1155BurnableUpgradeable, ERC1155SupplyUpgradeable {
    bytes32 public constant URI_SETTER_ROLE = keccak256("URI_SETTER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

    uint256 public constant DAY = 24 * 60 * 60;

    uint256 public constant VIDEO_ID_ID = 0;
    uint256 public constant COLLECTION_ID = 1;
    uint256 public constant SLOT_ID = 2;
    uint256 public constant MARKETPLACE_ITEM_ID = 2;

    uint256 public constant SORT_CREATED_ASC = 0;
    uint256 public constant SORT_CREATED_DESC = 1;
    uint256 public constant SORT_PRICE_ASC = 2;
    uint256 public constant SORT_PRICE_DESC = 3;

    address payable private creatorAddress;

    uint256 public videoIdMintingPrice = 0;
    uint256 public collectionMintingPrice = 1 * 10**18;
    uint256 public slotMintingPrice = 0.333 * 10**18;
    uint256 public marketplaceItemMintingPrice = 0;
    uint256 public videoIdTransferPlatformFeeRatio = 5; // 5% // TODO setter
    uint256 public videoIdTransferAuthorFeeRatio = 5; // 5% // TODO figure it out
    uint256 public marketplaceItemMinimumBidTime = 1 * DAY; // TODO setter
    uint256 public marketplaceItemPagination = 4 * 12;

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
        string videoId;
        address owner; // TODO prevent from bidding
        address bidder;
        uint256 price; // Direct buy price
        uint256 bid; // 0 if no bidding allowed
        uint256 bidCount;
        uint256 bidDate; // 0 if no bidder
        uint256 startDate; // 0 if direct buy
        uint256 endDate; // 0 if direct buy
    }

    mapping (address => uint256) public userToRegistrationDate;
    mapping (address => Collection[]) public ownerToCollections;
    mapping (string => address) public videoIdToOwner;
    mapping (string => address) public videoIdToAuthor;
    mapping (string => uint256) public videoIdToCollectionId;
    MarketplaceItem[] public marketplaceItemsByDate;
    MarketplaceItem[] public marketplaceItemsByPrice;
    mapping (string => MarketplaceItem) public videoIdToMarketplaceItem;

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

    function getVideoInfo(string memory videoId) public view returns (address owner, address author,  uint256 collectionId, string memory collectionName, MarketplaceItem memory marketplaceItem) {
        require(bytes(videoId).length > 0, "videoId is empty!");
        require(videoIdToOwner[videoId] != address(0x0), "videoId does not exist!");

        owner = videoIdToOwner[videoId];
        author = videoIdToAuthor[videoId];
        collectionId = videoIdToCollectionId[videoId];
        collectionName = ownerToCollections[owner][collectionId].name;
        marketplaceItem = videoIdToMarketplaceItem[videoId];
    }

    function getMarketplaceItems(uint256 skip, uint256 sort) public returns (MarketplaceItem[] memory marketplaceItems) {
        marketplaceItems = new MarketplaceItem[](marketplaceItemPagination);

        if (sort == SORT_CREATED_DESC) {
            // TODO optimize with variable
            for (uint256 i = marketplaceItemsByDate.length - skip - 1; i >= marketplaceItemsByDate.length - skip - marketplaceItemPagination - 1; i--) {
                if (marketplaceItemsByDate[i] == address(0x0)) {
                    i++;
                    continue;
                }
            }
            return marketplaceItems;
        } else if (sort == SORT_CREATED_DESC) {
            return marketplaceItems;
        } else if (sort == SORT_PRICE_ASC) {
            return marketplaceItems;
        } else if (sort == SORT_PRICE_DESC) {
            return marketplaceItems;
        } else {
            revert("Invalid sort!");
        }
    }

    /* ---
        SETTERS
    --- */

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

    function setMarketplaceItemMintingPrice(uint256 newMarketplaceItemMintingPrice) public onlyRole(DEFAULT_ADMIN_ROLE) {
        marketplaceItemMintingPrice = newMarketplaceItemMintingPrice;
    }

    function setMarketplaceItemMinimumBidTime(uint256 newMarketplaceItemMinimumBidTime) public onlyRole(DEFAULT_ADMIN_ROLE) {
        marketplaceItemMinimumBidTime = newMarketplaceItemMinimumBidTime;
    }

    function setMarketplaceItemPagination(uint256 newMarketplaceItemPagination) public onlyRole(DEFAULT_ADMIN_ROLE) {
        marketplaceItemPagination = newMarketplaceItemPagination;
    }

    /* ---
        REGISTRATION
    --- */

    function registerNewUser(string[] memory videoIds) public payable returns (uint256) {
        require(userToRegistrationDate[msg.sender] == 0, "User already registered");
        require(videoIds.length <= newCollectionSlots, "To many videoIds to mint!");

        for (uint256 i = 0; i < videoIds.length; i++) {
            require(bytes(videoIds[i]).length > 0, "videoIds contains an empty string");
        }

        uint256 collectionId = mintCollection(newCollectionName);
        int256 collectionIndex = _getCollectionIndex(ownerToCollections[msg.sender], collectionId);

        _mint(msg.sender, VIDEO_ID_ID, videoIds.length, "");

        for (uint256 i = 0; i < videoIds.length; i++) {
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

    function mintMarketplaceItem(string memory videoId, uint256 price, uint256 bid, uint256 bidEndDate) public payable {
        require(bytes(videoId).length > 0, "videoId is empty!");
        require(videoIdToOwner[videoId] == msg.sender, "User does not own this video!");
        require(price > 0, "price must be greater than 0!");
        require(bidEndDate > block.timestamp + marketplaceItemMinimumBidTime, "bidEndDate must be greater than current block timestamp + marketplaceItemMinimumBidTime!");
        require(msg.value >= marketplaceItemMintingPrice, "Not enought value was sent to mint a marketplace item!");

        _mint(msg.sender, MARKETPLACE_ITEM_ID, 1, "");

        MarketplaceItem memory marketplaceItem = MarketplaceItem(
            videoId,
            msg.sender,
            address(0x0),
            price,
            bid,
            0,
            0,
            block.timestamp,
            bidEndDate
        );

        marketplaceItemsByDate.push(marketplaceItem);
        marketplaceItemsByPrice.push(marketplaceItem);
        _sortMarketplaceItemsByPrice(marketplaceItemsByPrice); // Should use min(price, bid) and fill holes
        videoIdToMarketplaceItem[videoId] = marketplaceItem;
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

        (ownerToCollections[msg.sender][unsignedNewIndex], ownerToCollections[msg.sender][unsignedIndex]) = (ownerToCollections[msg.sender][unsignedIndex], ownerToCollections[msg.sender][unsignedNewIndex]);
    }

    /* ---
        MARKETPLACE
    --- */


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

    function _sortMarketplaceItemsByPrice(MarketplaceItem[] storage marketplaceItems) internal {
        // for i = 2:n,
        //     for (k = i; k > 1 and a[k] < a[k-1]; k--)
        //         swap a[k,k-1]
        //     → invariant: a[1..i] is sorted
        // end

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
