import type { NextPage } from 'next'
import { useEthers } from '@usedapp/core'
import nounletAuctionABI from '../../eth-sdk/abis/rinkeby/nounletAuction.json'

import {Contract} from "@ethersproject/contracts";
import {Fragment, useState} from "react";
import {Dialog, Transition} from "@headlessui/react";
import useOnDisplayAuction from "../../lib/wrappers/onDisplayAuction";

// interface BidHistoryModalProps {
//     auction: any
// }

// @ts-ignore
const BidHistoryModal: NextPage = () => {
    const onDisplayAuction = useOnDisplayAuction();
    const { account, library } = useEthers()
    const [showBidHistoryModal, setShowBidHistoryModal] = useState(false);
    const showBidModalHandler = () => {
        setShowBidHistoryModal(true);
    };
    const dismissBidModalHanlder = () => {
        setShowBidHistoryModal(false);
    };
    const nounletId = 32

    const getLeaves = async () => {
        const nounletAuction = new Contract('0xc7500c1fe21BCEdd62A2953BE9dCb05911394027', nounletAuctionABI, library)
        return await nounletAuction.getLeafNodes();
    }

    const getProofs = async (hashes: any) => {
        const nounletAuction = new Contract('0xc7500c1fe21BCEdd62A2953BE9dCb05911394027', nounletAuctionABI, library)
        return await Promise.all(hashes.map((hash: any, key: any) => nounletAuction.getProof(hashes, key)))
    }

    return (
        <>
            <Dialog.Title className="p-4 text-px24 font-500 border-b border-divider">
                <div className="flex -mt-10">
                    <img src="" alt=""/>
                    <div className="flex flex-col font-londrina">
                        <h4 className="text-px24 text-gray-4">Bids for</h4>
                        <h2 className="text-px42 font-900 leading-px42">Nounlet {nounletId}/100</h2>
                    </div>
                </div>
            </Dialog.Title>
            <div className="p-4">
                <Dialog.Description className="pt-4 pb-8">
                    Lil Nouns DAO auctions require you to switch over to be able to participate.
                </Dialog.Description>
                <Dialog.Description>
                    <b>To get started, please switch your network by following the instructions below:</b>
                </Dialog.Description>
                <ol className="list-decimal mt-4 ml-8">
                    <li>Open Metamask</li>
                    <li>Click the network select dropdown</li>
                    <li>Click on</li>
                </ol>
            </div>
        </>
    );
}

export default BidHistoryModal
