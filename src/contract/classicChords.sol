// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ERC5006.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract classicChords is ERC5006, Ownable{
    
    uint256 tokenId;    //for keeping counter of token ID
    address approvedContractAddress;

    constructor(uint recordLimit_, address _contractAddress ) ERC5006 ("", recordLimit_){
        approvedContractAddress = _contractAddress;
    }

    ///@notice token ID to token URI mapping
    mapping (uint256 => string) public tokenUriMapping;
    
    /// @notice function to approve marketPlace to list
    function approveMarket() public onlyOwner {
        setApprovalForAll(approvedContractAddress, true);
    }

    /// @notice function to disapprove marketPlace to list
    function disapproveMarket() public onlyOwner {
        setApprovalForAll(approvedContractAddress, false);
    }

    // function setURI(string memory _tokenUri) private onlyOwner {
    //     _setURI(_tokenUri);
    // }

    /// @notice Function to mint Token
    function mint(uint _amount, string memory _tokenUri) public {
        // setURI(_tokenUri);
        // _setURI(_tokenUri);
        _mint(msg.sender, tokenId, _amount, "");
        tokenUriMapping[uint256(tokenId)] = _tokenUri;
        setApprovalForAll(approvedContractAddress, true);
        tokenId++;
    }

    function transferFrom(address _owner, address _receiver, uint _tokenId, uint _quantity) public {
        _safeTransferFrom(_owner, _receiver, _tokenId, _quantity, "");
    }

    /// @notice Function to View token URI (tokenID ~ tokenURI)
    function viewTokenUri(uint256 _tokenId) public view returns(string memory){
        return tokenUriMapping[_tokenId];
    }

    // function userRecordOff(uint256 _recordId) public view returns(UserRecord[] memory){
    //     return userRecordOf(_recordId);
    // }

    function _userRecordOf(uint256 _recordId)
        external
        view
        returns (UserRecord memory)
    {
        return userRecordOf(_recordId);
    }
}