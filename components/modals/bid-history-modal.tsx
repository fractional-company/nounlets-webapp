import type { NextPage } from 'next'
import {ChainId, getExplorerTransactionLink, shortenAddress, useEthers} from '@usedapp/core'
import nounletAuctionABI from '../../eth-sdk/abis/rinkeby/nounletAuction.json'

import {Contract} from "@ethersproject/contracts";
import {Fragment, useState} from "react";
import {Dialog, Transition} from "@headlessui/react";
import useOnDisplayAuction from "../../lib/wrappers/onDisplayAuction";
import IconEth from "../icons/icon-eth";
import IconLinkOffsite from "../icons/icon-link-offsite";
import SimpleAddress from "../simple-address";
import BigNumber from "bignumber.js";
import {formatEther} from "ethers/lib/utils";
import {Bid} from "../../hooks/useDisplayedNounlet";
import {CHAIN_ID} from "../../pages/_app";

interface BidHistoryModalProps {
    bids: Bid[]
}

// @ts-ignore
const BidHistoryModal = (props: BidHistoryModalProps): JSX.Element => {
    const { bids } = props
    const nounletId = 32

    const bidHistory = () => (bids.map((bid, index) => {
        const ethValue = new BigNumber(formatEther(bid.value)).toFixed(2);
        return (
            <div key={bid.id.toString()} className={ `items-center rounded-px10 justify-between p-3 flex bg-white ${index === 0 ? 'opacity-100' : 'opacity-50'}` }>
                <div className="flex flex-col">
                    <SimpleAddress
                        avatarSize={24}
                        address="0x497F34f8A6EaB10652f846fD82201938e58d72E0"
                        className="text-px18 leading-px28 font-700 gap-2 flex-1"
                    />
                    <div className="text-px14 leading-px24">{bid.timestamp.format('MMM D, YYYY, h:mmA')}</div>
                </div>
                <div className="flex items-center">
                    <IconEth className="flex-shrink-0 h-[12px]" />
                    <p className="ml-1 text-px18 leading-px28 font-700">{ethValue}</p>
                    <a href={getExplorerTransactionLink(bid.txHash, CHAIN_ID as ChainId)} target="_blank" rel="noreferrer">
                        <IconLinkOffsite className="ml-3 flex-shrink-0 h-[12px]" />
                    </a>
                </div>
            </div>
        )
    }))

    return (
        <div className="sm:w-[370px]">
            <Dialog.Title className="p-4 text-px24 font-500 border-b border-divider">
                <div className="flex -mt-10">
                    <img src="" alt=""/>
                    <div className="flex flex-col font-londrina">
                        <h4 className="text-px24 text-gray-4">Bids for</h4>
                        <h2 className="text-px42 font-900 leading-px42">Nounlet {nounletId}/100</h2>
                    </div>
                </div>
            </Dialog.Title>
            <div className="py-4 pl-4 pr-2 bg-gray-2 rounded-px10 h-[17.25rem]">
                <div className="flex flex-col overflow-y-scroll gap-2 h-full custom-scrollbar pr-2">
                    {bidHistory()}
                </div>
            </div>
        </div>
    );
}

export default BidHistoryModal
