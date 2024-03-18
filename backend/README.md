
### DEPLOY ON SEPOLIA ###
------REQUIRE------
yarn add dotenv
file .env  in backend with PK = /ETHERSCAN = /INFURA = /ALCHEMY =

------DEPLOY------
 yarn hardhat run ./scripts/deploy.js --network sepolia  // Voting deployed to 0x40B176280A1cA4fA20D10fd7DED02d7aECb6CD91
 deploy on block = 5493264

 ------ VERIFY CONTRACT ------
yarn hardhat verify --network sepolia 0x40B176280A1cA4fA20D10fd7DED02d7aECb6CD91
Successfully verified contract Voting on the block explorer.
https://sepolia.etherscan.io/address/0x40B176280A1cA4fA20D10fd7DED02d7aECb6CD91#code

------ MAJ ADDRESS CONTRACT ------
index.js line 2
clients.js line 6
provider.jsx line 12 / 21
modify from blocknumber on voting.jsx line 114 / 122 / 130 /139

--- SEPOLIA RPC ----
create sepolia.js
in network/env  NEXT_PUBLIC_ALCHEMY_RPC=YOUR_ALCHEMYRPC
in client.js import { sepolia } from './sepolia'

----- PACKAGE SUPP ------
npm install pino-pretty
npm install encoding