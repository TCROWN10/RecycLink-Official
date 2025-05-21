// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

struct User {
        uint id;
        address userAddr;
        string name;
        uint timeJoined;
        Role role;
        uint xpoints;
        uint xrate;
    }
enum Role {
        USERS,
        ADMINS,
        VERIFIERS
    }

interface USDToken {
    
    event Transfer(address indexed from, address indexed to, uint256 value);

    
    event Approval(address indexed owner, address indexed spender, uint256 value);


    function totalSupply() external view returns (uint256);

    
    function balanceOf(address account) external view returns (uint256);

   
    function transfer(address to, uint256 value) external returns (bool);

    
    function allowance(address owner, address spender) external view returns (uint256);

    
    function approve(address spender, uint256 value) external returns (bool);

    
    function transferFrom(address from, address to, uint256 value) external returns (bool);
}

interface CarbonWise {
    function getAdmins() external view returns (User[] memory);
    function ccListingCreatedStatsFunc() external;
    function ccListingPurchasedStatsFunc(uint purschasedNum) external;
}

interface Credit {
    function mint(
        address userAccount,
        uint256 amountToMint
    ) external;
    function burn(
        address userAccount,
        uint256 amountToBurn
    ) external;
}

contract CcMarketPlace {
    /// @dev Structure to represent information about an item listing.
    struct ItemInfo {
        string description;
        uint256 price;
        address lister;
        uint256 itemId;
        bool available;
    }

    struct Transaction {
        uint date;
        uint amountOfTokensTransfered;
        string itemName;
        uint itemPrice;
        uint itemId;
        uint qty;
    }

    /// @dev Mapping to store item information by their unique listing ID.
    mapping(uint256 => ItemInfo) public itemInfoToId;

    mapping(address => Transaction[]) transactions;

    /// @dev The ID to assign to the next listing.
    uint256 public listingId;

    /* ERRORS */

    error MinPriceTooLow();
    error DeadlineTooSoon();
    error MinDurationNotMet();
    error InvalidSignature();
    error ListingDoesNotExist();
    error ListingNotActive();
    error PriceNotMet(int256 difference);
    error ListingExpired();
    error PriceMismatch(uint256 originalPrice);
    error NoImageUrl();
    error NotAdmin();
    error NotEnoughToken();

    /* EVENTS */
    event ListingCreated(
        string _description,
        uint indexed _price);

    event ListingEdited(string _description, uint listingId, uint _newPrice);

    event ListingBought(
        uint listingId,
        uint indexed _price);

    Transaction[] transaction;

    USDToken public carbonwisetoken;
    CarbonWise public carbonwise;
    Credit public carbonwiseCredit;

    modifier onlyAdmins() {
        bool isAdmin;
        for (uint i = 0; i < carbonwise.getAdmins().length; i++) {
            if (carbonwise.getAdmins()[i].userAddr == msg.sender) {
                isAdmin = true;
            }
        }
        require(isAdmin, "Not Admin");
        _;
    }

    constructor(address tokenAddress, address creditAddress, address carbonWiseAddr) {
        carbonwisetoken = USDToken(tokenAddress);
        carbonwiseCredit = Credit(creditAddress);
        carbonwise = CarbonWise(carbonWiseAddr);
    }

    function createListing(
        string calldata _description,
        uint _price
    ) public onlyAdmins {
        // Append item information to storage.
        // append to Storage
        listingId++;
        ItemInfo storage newItemInfo = itemInfoToId[listingId];
        newItemInfo.description = _description;
        newItemInfo.price = _price;
        newItemInfo.lister = msg.sender;
        newItemInfo.itemId = listingId;
        newItemInfo.available = true;

        carbonwise.ccListingCreatedStatsFunc();
        emit ListingCreated(_description, _price);
    }

    /// @dev Buy an item from the marketplace.
    /// @param _listingId The unique identifier of the item listing to buy.
    function buyListing(uint256 _listingId) public {
        ItemInfo memory newItemInfo = itemInfoToId[_listingId];
        if (newItemInfo.itemId != _listingId) revert ListingDoesNotExist();
        if (carbonwisetoken.balanceOf(msg.sender) < newItemInfo.price)
            revert NotEnoughToken();

        // transfer tokens from buyer to seller
        carbonwisetoken.transferFrom(msg.sender, address(carbonwise), newItemInfo.price * 10 ** 18);
        carbonwiseCredit.mint(msg.sender, newItemInfo.price * 10 ** 18);
        itemInfoToId[_listingId].available = false;

        Transaction memory _transaction;
        _transaction.date = block.timestamp;
        _transaction.amountOfTokensTransfered = newItemInfo.price;
        _transaction.itemId = newItemInfo.itemId;
        _transaction.itemName = newItemInfo.description;
        _transaction.itemPrice = newItemInfo.price;
        _transaction.qty = 1;

        // Store the transaction
        transactions[msg.sender].push(_transaction);
        transaction.push(_transaction);

        carbonwise.ccListingPurchasedStatsFunc(_transaction.qty);

        emit ListingBought(listingId, newItemInfo.price);
    }

    function getItemInfo(
        uint256 _listingId
    ) public view returns (ItemInfo memory) {
        return itemInfoToId[_listingId];
    }

    function getAllItemInfo() public view returns (ItemInfo[] memory) {
        ItemInfo[] memory allItemInfo = new ItemInfo[](listingId);
        for (uint i = 0; i < listingId; i++) {
            allItemInfo[i] = itemInfoToId[i + 1];
        }
        return allItemInfo;
    }

    function getAllActiveItemInfo() public view returns (ItemInfo[] memory) {
        uint activeItemsLength;
        for (uint i = 0; i < listingId; i++) {
            ItemInfo memory itemInfo = itemInfoToId[i + 1];
            if (itemInfo.available == true) {
                activeItemsLength++;
            }
        }
        ItemInfo[] memory allActiveItemInfo = new ItemInfo[](activeItemsLength);
        uint index;
        for (uint i = 0; i < listingId; i++) {
            ItemInfo memory itemInfo = itemInfoToId[i + 1];
            if (itemInfo.available == true) {
                allActiveItemInfo[index] = itemInfoToId[i + 1];
                index++;
            }
        }
        return allActiveItemInfo;
    }

    function getCompanyByUser(
        address userAddr
    ) public view returns (Transaction[] memory) {
        return transactions[userAddr];
    }

    function getCompanyTransactions() public view returns (Transaction[] memory) {
        return transactions[msg.sender];
    }
}