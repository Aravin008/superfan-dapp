// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract Guestbook {
    struct Message {
        address sender;
        string text;
        uint timestamp;
    }

    Message[] public messages;

    function sign(string calldata _text) public {
        messages.push(Message(msg.sender, _text, block.timestamp));
    }

    function getMessages() public view returns (Message[] memory) {
        return messages;
    }
}

