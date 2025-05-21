// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface USDToken {

    function balanceOf(address account) external view returns (uint256);

    function mint(address userAccount, uint256 amountToMint) external;

    function transfer(address to, uint256 value) external returns (bool);
}

contract CarbonWise {
    USDToken usdt; // An instance of RwasteWise contract.

    // Create state variables that will be used for statistics
    struct Statistics {
        uint totalUsers;
        uint totalAdmins;
        uint totalVerifiers;
        uint totalRecycled;
        uint totalMinted;
        uint totalCompanies;
        uint totalEventListingCreated;
        uint totalEventListingPurchased;
        uint totalCCListingCreated;
        uint totalCCListingPurchased;
    }

    struct RecycleTransaction {
        uint date;
        uint numberOfplastics;
    }

    struct DisbursementTransaction {
        uint date;
        uint numberOfTokens;
    }

    /// @dev Structure to represent a user in the system.
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
        VERIFIERS,
        COMPANY
    }

    /// @dev Mapping to track recycling transactions for each user.
    mapping(address => RecycleTransaction[]) RecycleTransactionMap;
    mapping(address => DisbursementTransaction[]) DisbursementTransactionMap;

    /// @dev Mapping to store user data.
    mapping(address => User) public UserMap;
    mapping(uint => address) public IdToUserAddress;
    mapping(uint => address) public IdToAdminAddress;
    mapping(uint => address) public IdToVerifierAddress;
    mapping(uint => address) public IdToCompanyAddress;

    Statistics public statistics;

    uint adminReqId;

    User[] allUsers; // An array to store all user data.

    User[] allAdmins; // An array to store all admins

    User[] allVerifiers;

    User[] allCompanies;

    RecycleTransaction[] recycleTransaction;

    DisbursementTransaction[] disbursementTransaction;

    uint public userId; // A counter to track the number of users in the system.
    uint public adminId;
    uint public verifierId;
    uint public companyId; 

    // Custom Errors
    error UserAcctNotCreated();
    error CompanyAcctNotCreated();
    error ZeroAmountNotAllow();
    error UserAccountAlreadyExist();
    error AdminAccountAlreadyExist();
    error VerifierAccountAlreadyExist();
    error UserDoesNotExist();
    error ExpectNonAdmin();
    error AdminAlreadyApproved(address _addr);
    error TheAddressIsNotInTheAdminArray();
    error VerifierAlreadyExist();
    error UserIsNotVerifier();

    // Events
    event UserAccountCreated(
        uint256 indexed userId,
        string _name,
        address indexed user,
        uint256 timeJoined
    );

    event AdminAccountCreated(
        uint256 indexed userId,
        string _name,
        address indexed user,
        uint256 timeJoined
    );

    event VerifierAccountCreated(
        uint256 indexed userId,
        string _name,
        address indexed user,
        uint256 timeJoined
    );

    event CompanyAccountCreated(
        uint256 indexed userId,
        string _name,
        address indexed user,
        uint256 timeJoined
    );

    event PlasticDeposited(
        address indexed depositor,
        uint256 indexed _qtyrecycled,
        uint timeRecycled
    );

    event StatisticsUpdated(Statistics _statistics);
    event Disbursed(uint totalFunds);

    error OnlyTheVerifiersCanCallThisFunction();

    // MODIFIERS
    modifier onlyVerifiers() {
        require(
            UserMap[msg.sender].role == Role.VERIFIERS,
            "Only the verifiers can call this function"
        );
        _;
    }

    modifier onlyAdmins() {
        require(
            UserMap[msg.sender].role == Role.ADMINS,
            "Only the Admin can call this function"
        );
        _;
    }

    constructor(address tokenAddress) {
        usdt = USDToken(tokenAddress);
    }

    function createUserAcct(
        string memory _name
    ) public {
        userId++;

        if (UserMap[msg.sender].userAddr == msg.sender) {
            revert UserAccountAlreadyExist();
        }

        User storage user = UserMap[msg.sender];
        user.id = userId;
        user.name = _name;
        user.userAddr = msg.sender;
        user.timeJoined = block.timestamp;
        IdToUserAddress[user.id] = msg.sender;

        allUsers.push(user);

        // Avoid reading and updating Statistics from state directly.
        Statistics memory _stats;
        _stats.totalUsers = statistics.totalUsers + 1;
        statistics.totalUsers = _stats.totalUsers;

        emit UserAccountCreated(
            user.id,
            user.name,
            msg.sender,
            block.timestamp
        );
        
        emit StatisticsUpdated(statistics);
    }

    function createAdmin(
        string memory _name,
        address _address
    ) public {
        adminId++;

        if (UserMap[_address].userAddr == _address) {
            revert AdminAccountAlreadyExist();
        }

        User storage user = UserMap[_address];
        user.id = adminId;
        user.name = _name;
        user.userAddr = _address;
        user.role = Role.ADMINS;
        user.timeJoined = block.timestamp;
        IdToAdminAddress[user.id] = _address;

        allAdmins.push(user);

        // Avoid reading and updating Statistics from state directly.
        statistics.totalAdmins = statistics.totalAdmins + 1;
        emit AdminAccountCreated(
            adminId,
            _name,
            _address,
            block.timestamp
        );
        emit StatisticsUpdated(statistics);
    }

    function createVerifier(
        string memory _name,
        address _address
    ) public {
        verifierId++;

        if (UserMap[_address].userAddr == _address) {
            revert VerifierAccountAlreadyExist();
        }

        User storage user = UserMap[_address];
        user.id = verifierId;
        user.name = _name;
        user.userAddr = _address;
        user.role = Role.VERIFIERS;
        user.timeJoined = block.timestamp;
        IdToVerifierAddress[user.id] = _address;

        allVerifiers.push(user);

        // Avoid reading and updating Statistics from state directly.
        statistics.totalVerifiers = statistics.totalVerifiers + 1;
        emit VerifierAccountCreated(
            verifierId,
            _name,
            _address,
            block.timestamp
        );
        emit StatisticsUpdated(statistics);
    }

    function createCompanyAcct(
        string memory _name
    ) public {
        companyId++;

        if (UserMap[msg.sender].userAddr == msg.sender) {
            revert CompanyAcctNotCreated();
        }
        User storage user = UserMap[msg.sender];

        // TODO: Email should be unique.
        // TODO: Implement the test as well
        user.id = companyId;
        user.name = _name;
        user.userAddr = msg.sender;
        user.role = Role.COMPANY;
        user.timeJoined = block.timestamp;
        IdToCompanyAddress[companyId] = msg.sender;

        allCompanies.push(user);

        statistics.totalCompanies = statistics.totalCompanies + 1;

        emit CompanyAccountCreated(
            companyId,
            _name,
            msg.sender,
            block.timestamp
        );

        emit StatisticsUpdated(statistics);
    }

    function depositPlastic(
        uint _qtyrecycled,
        uint _userId
    ) external onlyVerifiers {
        address _userAddr = IdToUserAddress[_userId];
        if (_userAddr == address(0)) {
            revert UserDoesNotExist();
        }

        User storage user = UserMap[_userAddr];

        if (_qtyrecycled == 0) revert ZeroAmountNotAllow();

        // Create a new Recycled struct
        RecycleTransaction memory recycled;
        recycled.numberOfplastics = _qtyrecycled;
        recycled.date = block.timestamp;
        RecycleTransactionMap[_userAddr].push(recycled);
        recycleTransaction.push(recycled);

        user.xpoints = user.xpoints + (_qtyrecycled * 10);

        allUsers[_userId - 1] = user;

        statistics.totalRecycled = statistics.totalRecycled + _qtyrecycled;
        
        emit PlasticDeposited(_userAddr,
        recycled.numberOfplastics,
        recycled.date);
        emit StatisticsUpdated(statistics);
    }

    function disbursement() external onlyAdmins {
        uint totalXpoints;
        uint total = usdt.balanceOf(address(this));
        DisbursementTransaction memory _disbursementTransaction;

         for (uint256 i = 0; i < allUsers.length; i++) {
            totalXpoints += allUsers[i].xpoints;
        }
        for (uint256 i = 0; i < allUsers.length; i++) {
            allUsers[i].xrate = (allUsers[i].xpoints * 10000) / totalXpoints;
        }

        for (uint256 i = 0; i < allUsers.length; i++) {
            usdt.transfer(allUsers[i].userAddr, (allUsers[i].xrate * total) / 10000);
            User storage user = UserMap[allUsers[i].userAddr];
            user.xpoints = 0;
            user.xrate = 0;
            allUsers[i].xpoints = 0;
            allUsers[i].xrate = 0;
            _disbursementTransaction.numberOfTokens = (allUsers[i].xrate * total) / 10000;
            _disbursementTransaction.date = block.timestamp;
            DisbursementTransactionMap[allUsers[i].userAddr].push(_disbursementTransaction);
            disbursementTransaction.push(_disbursementTransaction);
            statistics.totalMinted = statistics.totalMinted + _disbursementTransaction.numberOfTokens;
        }

        emit Disbursed(total);   
    }

    function listingCreatedStatsFunc() external {
         statistics.totalEventListingCreated = statistics.totalEventListingCreated + 1;
    }

    function listingPurchasedStatsFunc(uint purschasedNum) external {
         statistics.totalEventListingPurchased = statistics.totalEventListingPurchased + purschasedNum;
    }

    function ccListingCreatedStatsFunc() external {
         statistics.totalCCListingCreated = statistics.totalCCListingCreated + 1;
    }

    function ccListingPurchasedStatsFunc(uint purschasedNum) external {
         statistics.totalCCListingPurchased = statistics.totalCCListingPurchased + purschasedNum;
    }

    function getUserRecycles() public view returns (RecycleTransaction[] memory) {
        return RecycleTransactionMap[msg.sender];
    }

    function getAllRecycles() public view returns (RecycleTransaction[] memory) {
        return recycleTransaction;
    }
    
    function getAllUsers() public view returns (User[] memory) {
        return allUsers;
    }

    function getAllCompanies() public view returns (User[] memory) {
        return allCompanies;
    }

    function getVerifiers() public view returns (User[] memory) {
        return allVerifiers;
    }

    function getUser() public view returns (User memory) {
        return UserMap[msg.sender];
    }

    function getCompany() public view returns (User memory) {
        return UserMap[msg.sender];
    }

    function getAdmins() public view returns (User[] memory) {
        return allAdmins;
    }
}