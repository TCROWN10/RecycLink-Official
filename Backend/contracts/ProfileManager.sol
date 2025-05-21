// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract ProfileManager {
    struct UserProfile {
        string name;
        string email;
        uint256 phoneNo;
        string country;
        uint8 gender;
        string profileImage;
        bool isInitialized;
    }

    mapping(address => UserProfile) private profiles;
    address public owner;

    event ProfileUpdated(
        address indexed userAddress,
        string name,
        string email,
        uint256 phoneNo,
        string country,
        uint8 gender,
        string profileImage
    );

    error ProfileNotInitialized();
    error InvalidEmailFormat();
    error InvalidPhoneNumber();

    constructor() {
        owner = msg.sender;
    }

    function updateProfile(
        string memory _name,
        string memory _email,
        uint256 _phoneNo,
        string memory _country,
        uint8 _gender,
        string memory _profileImage
    ) external {
        // Basic validation
        require(bytes(_name).length > 0, "Name cannot be empty");
        require(bytes(_email).length > 0, "Email cannot be empty");
        require(_phoneNo > 0, "Phone number cannot be zero");
        require(bytes(_country).length > 0, "Country cannot be empty");
        require(_gender <= 2, "Invalid gender value");

        // Email format validation (basic check)
        if (!_validateEmail(_email)) {
            revert InvalidEmailFormat();
        }

        // Phone number validation (basic check)
        if (!_validatePhoneNumber(_phoneNo)) {
            revert InvalidPhoneNumber();
        }

        // Update or initialize profile
        profiles[msg.sender] = UserProfile({
            name: _name,
            email: _email,
            phoneNo: _phoneNo,
            country: _country,
            gender: _gender,
            profileImage: _profileImage,
            isInitialized: true
        });

        emit ProfileUpdated(
            msg.sender,
            _name,
            _email,
            _phoneNo,
            _country,
            _gender,
            _profileImage
        );
    }

    function getProfile(address userAddress) external view returns (
        string memory name,
        string memory email,
        uint256 phoneNo,
        string memory country,
        uint8 gender,
        string memory profileImage
    ) {
        UserProfile storage profile = profiles[userAddress];
        if (!profile.isInitialized) {
            revert ProfileNotInitialized();
        }

        return (
            profile.name,
            profile.email,
            profile.phoneNo,
            profile.country,
            profile.gender,
            profile.profileImage
        );
    }

    function hasProfile(address userAddress) external view returns (bool) {
        return profiles[userAddress].isInitialized;
    }

    function _validateEmail(string memory email) private pure returns (bool) {
        bytes memory emailBytes = bytes(email);
        
        // Basic validation: check for @ symbol and minimum length
        bool hasAtSymbol;
        uint256 atSymbolIndex;
        
        for (uint i = 0; i < emailBytes.length; i++) {
            if (emailBytes[i] == '@') {
                hasAtSymbol = true;
                atSymbolIndex = i;
                break;
            }
        }
        
        return hasAtSymbol && 
               atSymbolIndex > 0 && // Has characters before @
               atSymbolIndex < emailBytes.length - 1; // Has characters after @
    }

    function _validatePhoneNumber(uint256 phoneNo) private pure returns (bool) {
        // Basic validation: check if number has between 7 and 15 digits
        uint256 digits;
        uint256 temp = phoneNo;
        
        while (temp > 0) {
            temp /= 10;
            digits++;
        }
        
        return digits >= 7 && digits <= 15;
    }
} 