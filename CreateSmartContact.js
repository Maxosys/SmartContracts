#!/usr/bin/env node

var Web3 = require('./index.js');
var solc = require('solc');
var abi = require('solc/abi')
var web3 = new Web3();

web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));


//transaction cost.
var gas = 21000;

//current gas price
var gasPrice = web3.eth.gasPrice.toNumber();

//get accounts
var accounts = web3.eth.accounts;

//set default account
web3.eth.defaultAccount = accounts[0];

//get current account balance
var balance = web3.eth.getBalance(accounts[0]);
//see if this is worth sending ^.^
var balanceMinusFee = balance - (gas * gasPrice);

if(balanceMinusFee > 0){



    // solidity code code
    var source = "" +
    "contract test {\n" +
    "   function multiply(uint a) constant returns(uint d) {\n" +
    "       return a * 7;\n" +
    "   }\n" +
    "}\n";

    var output = solc.compile(source);


	var bytecode = output.contracts[':test'].bytecode;
	var abi = JSON.parse(output.contracts[':test'].interface);

	 //console.error(output.contracts[':test'].bytecode);
    //var code = compiled.code;

	var code =  '0x' + bytecode;

    var myContract;

     web3.eth.defaultAccount = web3.eth.coinbase;

      web3.eth.contract(abi).new({data: code, from: web3.eth.coinbase, gas: gas}, function (err, contract) {

      
            if(err) {
                console.error(err);
                return;

            // callback fires twice, we only want the second call when the contract is deployed
            } else if(contract.address){

                myContract = contract;
                console.log('Smart Contact address: ' + myContract.address);
              
            }
        });

}
else
{
    console.log("Balance Minus Fee " + balanceMinusFee);
}
