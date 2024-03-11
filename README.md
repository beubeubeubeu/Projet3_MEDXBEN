### Run front

`cd frontend`

`yarn install`

`touch /frontend/.env.local`

In .env.local: "NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=MA_CLE"

### Run back (blockchain)

`cd backend`

`yarn install`

`yarn hardhat node --network hardhat`

`yarn hardhat run scripts/deploy.js --network localhost`
