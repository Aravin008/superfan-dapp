// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract EventAccessNFT is ERC721URIStorage, Ownable {
    struct NFTEvent {
        address creator;
        uint256 priceInETH;
        uint256 priceInFAN;
        string uri;
    }

    uint256 public nextId = 1;
    mapping(uint256 => NFTEvent) public nftEvents;     // eventId => event details
    mapping(uint256 => uint256[]) public eventMints;   // eventId => list of tokenIds
    IERC20 public fanToken;

    constructor(address _fanToken) ERC721("EventAccess", "EVT") Ownable(msg.sender) {
        fanToken = IERC20(_fanToken);
    }

    function registerEvent(
        address creator,
        uint256 eventId,
        uint256 priceInETH,
        uint256 priceInFAN,
        string calldata uri
    ) external returns (uint256) {
        nftEvents[eventId] = NFTEvent({
            creator: creator,
            priceInETH: priceInETH,
            priceInFAN: priceInFAN,
            uri: uri
        });
        return eventId;
    }

    function mintWithETH(uint256 eventId) external payable {
        NFTEvent memory evt = nftEvents[eventId];
        require(evt.creator != address(0), "Invalid event");
        require(msg.value >= evt.priceInETH, "Not enough ETH");

        uint256 tokenId = nextId++;
        _mint(msg.sender, tokenId);
        _setTokenURI(tokenId, evt.uri);
        eventMints[eventId].push(tokenId);

        payable(evt.creator).transfer(msg.value);
    }

    function mintWithFAN(uint256 eventId) external {
        NFTEvent memory evt = nftEvents[eventId];
        require(evt.creator != address(0), "Invalid event");
        require(evt.priceInFAN > 0, "FAN price not set");

        uint256 tokenId = nextId++;
        _mint(msg.sender, tokenId);
        _setTokenURI(tokenId, evt.uri);
        eventMints[eventId].push(tokenId);

        bool sent = fanToken.transferFrom(msg.sender, evt.creator, evt.priceInFAN);
        require(sent, "FAN transfer failed");
    }

    function balanceForEvent(uint256 eventId, address user) external view returns (bool) {
        for (uint i = 0; i < eventMints[eventId].length; i++) {
            if (ownerOf(eventMints[eventId][i]) == user) {
                return true;
            }
        }
        return false;
    }

    function _exists(uint256 tokenId) internal view returns (bool) {
        return nftEvents[tokenId].creator != address(0);
    }

    function _tokensOf(address user) internal view returns (uint256[] memory) {
        uint total = balanceOf(user);
        uint256[] memory result = new uint256[](total);
        uint count = 0;
        for (uint i = 1; i < nextId; i++) {
            if (_exists(i)) {
                if(ownerOf(i) == user) {
                result[count++] = i;
            }}
        }
        return result;
    }

    function tokensOf(address user) external view returns (uint256[] memory) {
        return _tokensOf(user);
    }


    function tokenOfUserForEvent(uint256 eventId, address user) public view returns (uint256) {
        uint256[] memory tokens = eventMints[eventId];
        for (uint i = 0; i < tokens.length; i++) {
            if (ownerOf(tokens[i]) == user) {
                return tokens[i]; // Return first token user owns for this event
            }
        }
        revert("User does not own a token for this event");
    }
}
