import { expect } from "chai";
import { ethers } from "hardhat";
import hre from "hardhat";
import { time } from "@nomicfoundation/hardhat-network-helpers";
import { FhevmType } from "@fhevm/mock-utils";

const { parseUnits } = ethers;

async function decryptBalance(token: any, signer: any) {
  const handle = await token.confidentialBalanceOf(await signer.getAddress());
  return await hre.fhevm.userDecryptEuint(
    FhevmType.euint64,
    handle,
    await token.getAddress(),
    signer,
  );
}

async function grantOperator(token: any, signer: any, operator: string, durationSeconds: number) {
  const isAlreadyOperator = await token.isOperator(await signer.getAddress(), operator);
  if (isAlreadyOperator) {
    return;
  }

  const latest = await hre.ethers.provider.getBlock("latest");
  const baseTimestamp = latest?.timestamp ?? Math.floor(Date.now() / 1000);
  const expiry = baseTimestamp + durationSeconds;
  const tx = await token.connect(signer).setOperator(operator, expiry);
  await tx.wait();
}

describe("MockUSDT", () => {
  before(async () => {
    await hre.fhevm.initializeCLIApi();
  });

  it("mints tokens to caller with 6 decimals", async () => {
    const [, user] = await ethers.getSigners();
    const tokenFactory = await ethers.getContractFactory("MockUSDT");
    const token = await tokenFactory.deploy();
    await token.waitForDeployment();

    expect(await token.decimals()).to.equal(6);

    const amount = parseUnits("100", 6);
    await token.connect(user).mint(amount);

    const balance = await decryptBalance(token, user);
    expect(balance).to.equal(amount);
  });
});

describe("FixedTermBank", () => {
  before(async () => {
    await hre.fhevm.initializeCLIApi();
  });

  async function deployBank() {
    const [owner, user, other] = await ethers.getSigners();
    const tokenFactory = await ethers.getContractFactory("MockUSDT");
    const token = await tokenFactory.deploy();
    await token.waitForDeployment();

    const bankFactory = await ethers.getContractFactory("FixedTermBank");
    const bank = await bankFactory.deploy(await token.getAddress());
    await bank.waitForDeployment();

    return { owner, user, other, token, bank };
  }

  it("creates deposits and records metadata", async () => {
    const { user, token, bank } = await deployBank();
    const amount = parseUnits("250", 6);

    await token.connect(user).mint(amount);
    await grantOperator(token, user, await bank.getAddress(), 365 * 24 * 60 * 60);

    await bank.connect(user).deposit(amount, 0);

    const depositIds = await bank.getUserDepositIds(user.address);
    expect(depositIds).to.have.lengthOf(1);

    const deposit = await bank.getDeposit(depositIds[0]);
    expect(deposit.owner).to.equal(user.address);
    expect(deposit.amount).to.equal(amount);
    expect(deposit.withdrawn).to.equal(false);

    const maturity = await bank.maturityTimestamp(depositIds[0]);
    expect(maturity).to.equal(deposit.startTimestamp + BigInt(30 * 24 * 60 * 60));
  });

  it("prevents withdrawals before maturity", async () => {
    const { user, token, bank } = await deployBank();
    const amount = parseUnits("50", 6);

    await token.connect(user).mint(amount);
    await grantOperator(token, user, await bank.getAddress(), 365 * 24 * 60 * 60);

    await bank.connect(user).deposit(amount, 2);

    const deposits = await bank.getUserDepositIds(user.address);
    await expect(bank.connect(user).withdraw(deposits[0])).to.be.revertedWith("Deposit locked");
  });

  it("releases principal and interest after maturity", async () => {
    const { user, token, bank } = await deployBank();
    const amount = parseUnits("100", 6);

    await token.connect(user).mint(amount);
    await grantOperator(token, user, await bank.getAddress(), 365 * 24 * 60 * 60);

    await bank.connect(user).deposit(amount, 0);
    const deposits = await bank.getUserDepositIds(user.address);
    const depositId = deposits[0];

    await time.increase(31 * 24 * 60 * 60);

    await expect(bank.connect(user).withdraw(depositId))
      .to.emit(bank, "Withdrawn")
      .withArgs(user.address, depositId, amount, parseUnits("1", 6));

    const balance = await decryptBalance(token, user);
    expect(balance).to.equal(parseUnits("101", 6));
  });

  it("computes preview interest for longer terms", async () => {
    const { bank } = await deployBank();
    const amount = parseUnits("1000", 6);

    const sixMonthInterest = await bank.preview(1, amount);
    const threeYearInterest = await bank.preview(3, amount);

    expect(sixMonthInterest).to.equal(parseUnits("60", 6));
    expect(threeYearInterest).to.equal(parseUnits("360", 6));
  });
});
