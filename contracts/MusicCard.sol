// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MusicCard is ERC721, Ownable {
    uint256 private _nextTokenId;
    
    // ✅ FIX: Pasar msg.sender como initialOwner a Ownable
    constructor() 
        ERC721("DAG Klassical Music Card", "DAGMC") 
        Ownable(msg.sender)
    {}
    
    function mint(address to) public onlyOwner returns (uint256) {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        return tokenId;
    }
    
    function totalSupply() public view returns (uint256) {
        return _nextTokenId;
    }
}
