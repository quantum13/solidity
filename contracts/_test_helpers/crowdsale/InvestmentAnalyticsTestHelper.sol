// Copyright (C) 2017  MixBytes, LLC

// Licensed under the Apache License, Version 2.0 (the "License").
// You may not use this file except in compliance with the License.

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND (express or implied).

pragma solidity ^0.4.15;

import '../../crowdsale/InvestmentAnalytics.sol';


contract InvestmentAnalyticsTestHelper is InvestmentAnalytics {
    function createMorePaymentChannels(uint limit) external returns (uint) {
        return createMorePaymentChannelsInternal(limit);
    }

    function iaOnInvested(address /*investor*/, uint /*payment*/, bool /*usingPaymentChannel*/) internal {
    }
}
