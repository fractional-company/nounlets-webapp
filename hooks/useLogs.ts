import { useEffect, useMemo } from 'react'
// import { useBlockNumber } from '@usedapp/core';
// import { useLogsState } from '../store/logs';
// import { EventFilter, filterToKey, Log } from '../lib/utils/logParsing';

// enum LogsState {
//   // The filter is invalid
//   INVALID,
//   // The logs are being loaded
//   LOADING,
//   // Logs are from a previous block number
//   SYNCING,
//   // Tried to fetch logs but received an error
//   ERROR,
//   // Logs have been fetched as of the latest block number
//   SYNCED,
// }

// export interface UseLogsResult {
//   logs: Log[] | undefined;
//   state: LogsState;
// }

// /**
//  * Returns the logs for the given filter as of the latest block, re-fetching from the library every block.
//  * @param filter The logs filter, without `blockHash`, `fromBlock` or `toBlock` defined.
//  */
// export function useLogs(filter: EventFilter | undefined): UseLogsResult {
//   const {addListener, removeListener, logs} = useLogsState()
//   const blockNumber = useBlockNumber();

//   useEffect(() => {
//     if (!filter) return;

//     addListener({ filter });
//     return () => {
//       removeListener({ filter });
//     };
//   }, [addListener, removeListener, filter]);

//   const filterKey = useMemo(() => (filter ? filterToKey(filter) : undefined), [filter]);

//   return useMemo(() => {
//     if (!filterKey || !blockNumber)
//       return {
//         logs: undefined,
//         state: LogsState.INVALID,
//       };

//     const state = logs[filterKey];
//     const result = state?.results;
//     if (!result) {
//       return {
//         state: LogsState.LOADING,
//         logs: undefined,
//       };
//     }

//     if (result.error) {
//       return {
//         state: LogsState.ERROR,
//         logs: undefined,
//       };
//     }

//     return {
//       state: result.blockNumber >= blockNumber ? LogsState.SYNCED : LogsState.SYNCING,
//       logs: result.logs,
//     };
//   }, [blockNumber, filterKey, logs]);
// }
