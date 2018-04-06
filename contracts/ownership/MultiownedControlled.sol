// Copyright (C) 2017  MixBytes, LLC

// Licensed under the Apache License, Version 2.0 (the "License").
// You may not use this file except in compliance with the License.

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND (express or implied).

pragma solidity ^0.4.15;

import './multiowned.sol';
import './Controlled.sol';

/**
 * Contract which is operated by controller.
 *
 * Provides a way to set up an entity (typically other contract) entitled to control actions of this contract.
 *
 * Controller check is performed by onlyController modifier.
 */
contract MultiownedControlled is Controlled, multiowned {


    function MultiownedControlled(address[] _owners, uint256 _signaturesRequired)
        multiowned(_owners, _signaturesRequired)
        public
    {
        // nothing here
    }

    /**
     * Sets the controller
     */
    function setController(address _controller) external onlymanyowners(sha3(msg.data)) {
        super.setControllerInternal(_controller);
    }

}
