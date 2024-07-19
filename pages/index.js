import { useState, useEffect } from "react";
import { ethers } from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [owner, setOwner] = useState(undefined);
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [newOwner, setNewOwner] = useState("");

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const atmABI = atm_abi.abi;

  const rpcUrl = "YOUR_RPC_URL_HERE";
  const chainId = "YOUR_CHAIN_ID_HERE";

  useEffect(() => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    } else {
      const provider = new ethers.providers.JsonRpcProvider(rpcUrl, chainId);
      setEthWallet(provider);
    }
    if (ethWallet) {
      ethWallet.request({ method: "eth_accounts" }).then(handleAccount);
    }
  }, [ethWallet]);

  const handleAccount = (accounts) => {
    if (accounts.length > 0) {
      setAccount(accounts[0]);
      getATMContract();
    } else {
      console.log("No account found");
    }
  };

  const connectAccount = async () => {
    if (!ethWallet) {
      alert('MetaMask wallet is required to connect');
      return;
    }
    const accounts = await ethWallet.request({ method: 'eth_requestAccounts' });
    handleAccount(accounts);
  };

  const getATMContract = () => {
    const provider = ethWallet instanceof ethers.providers.JsonRpcProvider 
      ? ethWallet 
      : new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);
    setATM(atmContract);
  };

  const getBalance = async () => {
    if (atm) {
      const balanceBN = await atm.getBalance();
      const balance = ethers.utils.formatEther(balanceBN);
      setBalance(balance);
    }
  };

  const getOwner = async () => {
    if (atm) {
      const currentOwner = await atm.getOwner();
      setOwner(currentOwner);
    }
  };

  const deposit = async () => {
    if (atm) {
      const tx = await atm.deposit({value: ethers.utils.parseEther(depositAmount) });
      await tx.wait();
      getBalance();
    }
  };

  const withdraw = async () => {
    if (atm) {
      const tx = await atm.withdraw(ethers.utils.parseEther(withdrawAmount));
      await tx.wait();
      getBalance();
    }
  };

  const transferAccount = async () => {
    if (atm) {
      const tx = await atm.transferAccount(newOwner);
      await tx.wait();
      getOwner();
    }
  };

  return (
    <div>
      <h1>ATM Contract</h1>
      <button onClick={connectAccount}>
        {account ? `Connected: ${account}` : "Connect MetaMask"}
      </button>
      <div>
        <h2>Current Owner: {owner}</h2>
        <button onClick={getOwner}>Get Current Owner</button>
      </div>
      <div>
        <h2>Balance: {balance}</h2>
        <button onClick={getBalance}>Get Balance</button>
      </div>
      <div>
        <h2>Deposit</h2>
        <input
          type="text"
          value={depositAmount}
          onChange={(e) => setDepositAmount(e.target.value)}
        />
        <button onClick={deposit}>Deposit</button>
      </div>
      <div>
        <h2>Withdraw</h2>
        <input
          type="text"
          value={withdrawAmount}
          onChange={(e) => setWithdrawAmount(e.target.value)}
        />
        <button onClick={withdraw}>Withdraw</button>
      </div>
      <div>
        <h2>Transfer Ownership</h2>
        <input
          type="text"
          value={newOwner}
          onChange={(e) => setNewOwner(e.target.value)}
        />
        <button onClick={transferAccount}>Transfer Ownership</button>
      </div>
    </div>
  );
}
