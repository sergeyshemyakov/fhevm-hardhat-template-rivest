import { ethers } from "hardhat";

import type { Spy } from "../../types";
import { getSigners } from "../signers";

export async function deploySpyFixture(): Promise<Spy> {
  const signers = await getSigners();

  const contractFactory = await ethers.getContractFactory("Spy");
  const contract = await contractFactory
    .connect(signers.alice)
    .deploy(
      signers.alice.address,
      signers.bob.address,
      signers.carol.address,
      signers.dave.address,
      signers.eve.address,
    );
  await contract.waitForDeployment();
  console.log("Spy Contract Address is:", await contract.getAddress());

  return contract;
}
