import { useBuyoutOfferModalStore } from 'store/buyout/buyout-offer-modal.store'
import Button from 'components/buttons/button'
import IconEth from 'components/icons/icon-eth'
import IconQuestionCircle from 'components/icons/icon-question-circle'
import SimplePopover from 'components/simple-popover'
import { FixedNumber } from 'ethers'
import Link from 'next/link'
import { ChangeEvent, useMemo, useRef, useState } from 'react'
import BuyoutYourWallet from './buyout-your-wallet'
import { NounImage, NounletImage } from 'components/NounletImage'
import useNounBuyout from 'hooks/useNounBuyout'
import { ONLY_NUMBERS_REGEX } from 'lib/utils/nextBidCalculator'
import useToasts from 'hooks/useToasts'
import { WrappedTransactionReceiptState } from 'lib/utils/tx-with-error-handling'
import { formatOfferDetails } from 'lib/utils/formatBuyoutInfo'
import { NEXT_PUBLIC_MAX_NOUNLETS } from 'config'
import { useSWRConfig } from 'swr'

type ComponentProps = {
  initialFullPriceOffer: FixedNumber
}

export type OfferDetails = {
  fullPrice: FixedNumber
  pricePerNounlet: FixedNumber
  nounletsOffered: FixedNumber
  priceOfOfferedNounlets: FixedNumber
  ethOffered: FixedNumber
}

export default function BuyoutOfferModal(props: ComponentProps): JSX.Element {
  const { cache, mutate: globalMutate } = useSWRConfig()
  const { nounTokenId, myNounlets, submitOffer } = useNounBuyout()
  const { setBuyoutOfferStep, closeBuyoutOfferModal } = useBuyoutOfferModalStore()
  const { toastSuccess, toastError } = useToasts()

  const [isSubmittingOffer, setIsSubmittingOffer] = useState(false)
  // Full price input
  const inputFullPriceRef = useRef<HTMLInputElement>(null)
  const [inputFullPriceValue, setInputFullPriceValue] = useState(
    props.initialFullPriceOffer.toString()
  )
  const handleFullPriceInputOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    const onlyNumbers = ONLY_NUMBERS_REGEX
    try {
      if (event.target.value === '' || onlyNumbers.test(event.target.value)) {
        setInputFullPriceValue(event.target.value)
      }
    } catch (error) {
      console.error('handleBidInputValue error', error)
    }
  }

  const myNounletCount = myNounlets.length

  // Number of nounlets to offer input
  const inputNounletsCountRef = useRef<HTMLInputElement>(null)
  const [inputNounletsCountValue, setInputNounletsCountValue] = useState('' + myNounletCount)
  const isMaxLabelShown = useMemo(() => {
    return inputNounletsCountValue === '' || +inputNounletsCountValue < myNounletCount
  }, [inputNounletsCountValue, myNounletCount])

  const handleNounletsCountInputOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    const onlyNumbers = /^\d+$/
    try {
      if (event.target.value === '' || onlyNumbers.test(event.target.value)) {
        if (+event.target.value > myNounletCount) {
          setInputNounletsCountValue('' + myNounletCount)
        } else {
          setInputNounletsCountValue(event.target.value)
        }
      }
    } catch (error) {
      console.error('handleBidInputValue error', error)
    }
  }
  const handleSetMax = () => {
    setInputNounletsCountValue('' + myNounletCount)
  }

  const offerDetails = useMemo(() => {
    const tempOfferDetails: OfferDetails = {
      fullPrice: FixedNumber.from(0),
      pricePerNounlet: FixedNumber.from(0),
      nounletsOffered: FixedNumber.from(0),
      priceOfOfferedNounlets: FixedNumber.from(0),
      ethOffered: FixedNumber.from(0)
    }

    try {
      if (inputFullPriceValue === '') return tempOfferDetails

      const fullPrice = FixedNumber.from(inputFullPriceValue)
      const pricePerNounlet = fullPrice.divUnsafe(FixedNumber.from(NEXT_PUBLIC_MAX_NOUNLETS))

      tempOfferDetails.fullPrice = fullPrice
      tempOfferDetails.pricePerNounlet = pricePerNounlet

      if (inputNounletsCountValue === '') return tempOfferDetails

      const nounletsOffered = FixedNumber.from(inputNounletsCountValue)
      const priceOfOfferedNounlets = nounletsOffered.mulUnsafe(pricePerNounlet)
      const ethOffered = fullPrice.subUnsafe(priceOfOfferedNounlets)

      tempOfferDetails.nounletsOffered = nounletsOffered
      tempOfferDetails.priceOfOfferedNounlets = priceOfOfferedNounlets
      tempOfferDetails.ethOffered = ethOffered

      return tempOfferDetails
    } catch (error) {
      console.log('Error calculating offerDetails', error)
      return tempOfferDetails
    }
  }, [inputFullPriceValue, inputNounletsCountValue])

  const offerDetailsFormatted = useMemo(() => {
    return formatOfferDetails(offerDetails)
  }, [offerDetails])

  const handleSubmitOffer = async () => {
    try {
      console.log('handleOnSubmit', offerDetails)
      setIsSubmittingOffer(true)
      const response = await submitOffer(offerDetails)

      if (
        response.status === WrappedTransactionReceiptState.SUCCESS ||
        response.status === WrappedTransactionReceiptState.SPEDUP
      ) {
        await globalMutate('VaultBuyout') // TODO maybe remove this
        toastSuccess('Buyout started! 🚀', 'LFG!')
        closeBuyoutOfferModal()
      } else if (response.status === WrappedTransactionReceiptState.ERROR) {
        throw response.data
      } else if (response.status === WrappedTransactionReceiptState.CANCELLED) {
        toastError('Transaction canceled', 'Please try again.')
      }
    } catch (error) {
      console.log(error)
      toastError('Starting buyout failed :(', 'Please try again.')
    } finally {
      setIsSubmittingOffer(false)
    }
  }

  return (
    <div className="step-review-offer">
      <div className="text-px24 font-500">
        <div className="flex items-start space-x-4">
          <div className="w-[84px] flex-shrink-0 rounded-[15px] overflow-hidden">
            <NounImage />
          </div>
          <div className="flex flex-col font-londrina">
            <h4 className="text-px24 text-gray-4">Offer to buy</h4>
            <h2 className="text-px42 font-900 leading-px42">Noun {nounTokenId}</h2>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-8 pt-6">
        <div className="space-y-4">
          <p className="text-px18 font-500 text-gray-4">Your wallet</p>
          <BuyoutYourWallet />
        </div>
        <p className="text-px16 leading-px24 font-500 text-gray-4">
          A pool with your Nounlets & ETH will be created as an offer to other Nounlet owners. They
          will have 7 days to reject the offer by buying your offered Nounlets for ETH.{' '}
          <Link href="/">
            <a className="text-secondary-blue hover:text-secondary-green transition-colors">
              Learn More
            </a>
          </Link>
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <p className="text-px18 font-500 text-gray-4">Offer for full Noun</p>
            <div className="bid-input flex items-center space-x-1 bg-white rounded-px10 px-4 leading-[52px] focus-within:outline-3 focus-within:outline-dashed flex-1">
              <IconEth className="flex-shrink-0 h-[12px] text-gray-3" />
              <input
                value={inputFullPriceValue}
                onChange={handleFullPriceInputOnChange}
                ref={inputFullPriceRef}
                className="text-[25px] font-700 placeholder:text-gray-3 bg-transparent outline-none w-full truncate"
                type="text"
                placeholder="Amount"
              />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center text-gray-4 gap-2">
              <p className="text-px18 font-500">Value per Nounlet</p>
              <SimplePopover>
                <IconQuestionCircle />
                <div>Price of a single Nounlet.</div>
              </SimplePopover>
            </div>
            <div className="bid-input flex items-center space-x-1 rounded-px10 leading-[52px] flex-1">
              <IconEth className="flex-shrink-0 h-[12px] text-gray-3" />
              <p className="text-[25px] font-700 w-full truncate">
                {offerDetailsFormatted.pricePerNounlet}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-black -mx-8 -mb-8 p-8 rounded-b-px24">
          <div className="grid grid-cols-1 sm:grid-cols-[2fr,2fr] gap-6">
            <div className="flex flex-col">
              <p className="text-white text-px18 font-500">Nounlets to offer</p>
              <div className=" mt-4 bid-input flex items-center space-x-1 bg-white rounded-px10 px-4 leading-[52px] outline-primary focus-within:outline-3 focus-within:outline-dashed flex-1">
                <input
                  value={inputNounletsCountValue}
                  onChange={handleNounletsCountInputOnChange}
                  ref={inputNounletsCountRef}
                  className="text-[25px] font-700 placeholder:text-gray-3 bg-transparent outline-none w-full truncate"
                  type="text"
                  placeholder="Amount"
                />
                {isMaxLabelShown && (
                  <Button
                    onClick={handleSetMax}
                    className="link text-secondary-blue text-px16 font-900"
                  >
                    MAX
                  </Button>
                )}
              </div>
              <p className="text-white text-px12 font-500 mt-2">
                = {offerDetailsFormatted.priceOfOfferedNounlets} ETH value
              </p>
            </div>
            <div className="flex flex-col sm:border-l sm:border-white sm:pl-6">
              <p className="text-white text-px18 font-500">ETH offer</p>
              <div className="bid-input flex items-center space-x-1 rounded-px10 leading-[52px] mt-4 flex-grow-1 flex-grow-0">
                <IconEth className="flex-shrink-0 h-[12px] text-white" />
                <p className="text-[25px] font-700 w-full truncate text-white">
                  {offerDetailsFormatted.ethOffered}
                </p>
              </div>
            </div>
          </div>
          <Button
            className="primary w-full mt-6"
            onClick={handleSubmitOffer}
            loading={isSubmittingOffer}
          >
            Submit offer
          </Button>
        </div>
      </div>
    </div>
  )
}
