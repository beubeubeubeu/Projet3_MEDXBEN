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

<img width="1241" alt="Screenshot 2024-03-05 at 18 05 17" src="https://github.com/beubeubeubeu/Projet3_MEDXBEN/assets/4832337/07314e1c-f091-4766-bd90-0479635a8899">
