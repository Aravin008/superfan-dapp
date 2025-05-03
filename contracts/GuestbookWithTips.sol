// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface INFTAccess {
    function registerEvent(address creator, uint256 eventId, uint256 priceInETH, uint256 priceInFAN, string calldata uri) external returns (uint256);
}

contract GuestbookWithTips {
    struct Message {
        uint256 msgId;
        address sender;
        address recipient;
        string text;
        uint256 tipAmountETH;
        uint256 tipAmountFAN;
        uint256 replyToMsgId;
    }

    struct EventItem {
        uint256 eventId;
        address creator;
        string title;
        string description;
        uint256 date;
        bool isNftGated;
        uint256 nftEventId;
    }

    IERC20 public fanToken;
    INFTAccess public nftContract;
    Message[] public messages;
    EventItem[] public events;
    address[] public allCreators;
    mapping(address => bool) public isCreator;
    mapping(uint256 => mapping(address => bool)) public eventAccess;

    event NewMessage(address indexed from, address indexed to, uint256 msgId, string text, uint256 tipAmountETH, uint256 tipAmountFAN, uint256 replyToMsgId);
    event NewCreator(address indexed creator);
    event EventCreated( uint256 indexed eventId, address indexed creator, string title, string description, uint256 date);
    event NFTAccessEnabled(uint256 indexed eventId, uint256 priceInETH, uint256 priceInFAN, string uri);

    constructor(address _fanToken, address _nftContract) {
        fanToken = IERC20(_fanToken);
        nftContract = INFTAccess(_nftContract);
    }

    function registerAsCreator() external {
        require(!isCreator[msg.sender], "Already a creator");
        isCreator[msg.sender] = true;
        allCreators.push(msg.sender);
        emit NewCreator(msg.sender);
    }

    function createEvent(string memory _title, string memory _description, uint256 _date) external {
        require(isCreator[msg.sender], "Only creators can create events");

        uint256 eventId = events.length;
        events.push(EventItem({
            eventId: eventId,
            creator: msg.sender,
            title: _title,
            description: _description,
            date: _date,
            isNftGated: false,
            nftEventId: 0    
        }));

        emit EventCreated(eventId, msg.sender, _title, _description, _date);
    }

    function sendMessage( address to, string calldata text, uint256 fanTipAmount, uint256 replyToMsgId ) external payable {
        uint256 ethTipAmount = msg.value;

        if (replyToMsgId != 0) {
            require(replyToMsgId <= messages.length, "Reply target does not exist");
            Message storage originalMsg = messages[replyToMsgId - 1]; // because msgId starts from 1
            require(originalMsg.recipient == msg.sender, "Only the original recipient can reply");
            // Ensure the reply is directed back to the original sender
            require(to == originalMsg.sender, "Replies must be sent to the original sender");
        } else {
            // If not a reply, ensure the recipient is a creator
            require(isCreator[to], "Recipient is not a registered creator");
        }

        // Transfer FAN tokens if any
        if (fanTipAmount > 0) {
            bool success = fanToken.transferFrom(msg.sender, to, fanTipAmount);
            require(success, "FAN token transfer failed");
        }

        // Transfer ETH if any
        if (ethTipAmount > 0) {
            payable(to).transfer(ethTipAmount);
        }

        uint256 msgId = messages.length + 1;

        // Save the message
        messages.push(Message(
            msgId,
            msg.sender,
            to,
            text,
            ethTipAmount,
            fanTipAmount,
            replyToMsgId 
        ));
        emit NewMessage(msg.sender, to, msgId, text, ethTipAmount, fanTipAmount, replyToMsgId);
    }

    function getMessages() external view returns (Message[] memory) {
        return messages;
    }

    function getCreators(address[] calldata addrs) external view returns (address[] memory) {
        uint count = 0;
        for (uint i = 0; i < addrs.length; i++) {
            if (isCreator[addrs[i]]) count++;
        }

        address[] memory result = new address[](count);
        uint j = 0;
        for (uint i = 0; i < addrs.length; i++) {
            if (isCreator[addrs[i]]) {
                result[j] = addrs[i];
                j++;
            }
        }
        return result;
    }

    function getAllCreators() external view returns (address[] memory) {
        return allCreators;
    }

    function getAllEvents() external view returns (EventItem[] memory) {
        return events;
    }

    function giveAccess(uint256 eventId, address fan) external {
        require(isCreator[msg.sender], "Only creators can grant access");
        require(events[eventId].creator == msg.sender, "Not your event");
        eventAccess[eventId][fan] = true;
    }

    function enableNFTAccessForEvent(uint256 eventId, uint256 priceInETH, uint256 priceInFAN, string calldata uri) external {
        require(events[eventId].creator == msg.sender, "Only creator of this event");
        require(!events[eventId].isNftGated, "Already gated with NFT");
        
        uint256 nftEventId = nftContract.registerEvent(msg.sender, eventId, priceInETH, priceInFAN, uri);

        events[eventId].isNftGated = true;
        events[eventId].nftEventId = nftEventId;
        emit NFTAccessEnabled(eventId, priceInETH, priceInFAN, uri);
    }
}
