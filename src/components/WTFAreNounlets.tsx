import { IS_DEVELOP } from 'config'
import Link from 'next/link'
import { useState } from 'react'
import Button from './common/buttons/Button'
import { NounImage } from './common/NounletImage'
import SimpleAccordion from './common/simple/SimpleAccordion'
import HomeNounletsOnAuction from './home/HomeNounletsOnAuction'

export default function WTFAreNounlets(props: { showCurrentAuction: boolean }) {
  const nounID = IS_DEVELOP ? '1' : '315'
  const [openAccordionIndex, setOpenAccordionIndex] = useState(-1)

  return (
    <div className="space-y-14 lg:space-y-20" id="faq">
      <div className="space-y-6 overflow-hidden rounded-px20 bg-gray-1 py-12 px-4 text-center lg:px-12">
        <h2 className="text-center font-londrina text-[56px] font-900 leading-[62px] lg:text-[72px] lg:leading-[80px]">
          <span className="text-primary">Q:</span> WTF ARE NOUNLETS?
        </h2>
        <p className="text-px16 font-500 leading-px22 text-gray-4 lg:text-px22 lg:leading-px28">
          Nounlets are an experiment to allow for collective ownership over an individual Noun. Each
          Nounlet represents 1% of the vaulted Noun and has a vote in delegating the Noun’s
          governance rights. The chosen delegate can vote in governance and submit governance
          proposals (if they have 2 Nouns delegated to them).
          <br />
          <br />
          Learn more below, or by visiting and reviewing the{' '}
          <a
            href="https://medium.com/tessera-nft/nounlets-explained-faq-57e9bc537d93"
            target="_blank"
            className="font-700 text-secondary-blue"
            rel="noreferrer"
          >
            Nouns DAO homepage.
          </a>
          {/* <br />
          <br />
          In addition to participating in governance, all Nounlet owners are invited to{' '}
          <a
            href="https://medium.com/tessera-nft/nounlets-explained-faq-57e9bc537d93"
            target="_blank"
            className="font-700 text-secondary-blue"
            rel="noreferrer"
          >
            join the Nounlets community in our Discord.
          </a> */}
        </p>
      </div>

      <div className="flex flex-col items-center gap-3 lg:flex-row">
        <h2 className="flex-1 font-londrina text-[48px] font-900 leading-[58px] lg:text-[96px] lg:leading-[116px]">
          <span className="text-primary">A:</span> COLLECTIVE OWNERSHIP OF NOUNS!
        </h2>

        <div className="relative w-full max-w-[400px] flex-1 pt-[48px]">
          <div className="aspect-square w-full">
            <NounImage id={nounID} />
          </div>
          <Link href={`/noun/${nounID}/nounlet/1`}>
            <div className="absolute top-0 right-3 lg:right-auto lg:-left-12">
              <div className="space-y-3 rounded-px16 bg-gray-1 p-4">
                <h1 className="font-londrina text-px36 leading-px42">Noun {nounID}</h1>
                <Button className="primary">See Nounlets of {nounID}</Button>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {props.showCurrentAuction && (
        <div className="overflow-hidden rounded-px20">
          <HomeNounletsOnAuction />
        </div>
      )}

      <div className="flex flex-col space-y-12">
        <SimpleAccordion
          title="Summary"
          isOpen={openAccordionIndex === 0}
          onOpen={() => setOpenAccordionIndex(0)}
          onClose={() => setOpenAccordionIndex(-1)}
        >
          <ul className="list-disc space-y-2 pl-6">
            <li>
              Nounlets artwork is in the{' '}
              <a
                href="https://creativecommons.org/publicdomain/zero/1.0/"
                className="text-secondary-blue"
                target="_blank"
                rel="noreferrer"
              >
                public domain.
              </a>
            </li>
            <li>
              One Nounlet is trustlessly auctioned every 25 minutes (subject to change) until all
              100 Nounlets have been sold.
            </li>
            <li>
              98% of auction proceeds are trustlessly sent to the original Noun owner. 2% of auction
              proceeds are sent to Tessera.
            </li>
            <li>Settlement of one Nounlet auction kicks off the next.</li>
            <li>The elected delegate of the Noun is considered a member of NounsDAO.</li>
            <li>One Nounlet is equal to one vote for a delegate.</li>
            <li>Artwork is generative and stored directly on-chain (not IPFS).</li>
            <li>
              Nounlets will all have the same head trait as the Vaulted Noun, but the remaining
              attributes will vary.
            </li>
          </ul>
        </SimpleAccordion>

        <SimpleAccordion
          title="Tributing"
          isOpen={openAccordionIndex === 1}
          onOpen={() => setOpenAccordionIndex(1)}
          onClose={() => setOpenAccordionIndex(-1)}
          id="faq-tributing"
        >
          <div className="space-y-4">
            <p>
              Noun owners who want to participate in Nounlets can tribute their Noun to be
              auctioned. By tributing your Noun, you agree to have your Noun auctioned at any time.
              You will need to sign a transaction allowing the Nounlets smart contracts to transfer
              the Noun from your wallet to a Nounlets Vault to be auctioned. If you change your
              mind, you can withdraw your tributed Noun as long as the auction has not started.
            </p>
            <p>
              The Tessera team will work with the community to decide which Noun will be auctioned
              next and when the Nounlets auction will start. Tessera does not guarantee that all
              tributed Nouns will be auctioned. There is no set cadence that auctions will occur.
            </p>
          </div>
        </SimpleAccordion>

        <SimpleAccordion
          title="25 Minute Auctions"
          isOpen={openAccordionIndex === 2}
          onOpen={() => setOpenAccordionIndex(2)}
          onClose={() => setOpenAccordionIndex(-1)}
        >
          <div className="space-y-4">
            <p>
              The Nounlets auction contract will act as a self-sufficient Noun generation and
              distribution mechanism, auctioning one Nounlet every 25 minutes until all 100 Nounlets
              are sold. 98% of auction proceeds are trustlessly sent to the original Noun owner. 2%
              of auction proceeds are sent to Tessera.
            </p>
            <p>
              Each time an auction is settled, the settlement transaction will cause a new Nounlet
              to be minted and a new 25 minute auction to begin. Bids within the last 10 minutes
              reset the auction timer to 10 minutes.
            </p>
            <p>
              While settlement is most heavily incentivized for the winning bidder, it can be
              triggered by anyone, allowing the system to trustlessly auction Nounlets as long as
              Ethereum is operational and there are interested bidders.
            </p>
          </div>
        </SimpleAccordion>
        <SimpleAccordion
          title="Delegating"
          isOpen={openAccordionIndex === 3}
          onOpen={() => setOpenAccordionIndex(3)}
          onClose={() => setOpenAccordionIndex(-1)}
        >
          <div className="space-y-4">
            <p>
              All Nounlet owners will be able to vote on a delegate. The delegate will be elected
              on-chain in the Nouns contract. The active delegate will be able to vote in governance
              and submit governance proposals (if they have 2 total Nouns delegated to them). Each
              Nounlet has 1 vote on the delegate.
            </p>
          </div>
        </SimpleAccordion>
        <SimpleAccordion
          title="Optimistic Buyouts"
          isOpen={openAccordionIndex === 4}
          onOpen={() => setOpenAccordionIndex(4)}
          onClose={() => setOpenAccordionIndex(-1)}
          id="faq-optimistic-buyout"
        >
          <div className="space-y-4">
            <p>
              Reconstitution is only possible after all 100 Nounlets have been sold. The Noun is
              able to be purchased and reconstituted (meaning one person buys the entire Noun from
              the Vault) using what we call an optimistic buyout.
            </p>
            <p>
              Someone who wants to buy the Vaulted Noun makes an offer to buy the Noun out of the
              Vault, which the Nounlet holders implicitly accept if the rejection criteria of
              purchasing all the bidder’s Nounlets are not met.
            </p>
            <p>
              In this mechanism, the bidder must name a price and put up at least 1 of their
              Nounlets as collateral. All other participants (whether they currently hold a Nounlet
              or not) are able to reject this offer by purchasing all of the Nounlets used as
              collateral at the fixed price proposed by the buyer.
            </p>
            <p>
              Optimistic buyouts will last for 7 days before being accepted.{' '}
              <span className="font-700 text-black">
                If all Nounlets are purchased at the implied valuation before 7 days have passed,
                the buyout ends and is rejected.
              </span>
            </p>
            {/* <p>
              For more information visit the{' '}
              <a
                target="_blank"
                rel="noreferrer"
                href="https://medium.com/tessera-nft/nounlets-explained-faq-57e9bc537d93"
                className="text-secondary-blue"
              >
                FAQ
              </a>
            </p> */}
          </div>
        </SimpleAccordion>
        <SimpleAccordion
          title="Nounlet Traits"
          isOpen={openAccordionIndex === 5}
          onOpen={() => setOpenAccordionIndex(5)}
          onClose={() => setOpenAccordionIndex(-1)}
        >
          <div className="space-y-4">
            <p>
              Nounlets are generated randomly based on Ethereum block hashes. All Nounlets will have
              the same head as the Vaulted Noun.
            </p>
            <p>As of this writing, Nounlet traits contain:</p>
            <ul className="list-disc space-y-2 pl-6">
              <li>backgrounds (2)</li>
              <li>bodies (30)</li>
              <li>accessories (137)</li>
              <li className="font-700 text-black">heads (1)</li>
              <li>glasses (21)</li>
            </ul>
            <p>
              You can experiment with off-chain Noun generation at the{' '}
              <a
                target="_blank"
                rel="noreferrer"
                href="https://nouns.wtf/playground"
                className="text-secondary-blue"
              >
                Playground.
              </a>
            </p>
          </div>
        </SimpleAccordion>
        <SimpleAccordion
          title="On-Chain Artwork"
          isOpen={openAccordionIndex === 6}
          onOpen={() => setOpenAccordionIndex(6)}
          onClose={() => setOpenAccordionIndex(-1)}
        >
          <div className="space-y-4">
            <p>
              Nounlets are stored directly on Ethereum and do not utilize pointers to other networks
              such as IPFS. This is possible because Noun parts are compressed and stored on-chain
              using a custom run-length encoding (RLE), which is a form of lossless compression.
            </p>
            <p>
              The compressed parts are efficiently converted into a single base64 encoded SVG image
              on-chain. To accomplish this, each part is decoded into an intermediate format before
              being converted into a series of SVG rects using batched, on-chain string
              concatenation. Once the entire SVG has been generated, it is base64 encoded.
            </p>
          </div>
        </SimpleAccordion>
        <SimpleAccordion
          title="Nounlet Seeder Contract"
          isOpen={openAccordionIndex === 7}
          onOpen={() => setOpenAccordionIndex(7)}
          onClose={() => setOpenAccordionIndex(-1)}
        >
          <div className="space-y-4">
            <p>
              The Nounlet Seeder contract is used to determine Noun traits during the minting
              process. Currently, Nounlet traits are determined using pseudo-random number
              generation:
            </p>
            <p>
              <span className="rounded-lg bg-gray-2 p-2 px-4 text-px16 text-black">
                keccak256( abi.encodePacked( blockhash( block.number - 1 ), nounId ) )
              </span>
            </p>
            <p>
              Trait generation is not truly random. Traits can be predicted when minting a Noun on
              the pending block.
            </p>
          </div>
        </SimpleAccordion>
      </div>
    </div>
  )
}
