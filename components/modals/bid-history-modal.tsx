import type { NextPage } from 'next'
import {shortenAddress, useEthers} from '@usedapp/core'
import nounletAuctionABI from '../../eth-sdk/abis/rinkeby/nounletAuction.json'

import {Contract} from "@ethersproject/contracts";
import {Fragment, useState} from "react";
import {Dialog, Transition} from "@headlessui/react";
import useOnDisplayAuction from "../../lib/wrappers/onDisplayAuction";
import IconEth from "../icons/icon-eth";
import IconLinkOffsite from "../icons/icon-link-offsite";
import SimpleAddress from "../simple-address";

// interface BidHistoryModalProps {
//     auction: any
// }

// @ts-ignore
const BidHistoryModal: NextPage = () => {
    const nounletId = 32

    const bidHistory = () => ([0, 1, 2, 3, 4, 5, 6].map(el => {
        return (
            <div key={el} className={ `items-center rounded-px10 justify-between p-3 flex bg-white ${el === 0 ? 'opacity-100' : 'opacity-50'}` }>
                <div className="flex flex-col">
                    <SimpleAddress
                        avatarSize={24}
                        address="0x497F34f8A6EaB10652f846fD82201938e58d72E0"
                        className="text-px18 leading-px28 font-700 gap-2 flex-1"
                    />
                    <div className="text-px14 leading-px24">Jun 28, 2022, 1:25PM</div>
                </div>
                <div className="flex items-center">
                    <IconEth className="flex-shrink-0 h-[12px]" />
                    <p className="ml-1 text-px18 leading-px28 font-700">0.12</p>
                    <IconLinkOffsite className="ml-3 flex-shrink-0 h-[12px]" />
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
            <div className="p-4 flex flex-col bg-gray-2 rounded-px10 gap-2">
                {bidHistory()}
            </div>
        </div>
    );
}

export default BidHistoryModal
