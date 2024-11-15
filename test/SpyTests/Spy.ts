import { expect } from "chai";

import { awaitAllDecryptionResults } from "../asyncDecrypt";
import { createInstances } from "../instance";
import { getSigners, initSigners } from "../signers";
import { deploySpyFixture } from "./spy.fixture";

describe("Spy tests", function () {
  before(async function () {
    await initSigners();
    this.signers = await getSigners();
  });

  beforeEach(async function () {
    const contract = await deploySpyFixture();
    this.contractAddress = await contract.getAddress();
    this.spy = contract;
    this.instances = await createInstances(this.signers);
  });

  it("should set the requirement by the 0th checkpoint (bob) and not be seen by 1st checkpoint (carol)", async function () {
    const input = this.instances.bob.createEncryptedInput(this.contractAddress, this.signers.bob.address);
    input.add32(100);
    const encryptedCheckpoint = input.encrypt();
    const spyContractForBob = this.spy.connect(this.signers.bob);
    const tx = await spyContractForBob["setSecretRequirement(uint8,bytes32,bytes)"](
      0,
      encryptedCheckpoint.handles[0],
      encryptedCheckpoint.inputProof,
    );
    await tx.wait();

    const reqHandleCarol = await this.spy.secretRequirements();
    const { publicKey: publicKeyCarol, privateKey: privateKeyCarol } = this.instances.carol.generateKeypair();
    const eip712 = this.instances.alice.createEIP712(publicKeyCarol, this.contractAddress);
    const signatureCarol = await this.signers.carol.signTypedData(
      eip712.domain,
      { Reencrypt: eip712.types.Reencrypt },
      eip712.message,
    );
    try {
      this.instances.carol.reencrypt(
        reqHandleCarol,
        privateKeyCarol,
        publicKeyCarol,
        signatureCarol.replace("0x", ""),
        this.contractAddress,
        this.signers.carol.address,
      );
      return expect.fail("Carol is not authorized to reencrypt this handle!");
    } catch (error: unknown) {
      expect((error as Error).message).to.equal("Carol is not authorized to reencrypt this handle!");
    }
  });

  it("should set the requirement by the 0th checkpoint (bob) and seen by alice", async function () {
    const input = this.instances.bob.createEncryptedInput(this.contractAddress, this.signers.bob.address);
    input.add32(100);
    const encryptedCheckpoint = input.encrypt();
    const spyContractForBob = this.spy.connect(this.signers.bob);
    const tx = await spyContractForBob["setSecretRequirement(uint8,bytes32,bytes)"](
      0,
      encryptedCheckpoint.handles[0],
      encryptedCheckpoint.inputProof,
      { gasLimit: 5000000 },
    );
    await tx.wait();

    const reqHandleAlice = await this.spy.getSecretRequirements();
    const { publicKey: publicKeyAlice, privateKey: privateKeyAlice } = this.instances.alice.generateKeypair();
    const eip712 = this.instances.alice.createEIP712(publicKeyAlice, this.contractAddress);
    const signatureAlice = await this.signers.alice.signTypedData(
      eip712.domain,
      { Reencrypt: eip712.types.Reencrypt },
      eip712.message,
    );
    const requirements = await this.instances.alice.reencrypt(
      reqHandleAlice,
      privateKeyAlice,
      publicKeyAlice,
      signatureAlice.replace("0x", ""),
      this.contractAddress,
      this.signers.alice.address,
    );
    expect(requirements).to.equal(100);
  });
});
