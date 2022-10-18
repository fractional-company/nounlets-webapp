/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

const documents = {
    "\n      query Query {\n        vaults {\n          id\n          nounInVault\n        }\n        _meta {\n          block {\n            number\n          }\n        }\n      }\n    ": types.QueryDocument,
};

export function graphql(source: "\n      query Query {\n        vaults {\n          id\n          nounInVault\n        }\n        _meta {\n          block {\n            number\n          }\n        }\n      }\n    "): (typeof documents)["\n      query Query {\n        vaults {\n          id\n          nounInVault\n        }\n        _meta {\n          block {\n            number\n          }\n        }\n      }\n    "];

export function graphql(source: string): unknown;
export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;