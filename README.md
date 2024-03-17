# Dapp Voting
Pour correction :

Lien vidéo: LINK
Lien Déploiement: LINK
Déployé sur sépolia

Groupe constitué de :
Benoit Nguyen et
Médhi Khoulé

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
    Netspec
    Github
    Excalidraw



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


