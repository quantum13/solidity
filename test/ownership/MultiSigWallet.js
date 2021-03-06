'use strict';

import expectThrow from '../helpers/expectThrow';

const MultiSigWallet = artifacts.require("./MultiSigWallet.sol");
const Token = artifacts.require("MintableTokenHelper.sol");
const l = console.log;

contract('MultiSigWallet', function(accounts) {

    const role = {
        owner1: accounts[0],
        owner2: accounts[1],
        owner3: accounts[2],

        nobody: accounts[3],
        tokenOwner: accounts[7],
        tokenReceiver: accounts[8]
    };

    async function freshInstance(required=2) {
        return MultiSigWallet.new([accounts[0], accounts[1], accounts[2]], required, {from: accounts[0]});
    }

    async function getOwners(instance) {
        const totalOwners = (await instance.m_numOwners()).toNumber();
        const calls = [];
        for (let i = 0; i < totalOwners; i++)
            calls.push(instance.getOwner(i));
        return Promise.all(calls);
    }

    let token;

    beforeEach(async function () {
        token = await Token.new({from: role.tokenOwner});
    });

    it("send tokens check", async function() {
        const instance = await freshInstance();

        await token.mint(instance.address, 100, {from: role.tokenOwner});
        assert.equal(100, await instance.tokenBalance(token.address));
        assert.equal(100, await token.balanceOf(instance.address));
        assert.equal(0, await token.balanceOf(role.tokenReceiver));

        await expectThrow(instance.sendTokens(token.address, role.tokenReceiver, 10, {from: role.nobody}));

        await instance.sendTokens(token.address, role.tokenReceiver, 10, {from: role.owner1});
        assert.equal(100, await token.balanceOf(instance.address));
        assert.equal(0, await token.balanceOf(role.tokenReceiver));

        await instance.sendTokens(token.address, role.tokenReceiver, 10, {from: role.owner2});
        assert.equal(90, await token.balanceOf(instance.address));
        assert.equal(10, await token.balanceOf(role.tokenReceiver));

        // from zero address
        await instance.sendTokens(0, role.tokenReceiver, 10, {from: role.owner1});
        await expectThrow(instance.sendTokens(0, role.tokenReceiver, 10, {from: role.owner2}));

        // to zero address
        await instance.sendTokens(token.address, 0, 10, {from: role.owner1});
        await expectThrow(instance.sendTokens(token.address, 0, 10, {from: role.owner2}));

        // the same address
        await instance.sendTokens(token.address, token.address, 10, {from: role.owner1});
        await expectThrow(instance.sendTokens(token.address, token.address, 10, {from: role.owner2}));

        // from non contract
        await instance.sendTokens(role.nobody, role.tokenReceiver, 10, {from: role.owner1});
        await expectThrow(instance.sendTokens(role.nobody, role.tokenReceiver, 10, {from: role.owner2}));

        // successful after negative test
        await instance.sendTokens(token.address, role.tokenReceiver, 10, {from: role.owner1});
        await instance.sendTokens(token.address, role.tokenReceiver, 10, {from: role.owner2});
        assert.equal(20, await token.balanceOf(role.tokenReceiver));

    });

    // FIXME TODO reentrancy test

});
