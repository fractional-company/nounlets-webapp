import {GetServerSideProps} from "next";
import client from "../../apollo-client";
import {gql} from "@apollo/client";
import {Vault} from "../models/vault";

interface VaultResponse {
    vault: Vault
}

export const getVault = async (id: string): Promise<Vault> => {
    const { data } = await client.query<VaultResponse>({
        query: gql`
      query MyQuery {
        vault(id: "${id}") {
          id
          noun {
            id
            nounlets {
              id
            }
          }
        }
      }
    `
    })

    return data.vault
}
