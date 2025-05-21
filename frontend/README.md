# RecycLink - Blockchain-Powered Recycling Platform

## Overview

**RecycLink** is a cutting-edge blockchain-powered platform designed to address two major global challenges: plastic waste and climate change. By transforming plastic waste recycling into tradeable carbon credits, RecycLink offers a unique solution that incentivizes responsible waste disposal while contributing to global climate action. With a transparent and secure platform powered by blockchain, we're helping users make a measurable difference in the fight against climate change, while also benefiting from the growing RecycLink market. Every recycled bottle not only reduces plastic waste but also contributes to significant CO₂ savings.

Let's turn waste into wealth—and carbon reductions. Let's build a sustainable future with **RecycLink**.

## Project Architecture

### Smart Contract Architecture

#### Main Contract (RecycLink.sol)
- **User Management System**
  - Role-based access control (Users, Admins, Verifiers, Companies)
  - User registration and profile management
  - Statistics tracking for all user types

- **Recycling Management**
  - Plastic recycling tracking
  - Transaction history
  - Reward distribution system
  - XPoints and XRate system for user engagement

- **Token Integration**
  - USDT integration for payments
  - Credit token system
  - Token distribution and management

#### Marketplace Contracts
- **EventMarketPlace.sol**
  - Event creation and management
  - Event participation tracking
  - Reward distribution for events

- **RcMarketPlace.sol**
  - Recycling material trading
  - Price management
  - Transaction processing

### Frontend Architecture

#### Core Components
- **Navigation Components**
  - Main navigation
  - Dashboard navigation
  - Feature-specific navigation

- **Dashboard Components**
  - Statistics cards
  - Data visualization
  - Data display tables

- **User Interface Components**
  - User profile management
  - Dark/Light mode toggle
  - User notifications
  - Recycling management interface

- **Blockchain Integration**
  - Wallet connection
  - Network selection
  - Token management

#### Pages
- **Landing Page**
  - Project introduction
  - Feature showcase
  - User registration

- **Dashboard**
  - User statistics
  - Recycling tracking
  - Transaction history
  - Reward management

- **Registration**
  - User onboarding
  - Role selection
  - Profile creation

## Technical Stack

### Frontend
- React with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- NextUI (with planned migration to HeroUI)
- Wagmi for Ethereum interaction

**MarketPlace** is a smart contract for managing item listings in a marketplace. Users can create listings, update item information, perform transactions, and redeem receipt tokens.

## Core Functionality

### User Account Management
- Users can create accounts with personal information
- Recycling transactions are recorded, and users earn tokens
- Users can edit their information
- User data is stored in a structured format

### Item Listing Management
- Users can create item listings in the marketplace
- Items can be updated with new information
- Users can perform transactions in the marketplace
- Placeholder functions for redeeming receipt tokens

## Data Structures

### Smart Contracts
- **User Structure**: Represents user information
- **Gender Enumeration**: Enumerates user gender
- **Recycled Structure**: Represents recycling transactions
- **ItemInfo Structure**: Stores item listing information

### State Variables
- **RecycLink**: Stores user data and recycling transactions
- **MarketPlace**: Manages item listings and transactions

## Development Setup

### Prerequisites
- Node.js (v18 or later)
- npm or yarn
- MetaMask or compatible Web3 wallet

- Users can create accounts with personal information.
- Recycling transactions are recorded, and users earn tokens.
- Users can edit their information.
- User data is stored in a structured format.

1. Clone the repository:
```bash
git clone https://github.com/your-username/recyclink.git
cd recyclink
```

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

4. Start the development servers:
```bash
# Frontend
cd frontend
npm run dev

- **RecycLink**: Stores user data and recycling transactions.
- **MarketPlace**: Manages item listings and transactions.

## Deployed Contract Addresses

- USDT Token: `0x412b74A7d8C333B1EBDF31768f776BB8C0C41169`
- RecycLink: `0xAC7D133Fa5A84b26701B95c083695fBFD92ebE5b`
- Event MarketPlace: `0x01dA771AD0fC40a97F65Bebbf9AD23d218463723`
- RcMarketPlace: `0xDC5ee8E70a1F883f971261c9952650271381BEA7`

## Usage

The RecycLink smart contract system is designed to create a sustainable ecosystem where users are rewarded for recycling and can trade items in a marketplace. Users can create accounts, record recycling transactions, manage receipt tokens, and participate in the marketplace. The system encourages environmental sustainability and promotes recycling practices.

## License

The smart contracts are released under the UNLICENSED and MIT licenses, allowing for open use, modification, and distribution. However, ensure a clear understanding of the code and its functionality before deploying it in a production environment.

## Contact

For any questions or concerns, please reach out to the development team.

## Acknowledgments

- Thanks to all contributors who have helped shape this project
- Special thanks to the open-source community for their invaluable tools and libraries
