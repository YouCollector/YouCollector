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

    uint256 public constant MARKETPLACE_ITEMS_PAGINATION = 4 * 12;
    uint256 public constant MARKETPLACE_ITEMS_MIN_BID_TIME = 24 * 60 * 60;

    uint256 public constant SORT_CREATED_ASC = 0;
    uint256 public constant SORT_CREATED_DESC = 1;
    uint256 public constant SORT_PRICE_ASC = 2;
    uint256 public constant SORT_PRICE_DESC = 3;

    function getMarketplaceItem(MarketplaceItem[] calldata marketplaceItems, uint256 skip, uint256 sort) external view returns (MarketplaceItem[] memory paginatedMarketplaceItems) {
        paginatedMarketplaceItems = new MarketplaceItem[](MARKETPLACE_ITEMS_PAGINATION);

        uint256 passCount = 0;

        if (sort == SORT_CREATED_DESC) {
            // TODO optimize with variable
            for (uint256 i = marketplaceItems.length - skip - 1; i >= marketplaceItems.length - skip - MARKETPLACE_ITEMS_PAGINATION - passCount - 1; i--) {
                if (marketplaceItems[i].endDate > block.timestamp) {
                    passCount++;

                    continue;
                }

                paginatedMarketplaceItems[MARKETPLACE_ITEMS_PAGINATION - i + passCount] = marketplaceItems[i];
            }

            return marketplaceItems;
        }
        else if (sort == SORT_CREATED_DESC) {
            for (uint256 i = skip; i < MARKETPLACE_ITEMS_PAGINATION + passCount; i++) {
                if (marketplaceItems[i].endDate > block.timestamp) {
                    passCount++;

                    continue;
                }

                paginatedMarketplaceItems[i - passCount] = marketplaceItems[i];
            }

            return marketplaceItems;
        }
        else {
            revert();
        }
    }
}

/// @custom:security-contact hi@youcollector.cart
contract YouCollector2 is Ownable {

    uint256 public videoIdMintingPrice = 1 * 10**18;
    uint256 public videoIdTransferPlatformFee = 5; // 5%
    // uint256 public videoIdTransferAuthorFeeRatio = 5; // 5% // TODO figure it out, setter

    mapping (string => address) public videoIdToOwner;
    mapping (address => string[]) public ownerToVideoIds;
    mapping (string => MarketplaceItem) public videoIdToMarketplaceItem;
    MarketplaceItem[] public marketplaceItemsByDate;
    MarketplaceItem[] public marketplaceItemsByPrice;

    constructor() {

    }

    /* ---
        GETTERS
    --- */

    function getVideoIdInfo(string memory videoId) external view returns (address owner, MarketplaceItem memory marketplaceItem) {
        owner = videoIdToOwner[videoId];
        marketplaceItem = videoIdToMarketplaceItem[videoId];
    }

    function getUserInfo(address userAddress) external view returns (string[] memory videoIds) {
        videoIds = ownerToVideoIds[userAddress];
    }

    function getMarketplaceItems(uint256 skip, uint256 sort) external view returns (MarketplaceItem[] memory marketplaceItems) {
        // return YouCl
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

        for (uint256 i = 0; i < videoIds.length; i++) {
            require(videoIdToOwner[videoIds[i]] == address(0));

            videoIdToOwner[videoIds[i]] = msg.sender;
        }

        ownerToVideoIds[msg.sender] = videoIds;
    }

    /* ---
        MINTING
    --- */

    function mintVideoId(string memory videoId) external payable {
        require(videoIdToOwner[videoId] == address(0x0));
        require(msg.value >= videoIdMintingPrice);

        videoIdToOwner[videoId] = msg.sender;
        ownerToVideoIds[msg.sender].push(videoId);
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
