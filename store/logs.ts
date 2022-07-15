import { EventFilter, filterToKey, Log } from '../lib/utils/logParsing';
import create from "zustand";
import {immer} from "zustand/middleware/immer";

export interface LogsState {
  logs: {
      [filterKey: string]: {
          listeners: number;
          fetchingBlockNumber?: number;
          results?:
              | {
              blockNumber: number;
              logs: Log[];
              error?: undefined;
          }
              | {
              blockNumber: number;
              logs?: undefined;
              error: true;
          };
      }
  },
    addListener: ({ filter }: {filter: EventFilter}) => void
    fetchingLogs: ({ filters, blockNumber }: { filters: EventFilter[], blockNumber: number }) => void
    fetchedLogs: ({ filter, results }: { filter: EventFilter, results: { blockNumber: number; logs: Log[] } }) => void
    fetchedLogsError: ({ filter, blockNumber }: { blockNumber: number; filter: EventFilter }) => void
    removeListener: ({ filter }: {filter: EventFilter}) => void
}

export const useLogsState = create(
    immer<LogsState>((set) => ({
        logs: {},
      addListener({ filter }: {filter: EventFilter}) {
        set((state) => {
          const key = filterToKey(filter);
          if (!state.logs[key])
            state.logs[key] = {
              listeners: 1,
            };
          else state.logs[key].listeners++;
        })
      },
      fetchingLogs({ filters, blockNumber }: { filters: EventFilter[], blockNumber: number }) {
          set((state) => {
              for (const filter of filters) {
                  const key = filterToKey(filter);
                  if (!state.logs[key]) continue;
                  state.logs[key].fetchingBlockNumber = blockNumber;
              }
          })
      },
      fetchedLogs({ filter, results }: { filter: EventFilter, results: { blockNumber: number; logs: Log[] } }) {
          set((state) => {
              const key = filterToKey(filter);
              const fetchState = state.logs[key];
              if (
                  !fetchState ||
                  (fetchState.results && fetchState.results.blockNumber > results.blockNumber)
              ) {
                  return;
              }
              fetchState.results = results;
          })
      },
      fetchedLogsError({ filter, blockNumber }: { blockNumber: number; filter: EventFilter }) {
          set((state) => {
              const key = filterToKey(filter);
              const fetchState = state.logs[key];
              if (!fetchState || (fetchState.results && fetchState.results.blockNumber > blockNumber))
                  return;
              fetchState.results = {
                  blockNumber,
                  error: true,
              };
          })
      },
      removeListener({ filter }: { filter: EventFilter }) {
          set((state) => {
              const key = filterToKey(filter);
              if (!state.logs[key]) return;
              state.logs[key].listeners--;
          })
      },
    }))
)
