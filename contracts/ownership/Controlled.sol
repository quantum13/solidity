// Copyright (C) 2017  MixBytes, LLC

// Licensed under the Apache License, Version 2.0 (the "License").
// You may not use this file except in compliance with the License.

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND (express or implied).

pragma solidity ^0.4.15;

/**
 * Contract which is operated by controller.
 *
 * Provides a way to set up an entity (typically other contract) entitled to control actions of this contract.
 *
 * Controller check is performed by onlyController modifier.
 */
contract Controlled {

    address public m_controller;

    event ControllerSet(address controller);
    event ControllerRetired(address was);


    modifier onlyController {
        require(msg.sender == m_controller);
        _;
    }

    function setController(address _controller) external;

    /**
     * Sets the controller. Internal for not forgetting to add access modifier
     */
    function setControllerInternal(address _controller) internal {
        m_controller = _controller;
        ControllerSet(m_controller);
    }

    /**
     * Ability for controller to step down
     */
    function detachController() external onlyController {
        address was = m_controller;
        m_controller = address(0);
        ControllerRetired(was);
    }
}
