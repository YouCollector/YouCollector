// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/access/Ownable.sol";

struct MarketplaceItem {
    string videoId;
    address payable owner;
    address payable bidder;
    uint256 price; // Direct buy price
    uint256 bid; // 0 if no bidding allowed
    uint256 bidCount;
    uint256 endDate; // 0 if direct buy
}

library YouCollectorLibrary {

    uint256 public constant REGISTER_MAX_VIDEOS = 6;
    uint256 public constant MARKETPLACE_ITEMS_PAGINATION = 3 * 12;
    uint256 public constant MARKETPLACE_ITEMS_MIN_BID_TIME = 24 * 60 * 60;

    uint256 public constant SORT_CREATED_ASC = 0;
    uint256 public constant SORT_CREATED_DESC = 1;
    uint256 public constant SORT_PRICE_ASC = 2;
    uint256 public constant SORT_PRICE_DESC = 3;

    function getPaginatedMarketplaceItems(MarketplaceItem[] calldata marketplaceItems, uint256 skip, uint256 sort) external pure returns (MarketplaceItem[] memory paginatedMarketplaceItems) {
        paginatedMarketplaceItems = new MarketplaceItem[](min(MARKETPLACE_ITEMS_PAGINATION, marketplaceItems.length - skip));

        if (sort == SORT_CREATED_DESC) {
            for (uint256 i = 0; i < min(MARKETPLACE_ITEMS_PAGINATION, marketplaceItems.length - skip); i++) {
                paginatedMarketplaceItems[i] = marketplaceItems[marketplaceItems.length - 1 - i - skip];
            }

            return paginatedMarketplaceItems;
        }
        else if (sort == SORT_CREATED_ASC) {
            for (uint256 i = 0; i < min(MARKETPLACE_ITEMS_PAGINATION, marketplaceItems.length - skip); i++) {
                paginatedMarketplaceItems[i] = marketplaceItems[i + skip];
            }

            return paginatedMarketplaceItems;
        }
        else {
            revert();
        }
    }

    function parseVideoId(string memory videoId) external pure returns (string memory) {
        bytes memory videoIdBytes = bytes(videoId);
        bytes memory result = new bytes(11);

        result[0] = videoIdBytes[0];
        result[1] = videoIdBytes[1];
        result[2] = videoIdBytes[2];
        result[3] = videoIdBytes[3];
        result[4] = videoIdBytes[4];
        result[5] = videoIdBytes[5];
        result[6] = videoIdBytes[6];
        result[7] = videoIdBytes[7];
        result[8] = videoIdBytes[8];
        result[9] = videoIdBytes[9];
        result[10] = videoIdBytes[10];

        return string(result);
    }

    function min(uint256 a, uint256 b) internal pure returns (uint256) {
        if (a < b) {
            return a;
        }

        return b;
    }
}

/// @custom:security-contact hi@youcollector.cart
contract YouCollector is Ownable {

    uint256 public videoIdMintingPrice = 1 * 10**18;
    uint256 public videoIdTransferPlatformFee = 5; // 5%
    // uint256 public videoIdTransferAuthorFeeRatio = 5; // 5% // TODO figure it out, setter

    mapping (string => address) public videoIdToOwner;
    mapping (address => string[]) public ownerToVideoIds;
    mapping (string => MarketplaceItem) public videoIdToMarketplaceItem;
    MarketplaceItem[] public marketplaceItemsByDate;
    MarketplaceItem[] public marketplaceItemsByPrice;

    constructor() {}

    /* ---
        GETTERS
    --- */

    function getUserInfo(address userAddress) external view returns (string[] memory videoIds) {
        videoIds = ownerToVideoIds[userAddress];
    }

    function getMarketplaceItems(uint256 skip, uint256 sort) external view returns (MarketplaceItem[] memory marketplaceItems) {
        marketplaceItems = YouCollectorLibrary.getPaginatedMarketplaceItems(marketplaceItemsByDate, skip, sort);
    }

    /* ---
        SETTERS
    --- */

    function setVideoIdMintingPrice(uint256 newPrice) external onlyOwner {
        videoIdMintingPrice = newPrice;
    }

    function setVideoIdTransferPlatformFee(uint256 newVideoIdTransferPlatformFee) external onlyOwner {
        videoIdTransferPlatformFee = newVideoIdTransferPlatformFee;
    }

    /* ---
        REGISTRATION
    --- */

    function registerNewUser(string[] memory videoIds) external {
        require(ownerToVideoIds[msg.sender].length == 0);
        require(videoIds.length <= YouCollectorLibrary.REGISTER_MAX_VIDEOS);

        for (uint256 i = 0; i < videoIds.length; i++) {
            string memory parsedVideoId = YouCollectorLibrary.parseVideoId(videoIds[i]);

            require(videoIdToOwner[parsedVideoId] == address(0));

            videoIdToOwner[parsedVideoId] = msg.sender;
            ownerToVideoIds[msg.sender].push(parsedVideoId);
        }
    }

    /* ---
        MINTING
    --- */

    function mintVideoId(string memory videoId) external payable {
        string memory parsedVideoId = YouCollectorLibrary.parseVideoId(videoId);

        require(videoIdToOwner[parsedVideoId] == address(0x0));
        require(ownerToVideoIds[msg.sender].length < YouCollectorLibrary.REGISTER_MAX_VIDEOS || msg.value >= videoIdMintingPrice);

        videoIdToOwner[parsedVideoId] = msg.sender;
        ownerToVideoIds[msg.sender].push(parsedVideoId);
        payable(owner()).transfer(msg.value);
    }

    function mintMarketplaceItem(string memory videoId, uint256 price, uint256 bid, uint256 bidEndDate) external {
        require(videoIdToOwner[videoId] == msg.sender);
        require(bidEndDate > block.timestamp + YouCollectorLibrary.MARKETPLACE_ITEMS_MIN_BID_TIME);

        MarketplaceItem memory marketplaceItem = MarketplaceItem(
            videoId,
            payable(msg.sender),
            payable(address(0x0)),
            price,
            bid,
            0,
            bidEndDate
        );

        marketplaceItemsByDate.push(marketplaceItem);
        marketplaceItemsByPrice.push(marketplaceItem);
        videoIdToMarketplaceItem[videoId] = marketplaceItem;
    }

    /* ---
        MARKETPLACE
    --- */

    function bidOnVideoId(string memory videoId) external payable {
        MarketplaceItem storage marketplaceItem = videoIdToMarketplaceItem[videoId];

        require(marketplaceItem.owner != msg.sender);
        require(marketplaceItem.endDate > block.timestamp);
        require(marketplaceItem.bid < msg.value);

        marketplaceItem.bidder.transfer(marketplaceItem.bid); // Refund previous bidder
        marketplaceItem.bid = msg.value;
        marketplaceItem.bidder = payable(msg.sender);
    }

    function claimVideoId(string memory videoId) external {
        MarketplaceItem storage marketplaceItem = videoIdToMarketplaceItem[videoId];

        require(marketplaceItem.bidder == msg.sender);
        require(marketplaceItem.endDate < block.timestamp);

        uint256 platformFee = marketplaceItem.bid * videoIdTransferPlatformFee / 100;

        payable(owner()).transfer(platformFee);
        marketplaceItem.owner.transfer(marketplaceItem.bid - platformFee);
        videoIdToOwner[videoId] = msg.sender;
        ownerToVideoIds[msg.sender].push(videoId);

        // Remove from onwer's videos
        bytes32 videoIdHash = keccak256(bytes(videoId));

        for (uint256 i = 0; i < ownerToVideoIds[marketplaceItem.owner].length; i++) {
            if (keccak256(bytes(ownerToVideoIds[marketplaceItem.owner][i])) == videoIdHash) {
                delete ownerToVideoIds[marketplaceItem.owner][i];
                break;
            }
        }
    }

}
