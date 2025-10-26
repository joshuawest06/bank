import { task } from "hardhat/config";
import { parseUnits } from "ethers";

const TERM_MAP: Record<string, number> = {
  "1m": 0,
  "6m": 1,
  "1y": 2,
  "3y": 3,
  "one-month": 0,
  "six-months": 1,
  "one-year": 2,
  "three-years": 3,
};

task("mint-mock", "Mint MockUSDT tokens to the deployer")
  .addParam("amount", "Token amount without decimals, e.g. 100")
  .setAction(async ({ amount }, hre) => {
    const signer = await hre.ethers.getSigner();
    const token = await hre.ethers.getContract("MockUSDT", signer);
    const parsedAmount = parseUnits(amount, 6);
    const tx = await token.mint(parsedAmount);
    await tx.wait();
    console.log(`Minted ${amount} mUSDT to ${signer.address}`);
  });

task("deposit-bank", "Deposit MockUSDT into the FixedTermBank")
  .addParam("amount", "Token amount without decimals, e.g. 100")
  .addParam(
    "term",
    "Lock term: 1m, 6m, 1y, 3y (aliases: one-month, six-months, one-year, three-years)"
  )
  .setAction(async ({ amount, term }, hre) => {
    const normalizedTerm = String(term).toLowerCase();
    const termValue = TERM_MAP[normalizedTerm];

    if (termValue === undefined) {
      throw new Error("Unknown term. Use 1m, 6m, 1y, or 3y");
    }

    const parsedAmount = parseUnits(amount, 6);
    const signer = await hre.ethers.getSigner();
    const token = await hre.ethers.getContract("MockUSDT", signer);
    const bank = await hre.ethers.getContract("FixedTermBank", signer);
    const bankAddress = await bank.getAddress();

    const hasOperator = await token.isOperator(signer.address, bankAddress);
    if (!hasOperator) {
      const latestBlock = await hre.ethers.provider.getBlock("latest");
      const baseTimestamp = latestBlock?.timestamp ?? Math.floor(Date.now() / 1000);
      const expiry = baseTimestamp + 365 * 24 * 60 * 60;
      const operatorTx = await token.setOperator(bankAddress, expiry);
      await operatorTx.wait();
      console.log(`Operator access granted to bank until ${expiry}`);
    }

    const tx = await bank.deposit(parsedAmount, termValue);
    const receipt = await tx.wait();
    console.log(`Deposit submitted in tx ${receipt?.hash ?? tx.hash}`);
  });

task("withdraw-bank", "Withdraw a matured deposit from the FixedTermBank")
  .addParam("id", "Deposit identifier")
  .setAction(async ({ id }, hre) => {
    const signer = await hre.ethers.getSigner();
    const bank = await hre.ethers.getContract("FixedTermBank", signer);
    const tx = await bank.withdraw(BigInt(id));
    const receipt = await tx.wait();
    console.log(`Withdrawn deposit ${id} in tx ${receipt?.hash ?? tx.hash}`);
  });
