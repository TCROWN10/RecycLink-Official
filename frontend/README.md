# RecycLink Smart Contract Documentation


## Overview

**RecycLink** is a cutting-edge blockchain-powered platform designed to address two major global challenges: plastic waste and climate change. By transforming plastic waste recycling into tradeable carbon credits, RecycLink offers a unique solution that incentivizes responsible waste disposal while contributing to global climate action. With a transparent and secure platform powered by blockchain, we’re helping users make a measurable difference in the fight against climate change, while also benefiting from the growing RecycLink market. Every recycled bottle not only reduces plastic waste but also contributes to significant CO₂ savings.

Let’s turn waste into wealth—and carbon reductions. Let’s build a sustainable future with **RecycLink**.

## The Platform: RecycLink

**RecycLinke** tokenizes real-world assets (recycled plastic) to create a transparent and verifiable market for carbon credits. Our platform enables users to deposit plastic waste at designated collection points in exchange for Deposit Tokens, which can be spent in the marketplace. The collected plastics are then sent to recycling facilities where they are processed and converted into verifiable carbon credits.

![Image](../Roadmap.svg)

## Contracts

The RecycLink is a comprehensive blockchain-based solution comprising three core contracts: `RecycLink` and `MarketPlace`. This integrated system is designed to promote environmental sustainability by rewarding users for recycling efforts through the issuance of receipt tokens ($EDU) and enabling the trade of items in a marketplace.

### RecycLink

- **Name**: RecycLink
- **License**: UNLICENSED
- **Solidity Version**: ^0.8.13

**RecycLink** is a smart contract that manages user recycling information and rewards users for their recycling activities. Users can create accounts, record recycling transactions, and earn tokens for their efforts.

### MarketPlace

- **Name**: MarketPlace
- **License**: MIT
- **Solidity Version**: >=0.7.0 <0.9.0

**MarketPlace** is a smart contract for managing item listings in a marketplace. Users can create listings, update item information, perform transactions, and redeem receipt tokens.

## Core Functionality

### User Account Management (RecycLink)

- Users can create accounts with personal information.
- Recycling transactions are recorded, and users earn tokens.
- Users can edit their information.
- User data is stored in a structured format.


### Item Listing Management (MarketPlace)

- Users can create item listings in the marketplace.
- Items can be updated with new information.
- Users can perform transactions in the marketplace.
- Placeholder functions for redeeming receipt tokens.

## Data Structures

- **User Structure (RecycLink)**: Represents user information.
- **Gender Enumeration (RecycLink)**: Enumerates user gender.
- **Recycled Structure (RecycLink)**: Represents recycling transactions.
- **ItemInfo Structure (MarketPlace)**: Stores item listing information.

## State Variables

- **RecycLink**: Stores user data and recycling transactions.
- **MarketPlace**: Manages item listings and transactions.

## Custom Errors

- Custom errors are defined to handle specific situations, such as account creation, token minting, and transaction issues.

## Usage

The RecycLink smart contract system is designed to create a sustainable ecosystem where users are rewarded for recycling and can trade items in a marketplace. Users can create accounts, record recycling transactions, manage receipt tokens, and participate in the marketplace. The system encourages environmental sustainability and promotes recycling practices.

## License

The smart contracts are released under the UNLICENSED and MIT licenses, allowing for open use, modification, and distribution. However, ensure a clear understanding of the code and its functionality before deploying it in a production environment.

## Deployed Contract Addresses on EDU - Chain

USDT Token - 0x412b74A7d8C333B1EBDF31768f776BB8C0C41169

Recyclink - 0xAC7D133Fa5A84b26701B95c083695fBFD92ebE5b

Event MarketPlace - 0x01dA771AD0fC40a97F65Bebbf9AD23d218463723

RcMarketPlace - 0xDC5ee8E70a1F883f971261c9952650271381BEA7
