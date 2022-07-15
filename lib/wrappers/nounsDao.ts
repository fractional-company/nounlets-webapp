import { useContractCall, useContractCalls, useContractFunction, useEthers } from '@usedapp/core';
import { utils, BigNumber as EthersBN } from 'ethers';
import { defaultAbiCoder } from 'ethers/lib/utils';
import { useMemo } from 'react';
import { useLogs } from '../../hooks/useLogs';
import config from '../../config';

export enum Vote {
  AGAINST = 0,
  FOR = 1,
  ABSTAIN = 2,
}

export enum ProposalState {
  UNDETERMINED = -1,
  PENDING,
  ACTIVE,
  CANCELED,
  DEFEATED,
  SUCCEEDED,
  QUEUED,
  EXPIRED,
  EXECUTED,
  VETOED,
}

interface ProposalCallResult {
  id: EthersBN;
  abstainVotes: EthersBN;
  againstVotes: EthersBN;
  forVotes: EthersBN;
  canceled: boolean;
  vetoed: boolean;
  executed: boolean;
  startBlock: EthersBN;
  endBlock: EthersBN;
  eta: EthersBN;
  proposalThreshold: EthersBN;
  proposer: string;
  quorumVotes: EthersBN;
}

interface ProposalDetail {
  target: string;
  value: string;
  functionSig: string;
  callData: string;
}

export interface Proposal {
  id: string | undefined;
  title: string;
  description: string;
  status: ProposalState;
  forCount: number;
  againstCount: number;
  abstainCount: number;
  createdBlock: number;
  startBlock: number;
  endBlock: number;
  eta: Date | undefined;
  proposer: string | undefined;
  proposalThreshold: number;
  quorumVotes: number;
  details: ProposalDetail[];
  transactionHash: string;
}

interface ProposalData {
  data: Proposal[];
  loading: boolean;
}

export interface ProposalTransaction {
  address: string;
  value: string;
  signature: string;
  calldata: string;
}

// const abi = new utils.Interface(NounsDAOABI);
// const nounsDaoContract = new NounsDaoLogicV1Factory().attach(config.addresses.nounsDAOProxy);
// const proposalCreatedFilter = nounsDaoContract.filters?.ProposalCreated(
//   null,
//   null,
//   null,
//   null,
//   null,
//   null,
//   null,
//   null,
//   null,
// );
//
// export const useHasVotedOnProposal = (proposalId: string | undefined): boolean => {
//   const { account } = useEthers();
//
//   // Fetch a voting receipt for the passed proposal id
//   const [receipt] =
//     useContractCall<[any]>({
//       abi,
//       address: nounsDaoContract.address,
//       method: 'getReceipt',
//       args: [proposalId, account],
//     }) || [];
//   return receipt?.hasVoted ?? false;
// };
//
// export const useProposalVote = (proposalId: string | undefined): string => {
//   const { account } = useEthers();
//
//   // Fetch a voting receipt for the passed proposal id
//   const [receipt] =
//     useContractCall<[any]>({
//       abi,
//       address: nounsDaoContract.address,
//       method: 'getReceipt',
//       args: [proposalId, account],
//     }) || [];
//   const voteStatus = receipt?.support ?? -1;
//   if (voteStatus === 0) {
//     return 'Against';
//   }
//   if (voteStatus === 1) {
//     return 'For';
//   }
//   if (voteStatus === 2) {
//     return 'Abstain';
//   }
//
//   return '';
// };
//
// export const useProposalCount = (): number | undefined => {
//   const [count] =
//     useContractCall<[EthersBN]>({
//       abi,
//       address: nounsDaoContract.address,
//       method: 'proposalCount',
//       args: [],
//     }) || [];
//   return count?.toNumber();
// };
//
// export const useProposalThreshold = (): number | undefined => {
//   const [count] =
//     useContractCall<[EthersBN]>({
//       abi,
//       address: nounsDaoContract.address,
//       method: 'proposalThreshold',
//       args: [],
//     }) || [];
//   return count?.toNumber();
// };
//
// const useVotingDelay = (nounsDao: string): number | undefined => {
//   const [blockDelay] =
//     useContractCall<[EthersBN]>({
//       abi,
//       address: nounsDao,
//       method: 'votingDelay',
//       args: [],
//     }) || [];
//   return blockDelay?.toNumber();
// };
//
// const countToIndices = (count: number | undefined) => {
//   return typeof count === 'number' ? new Array(count).fill(0).map((_, i) => [i + 1]) : [];
// };
//
// const useFormattedProposalCreatedLogs = () => {
//   const useLogsResult = useLogs(proposalCreatedFilter);
//
//   return useMemo(() => {
//     return useLogsResult?.logs?.map(log => {
//       const { args: parsed } = abi.parseLog(log);
//       return {
//         description: parsed.description,
//         transactionHash: log.transactionHash,
//         details: parsed.targets.map((target: string, i: number) => {
//           const signature = parsed.signatures[i];
//           const value = parsed[3][i];
//           const [name, types] = signature.substr(0, signature.length - 1)?.split('(');
//           if (!name || !types) {
//             return {
//               target,
//               functionSig: name === '' ? 'transfer' : name === undefined ? 'unknown' : name,
//               callData: types ? types : value ? `${utils.formatEther(value)} ETH` : '',
//             };
//           }
//           const calldata = parsed.calldatas[i];
//           const decoded = defaultAbiCoder.decode(types.split(','), calldata);
//           return {
//             target,
//             functionSig: name,
//             callData: decoded.join(),
//             value: value.gt(0) ? `{ value: ${utils.formatEther(value)} ETH }` : '',
//           };
//         }),
//       };
//     });
//   }, [useLogsResult]);
// };
//
// export const useCastVote = () => {
//   const { send: castVote, state: castVoteState } = useContractFunction(
//     nounsDaoContract,
//     'castVote',
//   );
//   return { castVote, castVoteState };
// };
//
// export const useCastVoteWithReason = () => {
//   const { send: castVoteWithReason, state: castVoteWithReasonState } = useContractFunction(
//     nounsDaoContract,
//     'castVoteWithReason',
//   );
//   return { castVoteWithReason, castVoteWithReasonState };
// };
//
// export const usePropose = () => {
//   const { send: propose, state: proposeState } = useContractFunction(nounsDaoContract, 'propose');
//   return { propose, proposeState };
// };
//
// export const useQueueProposal = () => {
//   const { send: queueProposal, state: queueProposalState } = useContractFunction(
//     nounsDaoContract,
//     'queue',
//   );
//   return { queueProposal, queueProposalState };
// };
//
// export const useExecuteProposal = () => {
//   const { send: executeProposal, state: executeProposalState } = useContractFunction(
//     nounsDaoContract,
//     'execute',
//   );
//   return { executeProposal, executeProposalState };
// };
