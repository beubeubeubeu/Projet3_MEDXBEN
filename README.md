# Dapp Voting


Groupe constitué de :
Benoit Nguyen et
Médhi Khoulé

### Pour correction :

Lien vidéo (local) : https://www.loom.com/share/ae32f56953774f86a9a748aa0fc16955?sid=48590c51-37a4-49d9-b3e9-0e2a5e4c777f

Lien de la Dapp : https://projet3-medxben.vercel.app/

Lien Etherscan du contract : https://sepolia.etherscan.io/address/0xCd8CA7D3D6Ae572F7BC2a602FafD7d4bB2C763c7

Déployé sur Sepolia et Vercel

Screen interface admin Vercel chez Médhi:

![AdminAccess](https://github.com/beubeubeubeu/Projet3_MEDXBEN/assets/4832337/0de518ca-226f-4c15-a818-13705d2b92da)


Screen interface voter Vercel chez Benoît:

<img width="1429" alt="Screenshot 2024-03-18 at 14 52 31" src="https://github.com/beubeubeubeu/Projet3_MEDXBEN/assets/4832337/a2e06b60-974b-4c0a-8880-f145af833795">

___
### Détails
`Contract`

>La faille a été corrigé comme suit:
En déclarant une nouvelle variable
    uint256 private maxVoteCount;

> Puis en déplaçant la logique de comptage des votes directement à la fin de la fonction SetVote comme suit:

            if (proposalsArray[_id].voteCount > maxVoteCount) {
            winningProposalID = _id;
            maxVoteCount = proposalsArray[_id].voteCount;
        }

 >Ici la winningProposalID et le maxVoteCount se mettent a jour quand la proposition que le voteur a choisi obtient plus de votes que les autres propositions.

          
>Finalement la fonction TallyVotes() est utilisée seulement pour: vérifier le statut du processus de vote, mettre a jour le workflow et emmètre un événement.


### Niveaux bonnes pratiques nous avons fait ceci:

1. utilisation de la norme NatSpec pour les commentaires
2. Upper camel case pour le nom du fichier et nom des fonctions
3. Lower camel case pour les modifiers et variables
4.lower camel case précédé d'un underscore pour les inputs de fonctions, event et modifier
5. sortir la documentation du contrat avec HardHat DocGen

exemple:
```    /**
     * @notice Function to add a voter in the whitlist
     * @param _addr Address of the voter to be added to the whitelist
     * @dev This function use the modifier onlyOwner, require to be in the right state,
     * add voter to the struc Voter and emit en event
     */
    function AddVoter(address _addr) external onlyOwner {
        require(
            workflowStatus == WorkflowStatus.RegisteringVoters,
            "Voters registration is not open yet"
        );
        require(voters[_addr].isRegistered != true, "Already registered");

        voters[_addr].isRegistered = true;
        emit VoterRegistered(_addr);
    }
```
___ 
`Front`

Voici la liste de la stack utilisée pour la réalisation du projet

    Next.js
    Wagmi
    Chakra UI
    Solidity
    Natspec
    Github

    Excalidraw

# Mémo des commandes à lancer

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

### Deploy checklist

Liste de BenBk

- [ ] déployer le contrat sur sepolia
- [ ] mettre le bon numéro de bloc dans les events
- [ ] changer aussi l'adresse du contrat dans constants
- [ ] mettre la chain sepolia custom avec votre rpc url
- [ ] mettre le repo sur github
- [ ] avec vercel, déployer en mettant les variables dans le .env.local
- [ ] mettre l'adresse du site sur cloud.walletconnect pr la verif
- [ ] mettre le code donné dans /public/.well-known/walletconnect.txt
- [ ] repusher sur github
- [ ] attendre le redéploiement automatique
- [ ] valider la vérification sur walletconnect
