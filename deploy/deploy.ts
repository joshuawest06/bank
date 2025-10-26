import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  const mockUSDT = await deploy("MockUSDT", {
    from: deployer,
    log: true,
  });

  const bank = await deploy("FixedTermBank", {
    from: deployer,
    args: [mockUSDT.address],
    log: true,
  });

  console.log(`MockUSDT contract: ${mockUSDT.address}`);
  console.log(`FixedTermBank contract: ${bank.address}`);
};
export default func;
func.id = "deploy_fixed_term_bank"; // id required to prevent reexecution
func.tags = ["MockUSDT", "FixedTermBank"];
