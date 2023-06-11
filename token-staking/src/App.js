import './App.css';
import React, { useState, useEffect } from 'react';
import contractABI from './StakingTokenAbi.json';

const ethers = require("ethers")
const contractAddress = '0x537946cFfBC4F0f104a4E6F9e2E8030B491E1993';


function App() {

  const [amount, setAmount] = useState('');
  const [account, SetAccount] = useState(null);
  const [stakeAmount, setStakeAmount] = useState('');
  const [contract, setContract] = useState(null);

  useEffect(() => {
    connectWallet();
  }, []);

  const connectWallet = async () => {
    if (window.ethereum) {
      await window.ethereum.enable();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI.abi, signer);
      setContract(contract);
    } else {
      alert('Please install MetaMask to use this application.');
    }
  };

  const mintTokens = async () => {
    if (!amount) {
      alert('Please enter the amount of tokens to mint.');
      return;
    }

    try {
      await contract.mint(account, amount);
      alert(`${amount} tokens minted successfully.`);
      setAmount('');
      SetAccount('');
    } catch (error) {
      console.error(error);
      alert('Failed to mint tokens.');
    }
  };

  const stakeTokens = async () => {
    if (!stakeAmount) {
      alert('Please enter the amount of tokens to stake.');
      return;
    }

    try {
      await contract.stake(stakeAmount);
      alert(`${amount} tokens staked successfully.`);
      setStakeAmount('');
    } catch (error) {
      console.error(error);
      alert('Failed to stake tokens.');
    }
  };

  const unstakeTokens = async () => {
    try {
      await contract.unstake();
      alert('Tokens unstaked successfully.');
    } catch (error) {
      console.error(error);
      alert('Failed to unstake tokens.');
    }
  };

  return (
    <>
      <div className='container'>
      <h1>Token Staking</h1>

      <div className="row">
        <label className="col-form-label my-2" htmlFor="account">Account:</label>
        <input className="form-control col-md-4" type="text" id="account" value={account} 
        onChange={(e) => SetAccount(e.target.value)}></input>

        <label htmlFor="amount" className="col-form-label my-2">Amount:</label>
        <input
          type="number"
          id="amount"
          min="1"
          step="1"
          value={amount}
          className="form-control col-md-4"
          onChange={(e) => setAmount(e.target.value)}
        />
        <button type="button" className="btn btn-primary col-md-4 my-4" onClick={mintTokens}>Mint Tokens</button>
      </div>

      <div className="row">
      <label className="col-form-label" htmlFor="stakeAmount">Stake Amount:</label>
        <input
          type="number"
          id="stakeAmount"
          min="1"
          step="1"
          className="form-control col-md-4"
          value={stakeAmount}
          onChange={(e) => setStakeAmount(e.target.value)}
        />
          <button type="button" className="btn btn-primary col-md-4 my-4" onClick={stakeTokens}>Stake Tokens</button>
      </div>

      <div className="row">
        <button type="button" className="btn btn-primary col-md-4 my-2" onClick={unstakeTokens}>Unstake Tokens</button>
      </div>
    </div>
    </>
  );
}

export default App;
