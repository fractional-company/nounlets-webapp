type ComponentProps = {}

export default function BuyoutHowDoesItWorkModal(props: ComponentProps): JSX.Element {
  return (
    <div className="buyout-offer-modal">
      <div className="flex flex-col gap-8">
        <div className="font-londrina">
          <p className="text-px24 text-gray-4">Offer to buy Noun</p>
          <p className="text-px42 leading-[40px]">How does it work?</p>
        </div>
        <div className="space-y-4">
          <div className="space-y-4 text-gray-4 text-px14 font-500">
            <div className="p-4 bg-gray-2 rounded-px16">
              <p className="font-londrina text-px24 text-center">Submitting an offer</p>
            </div>
            <p>
              You must connect a wallet holding at least 1 Nounlet to make an offer for the full
              Noun. An offer requires both Nounlets and ETH to be submitted. Once submitted, the
              Nounlets and ETH are sent and held within a contract for 7 days for review (or until
              the offer is rejected).
            </p>
            <p>
              Once you connect your wallet, enter your offer amount (in ETH) and proceed to the next
              step to submit 1 or more Nounlets with your offer. Before submitting, view the
              calculated value (Offer Value/100) for your Nounlets. This is an important factor for
              the review period.
            </p>
          </div>

          <div className="space-y-4 text-gray-4 text-px14 font-500">
            <div className="p-4 bg-gray-2 rounded-px16">
              <p className="font-londrina text-px24 text-center">7 day review period</p>
            </div>
            <p>
              Offers are valid for 7 days from the date and time of submission. During this time,
              people from the community have the opportunity to evaluate the offer and decide
              whether to act and reject it, or do nothing and accept it. If the offer is rejected
              before the 7 day review period is finished, all ETH from the contract is returned to
              the offer initiator (minus gas).
            </p>
          </div>

          <div className="space-y-4 text-gray-4 text-px14 font-500">
            <div className="p-4 bg-gray-2 rounded-px16">
              <p className="font-londrina text-px24 text-center">
                Accepting and rejecting the offer
              </p>
            </div>
            <p>
              To reject an offer, people must buy each Nounlet submitted in the offer at the value
              proposed (Offer Value/100) until none remain in the contract.
            </p>
            <p>
              If all Nounlets are purchased, the offer is immediately rejected and the offer amount
              in ETH is returned from the contract (minus gas) to the offer initiator.
            </p>
            <p>
              If at least 1 Nounlet remains in the contract when the review period ends, the offer
              is automatically accepted. Once accepted, the person who made the offer can claim the
              Noun at any time and Nounlet owners can claim their respective amount of ETH from the
              contract in exchange for their Nounlet(s).
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
