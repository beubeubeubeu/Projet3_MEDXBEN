// SPDX-License-Identifier: MIT

pragma solidity 0.8.20;
import "@openzeppelin/contracts/access/Ownable.sol";


/**
    Here is the flow of the entire voting process:
    The voting administrator registers a whitelist of voters identified by their Ethereum address.
    The voting administrator starts the proposal registration session.
    Registered voters are allowed to register their proposals while the registration session is active.
    The voting administrator ends the proposal registration session.
    The voting administrator starts the voting session.
    Registered voters vote for their preferred proposal.
    The voting administrator ends the voting session.
    The voting administrator tallies the votes.
    Everyone can verify the final details of the winning proposal.
 */


/**
    @title Voting.sol
    @author Khoule Medhi / Benoit Nguyen
    @notice Smart voting contract for a small organization.
*/
contract Voting is Ownable {
    uint256 public winningProposalID;
    uint256 private maxVoteCount;

    struct Voter {
        bool isRegistered;
        bool hasVoted;
        uint256 votedProposalId;
    }

    struct Proposal {
        string description;
        uint256 voteCount;
    }

    enum WorkflowStatus {
        RegisteringVoters,
        ProposalsRegistrationStarted,
        ProposalsRegistrationEnded,
        VotingSessionStarted,
        VotingSessionEnded,
        VotesTallied
    }

    WorkflowStatus public workflowStatus;
    Proposal[] proposalsArray;
    mapping(address => Voter) voters;

    /// @notice Emitted when a new voter is registered
    /// @param voterAddress The address of the newly registered voter
    event VoterRegistered(address voterAddress);


    // @notice Emitted when the Workflow status of the voting process is modified
    // @param Previous Status Workflow status before the change
    // @param New Status Workflow status after the change
    event WorkflowStatusChange(
        WorkflowStatus previousStatus,
        WorkflowStatus newStatus
    );

    /// @notice Emitted when a new proposal is created
    /// @param proposalId The ID of the new registered proposal
    event ProposalRegistered(uint256 proposalId);

    /// @notice Emitted when a voter vote for a proposal
    /// @param voter The address of the voter who has voted
    /// @param proposalId The ID proposal that was voted by voter

    event Voted(address voter, uint256 proposalId);

    constructor() Ownable(msg.sender) {}

    /// @notice Modifier to verify if the address is whitelisted
    /// @dev Revert if address is not whitelisted

    modifier onlyVoters() {
        require(voters[msg.sender].isRegistered, "You're not a voter");
        _;
    }

    /// on peut faire un modifier pour les états

    // ::::::::::::: GETTERS ::::::::::::: //

    /**
     * @notice Getter to obtain voter
     * @param _addr Ethereum address
     * @return bool isRegistered; bool hasVoted; uint votedProposalId;
     */
    function GetVoter(address _addr)
        external
        view
        onlyVoters
        returns (Voter memory)
    {
        return voters[_addr];
    }

    /**
     * @notice Getter to obtain a proposal
     * @param _id The index of the propasal in the array
     * @return string The description of the proposal
     */
    function GetOneProposal(uint256 _id)
        external
        view
        onlyVoters
        returns (Proposal memory)
    {
        return proposalsArray[_id];
    }

    // ::::::::::::: REGISTRATION ::::::::::::: //
    /**
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

    // ::::::::::::: PROPOSAL ::::::::::::: //
    /**
     * @notice Function to add a proposal if your are whitelisted
     * @param _desc Description of the proposal
     * @dev Require to be in the right state, description cannot be empty,
     * add the proposal to a array and emit an event
     */
    function AddProposal(string calldata _desc) external onlyVoters {
        require(
            workflowStatus == WorkflowStatus.ProposalsRegistrationStarted,
            "Proposals are not allowed yet"
        );
        require(
            keccak256(abi.encode(_desc)) != keccak256(abi.encode("")),
            "Vous ne pouvez pas ne rien proposer"
        ); // facultatif
        // voir que desc est different des autres

        Proposal memory proposal;
        proposal.description = _desc;
        proposalsArray.push(proposal);
        // proposalsArray.push(Proposal(_desc,0));
        emit ProposalRegistered(proposalsArray.length - 1);
    }

    // ::::::::::::: VOTE ::::::::::::: //
    /**
     * @notice Authorize the whitelisted to vote for a proposal and establish the wining proposal id at the moment
     * @param _id The index of the proposal
     * @dev Require that the voter hasn't already vote, require to vote for a existing proposal,
     * emit an event
     */
    function SetVote(uint256 _id) external onlyVoters {
        require(
            workflowStatus == WorkflowStatus.VotingSessionStarted,
            "Voting session havent started yet"
        );
        require(voters[msg.sender].hasVoted != true, "You have already voted");
        require(_id < proposalsArray.length, "Proposal not found"); // pas obligé, et pas besoin du >0 car uint

        voters[msg.sender].votedProposalId = _id;
        voters[msg.sender].hasVoted = true;
        proposalsArray[_id].voteCount++;

        if (proposalsArray[_id].voteCount > maxVoteCount) {
            winningProposalID = _id;
            maxVoteCount = proposalsArray[_id].voteCount;
        }
        emit Voted(msg.sender, _id);
    }

    // ::::::::::::: STATE ::::::::::::: //
    /**
     * @notice Function to start the proposals registering
     * @dev Require to be in the right state,
     * require to be the owner,
     * a default proposal is create with the description "genesis",
     * modifies the state,
     * and emit a event
     */
    function StartProposalsRegistering() external onlyOwner {
        require(
            workflowStatus == WorkflowStatus.RegisteringVoters,
            "Registering proposals cant be started now"
        );
        workflowStatus = WorkflowStatus.ProposalsRegistrationStarted;

        Proposal memory proposal;
        proposal.description = "GENESIS";
        proposalsArray.push(proposal);

        emit WorkflowStatusChange(
            WorkflowStatus.RegisteringVoters,
            WorkflowStatus.ProposalsRegistrationStarted
        );
    }

    /// @notice Function to end the proposals registering
    /// @dev Require to be in the right state, require to be the owner, modifies the state and emit a event
    function EndProposalsRegistering() external onlyOwner {
        require(
            workflowStatus == WorkflowStatus.ProposalsRegistrationStarted,
            "Registering proposals havent started yet"
        );
        workflowStatus = WorkflowStatus.ProposalsRegistrationEnded;
        emit WorkflowStatusChange(
            WorkflowStatus.ProposalsRegistrationStarted,
            WorkflowStatus.ProposalsRegistrationEnded
        );
    }

    /// @notice Function to start the voting session
    /// @dev Require to be in the right state, require to be the owner, modifies the state and emit a event
    function StartVotingSession() external onlyOwner {
        require(
            workflowStatus == WorkflowStatus.ProposalsRegistrationEnded,
            "Registering proposals phase is not finished"
        );
        workflowStatus = WorkflowStatus.VotingSessionStarted;
        emit WorkflowStatusChange(
            WorkflowStatus.ProposalsRegistrationEnded,
            WorkflowStatus.VotingSessionStarted
        );
    }

    /// @notice Function to end the voting session
    /// @dev Require to be in the right state, require to be the owner, modifies the state and emit a event
    function EndVotingSession() external onlyOwner {
        require(
            workflowStatus == WorkflowStatus.VotingSessionStarted,
            "Voting session havent started yet"
        );
        workflowStatus = WorkflowStatus.VotingSessionEnded;
        emit WorkflowStatusChange(
            WorkflowStatus.VotingSessionStarted,
            WorkflowStatus.VotingSessionEnded
        );
    }

    /**
@notice Function to tally the votes and determines the wining proposal
@dev Require to be in the right state,
* require to be the owner,
* the winning propsal is already determined by the 'setVotes' function,
* modifies the state and emit a event
*/
    function TallyVotes() external onlyOwner {
        require(
            workflowStatus == WorkflowStatus.VotingSessionEnded,
            "Current status is not voting session ended"
        );

        workflowStatus = WorkflowStatus.VotesTallied;
        emit WorkflowStatusChange(
            WorkflowStatus.VotingSessionEnded,
            WorkflowStatus.VotesTallied
        );
    }
}
