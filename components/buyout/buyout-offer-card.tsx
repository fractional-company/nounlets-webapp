import { useEthers } from '@usedapp/core'
import Button from 'components/buttons/button'
import IconEth from 'components/icons/icon-eth'
import IconQuestionCircle from 'components/icons/icon-question-circle'
import SimplePopover from 'components/simple-popover'
import { NEXT_PUBLIC_BID_DECIMALS, NEXT_PUBLIC_MAX_NOUNLETS } from 'config'
import { FixedNumber } from 'ethers'
import { formatEther, parseEther } from 'ethers/lib/utils'
import useNounBuyout from 'hooks/useNounBuyout'
import { ONLY_NUMBERS_REGEX } from 'lib/utils/nextBidCalculator'
import Link from 'next/link'
import { ChangeEvent, useContext, useMemo, useRef, useState } from 'react'
import { useBuyoutHowDoesItWorkModalStore } from 'store/buyout/buyout-how-does-it-work-modal.store'
import { useBuyoutOfferModalStore } from 'store/buyout/buyout-offer-modal.store'

export default function BuyoutOfferCard(): JSX.Element {
  const { account } = useEthers()
  const { openBuyoutOfferModal } = useBuyoutOfferModalStore()
  const { nounTokenId, myNounlets, buyoutInfo, offers, nounBackground } = useNounBuyout()
  const { openBuyoutHowDoesItWorkModal } = useBuyoutHowDoesItWorkModalStore()

  const inputRef = useRef<HTMLInputElement>(null)
  const [inputValue, setInputValue] = useState('')

  const isOfferButtonEnabled = useMemo(() => {
    if (account == null) return false
    if (myNounlets.length === 0) return false
    if (inputValue === '') return false
    return true
  }, [account, myNounlets, inputValue])

  const oneNounletPrice = useMemo(() => {
    if (inputValue === '') return '0'
    try {
      const fullPrice = FixedNumber.from(inputValue)
      const singlePrice = fullPrice.divUnsafe(FixedNumber.from(NEXT_PUBLIC_MAX_NOUNLETS))
      return singlePrice.toString()
    } catch (error) {
      console.error('oneNounletPrice error', error)
    }
    return '0'
  }, [inputValue])

  const handleOfferInputValue = (event: ChangeEvent<HTMLInputElement>) => {
    const onlyNumbers = ONLY_NUMBERS_REGEX
    try {
      if (event.target.value === '' || onlyNumbers.test(event.target.value)) {
        setInputValue(event.target.value)
      }
    } catch (error) {
      console.error('handleOfferInputValue', error)
    }
  }

  const handleOpenBuyoutOfferModal = () => {
    openBuyoutOfferModal(FixedNumber.from(inputValue))
  }

  return (
    <div className="buyout-offer-card">
      <div className="bg-gray-2 rounded-px16 py-4 px-6 flex flex-col gap-4 text-black">
        <div className="flex flex-col gap-4 xs:flex-row items-center xs:items-end">
          {myNounlets.length === 0 ? (
            <p className="font-londrina text-secondary-red text-px16 leading-px16 flex-1">
              1 Nounlet required to make an offer
            </p>
          ) : (
            <div className="flex flex-col gap-2 flex-1 text-center xs:text-start">
              <p className="font-londrina text-px18 leading-px18">
                You own{' '}
                <Link href="/governance">
                  <span className="text-secondary-blue cursor-pointer">{myNounlets.length}</span>
                </Link>{' '}
                nounlet
                {myNounlets.length === 1 ? '' : 's'}! 🎉
              </p>
              <p className="font-londrina text-px16 leading-px16">
                Make an offer for the full Noun.
              </p>
            </div>
          )}

          <Button
            onClick={openBuyoutHowDoesItWorkModal}
            className="link font-500 text-secondary-blue hover:text-secondary-green text-px14 leading-px16 flex-shrink-0"
          >
            How does it work?
          </Button>
        </div>
        <div className="bid-input flex items-center space-x-1 bg-gray-1 lg:bg-white rounded-px10 px-4 leading-[52px] focus-within:outline-3 focus-within:outline-dashed flex-1">
          <IconEth className="flex-shrink-0 h-[12px] text-gray-3" />
          <input
            value={inputValue}
            onChange={handleOfferInputValue}
            ref={inputRef}
            className="text-[25px] font-700 placeholder:text-gray-3 bg-transparent outline-none w-full"
            type="text"
            placeholder="Offer amount"
          />
        </div>
        {myNounlets.length > 0 && (
          <div className="flex items-center gap-2">
            <SimplePopover>
              <IconQuestionCircle className="text-gray-3" />
              <div>Price of a single nounlet.</div>
            </SimplePopover>
            <p className="text-gray-4 text-px14 leading-px24 font-500">
              Value for 1 Nounlet will be {oneNounletPrice} ETH.
            </p>
          </div>
        )}
        <Button
          className="primary w-full"
          disabled={!isOfferButtonEnabled}
          onClick={handleOpenBuyoutOfferModal}
        >
          Review Offer
        </Button>
      </div>
    </div>
  )
}
