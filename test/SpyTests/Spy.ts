import { expect } from "chai";
import { log } from "console";

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

  // it("the requirement for the 0th checkpoint should not be set by Alice", async function () {
  //   const input = this.instances.alice.createEncryptedInput(this.contractAddress, this.signers.alice.address);
  //   input.add32(100);
  //   const encryptedCheckpoint = input.encrypt();
  //   const spyContractForAlice = this.spy.connect(this.signers.alice);

  //   try {
  //     const tx = await spyContractForAlice["setSecretRequirement(uint8,bytes32,bytes)"](
  //       0,
  //       encryptedCheckpoint.handles[0],
  //       encryptedCheckpoint.inputProof,
  //     );
  //     await tx.wait();
  //     return expect.fail("Alice cannot set the requirement for Bob!");
  //   } catch (error: unknown) {
  //     expect((error as Error).message).to.equal(
  //       "rpc error: code = Unknown desc = execution reverted: Given checkpoint byte can not be accessed from this address",
  //     );
  //   }
  // });

  // it("should set the requirement by the 0th checkpoint (bob) and not be seen by 1st checkpoint (carol)", async function () {
  //   const input = this.instances.bob.createEncryptedInput(this.contractAddress, this.signers.bob.address);
  //   input.add32(100);
  //   const encryptedCheckpoint = input.encrypt();
  //   const spyContractForBob = this.spy.connect(this.signers.bob);
  //   const tx = await spyContractForBob["setSecretRequirement(uint8,bytes32,bytes)"](
  //     0,
  //     encryptedCheckpoint.handles[0],
  //     encryptedCheckpoint.inputProof,
  //   );
  //   await tx.wait();

  //   const reqHandleCarol = await this.spy.secretRequirements();
  //   const { publicKey: publicKeyCarol, privateKey: privateKeyCarol } = this.instances.carol.generateKeypair();
  //   const eip712 = this.instances.alice.createEIP712(publicKeyCarol, this.contractAddress);
  //   const signatureCarol = await this.signers.carol.signTypedData(
  //     eip712.domain,
  //     { Reencrypt: eip712.types.Reencrypt },
  //     eip712.message,
  //   );
  //   try {
  //     this.instances.carol.reencrypt(
  //       reqHandleCarol,
  //       privateKeyCarol,
  //       publicKeyCarol,
  //       signatureCarol.replace("0x", ""),
  //       this.contractAddress,
  //       this.signers.carol.address,
  //     );
  //     return expect.fail("Carol is not authorized to reencrypt this handle!");
  //   } catch (error: unknown) {
  //     expect((error as Error).message).to.equal("Carol is not authorized to reencrypt this handle!");
  //   }
  // });

  // it("should set the requirement by the 0th checkpoint (bob) and seen by alice", async function () {
  //   const input = this.instances.bob.createEncryptedInput(this.contractAddress, this.signers.bob.address);
  //   input.add32(100);
  //   const encryptedCheckpoint = input.encrypt();
  //   const spyContractForBob = this.spy.connect(this.signers.bob);
  //   const tx = await spyContractForBob["setSecretRequirement(uint8,bytes32,bytes)"](
  //     0,
  //     encryptedCheckpoint.handles[0],
  //     encryptedCheckpoint.inputProof,
  //     { gasLimit: 5000000 },
  //   );
  //   await tx.wait();

  //   const reqHandleAlice = await this.spy.getSecretRequirements();
  //   const { publicKey: publicKeyAlice, privateKey: privateKeyAlice } = this.instances.alice.generateKeypair();
  //   const eip712 = this.instances.alice.createEIP712(publicKeyAlice, this.contractAddress);
  //   const signatureAlice = await this.signers.alice.signTypedData(
  //     eip712.domain,
  //     { Reencrypt: eip712.types.Reencrypt },
  //     eip712.message,
  //   );
  //   const requirements = await this.instances.alice.reencrypt(
  //     reqHandleAlice,
  //     privateKeyAlice,
  //     publicKeyAlice,
  //     signatureAlice.replace("0x", ""),
  //     this.contractAddress,
  //     this.signers.alice.address,
  //   );
  //   expect(requirements).to.equal(100);
  // });

  // it("should set the requirement by the 3rd checkpoint (eve) and seen by alice", async function () {
  //   const input = this.instances.eve.createEncryptedInput(this.contractAddress, this.signers.eve.address);
  //   input.add32(17);
  //   const encryptedCheckpoint = input.encrypt();
  //   const spyContractForEve = this.spy.connect(this.signers.eve);
  //   const tx = await spyContractForEve["setSecretRequirement(uint8,bytes32,bytes)"](
  //     3,
  //     encryptedCheckpoint.handles[0],
  //     encryptedCheckpoint.inputProof,
  //     { gasLimit: 5000000 },
  //   );
  //   await tx.wait();

  //   const reqHandleAlice = await this.spy.getSecretRequirements();
  //   const { publicKey: publicKeyAlice, privateKey: privateKeyAlice } = this.instances.alice.generateKeypair();
  //   const eip712 = this.instances.alice.createEIP712(publicKeyAlice, this.contractAddress);
  //   const signatureAlice = await this.signers.alice.signTypedData(
  //     eip712.domain,
  //     { Reencrypt: eip712.types.Reencrypt },
  //     eip712.message,
  //   );
  //   const requirements = await this.instances.alice.reencrypt(
  //     reqHandleAlice,
  //     privateKeyAlice,
  //     publicKeyAlice,
  //     signatureAlice.replace("0x", ""),
  //     this.contractAddress,
  //     this.signers.alice.address,
  //   );
  //   expect(requirements).to.equal(285212672);
  // });

  // it("should set the requirement by the 3rd checkpoint (eve) after truncating 273 -> 11 and seen by alice", async function () {
  //   const input = this.instances.eve.createEncryptedInput(this.contractAddress, this.signers.eve.address);
  //   input.add32(273);
  //   const encryptedCheckpoint = input.encrypt();
  //   const spyContractForEve = this.spy.connect(this.signers.eve);
  //   const tx = await spyContractForEve["setSecretRequirement(uint8,bytes32,bytes)"](
  //     3,
  //     encryptedCheckpoint.handles[0],
  //     encryptedCheckpoint.inputProof,
  //     { gasLimit: 5000000 },
  //   );
  //   await tx.wait();

  //   const reqHandleAlice = await this.spy.getSecretRequirements();
  //   const { publicKey: publicKeyAlice, privateKey: privateKeyAlice } = this.instances.alice.generateKeypair();
  //   const eip712 = this.instances.alice.createEIP712(publicKeyAlice, this.contractAddress);
  //   const signatureAlice = await this.signers.alice.signTypedData(
  //     eip712.domain,
  //     { Reencrypt: eip712.types.Reencrypt },
  //     eip712.message,
  //   );
  //   const requirements = await this.instances.alice.reencrypt(
  //     reqHandleAlice,
  //     privateKeyAlice,
  //     publicKeyAlice,
  //     signatureAlice.replace("0x", ""),
  //     this.contractAddress,
  //     this.signers.alice.address,
  //   );
  //   expect(requirements).to.equal(285212672);
  // });

  it("should set the requirements by all checkpoints and seen by alice", async function () {
    const inputBob = this.instances.bob.createEncryptedInput(this.contractAddress, this.signers.bob.address);
    inputBob.add32(120); // 0x78
    const encryptedCheckpointBob = inputBob.encrypt();
    const spyContractForBob = this.spy.connect(this.signers.bob);
    const txBob = await spyContractForBob["setSecretRequirement(uint8,bytes32,bytes)"](
      0,
      encryptedCheckpointBob.handles[0],
      encryptedCheckpointBob.inputProof,
      { gasLimit: 3000000 },
    );
    await txBob.wait();

    const inputCarol = this.instances.carol.createEncryptedInput(this.contractAddress, this.signers.carol.address);
    inputCarol.add32(86); // 0x56
    const encryptedCheckpointCarol = inputCarol.encrypt();
    const spyContractForCarol = this.spy.connect(this.signers.carol);
    const txCarol = await spyContractForCarol["setSecretRequirement(uint8,bytes32,bytes)"](
      1,
      encryptedCheckpointCarol.handles[0],
      encryptedCheckpointCarol.inputProof,
      { gasLimit: 3000000 },
    );
    await txCarol.wait();

    const inputDave = this.instances.dave.createEncryptedInput(this.contractAddress, this.signers.dave.address);
    inputDave.add32(52); // 0x34
    const encryptedCheckpointDave = inputDave.encrypt();
    const spyContractForDave = this.spy.connect(this.signers.dave);
    const txDave = await spyContractForDave["setSecretRequirement(uint8,bytes32,bytes)"](
      2,
      encryptedCheckpointDave.handles[0],
      encryptedCheckpointDave.inputProof,
      { gasLimit: 3000000 },
    );
    await txDave.wait();

    const inputEve = this.instances.eve.createEncryptedInput(this.contractAddress, this.signers.eve.address);
    inputEve.add32(18); // 0x12
    const encryptedCheckpointEve = inputEve.encrypt();
    const spyContractForEve = this.spy.connect(this.signers.eve);
    const txEve = await spyContractForEve["setSecretRequirement(uint8,bytes32,bytes)"](
      3,
      encryptedCheckpointEve.handles[0],
      encryptedCheckpointEve.inputProof,
      { gasLimit: 3000000 },
    );
    await txEve.wait();

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
    expect(requirements).to.equal(305419896); // 0x12345678
  });
});
