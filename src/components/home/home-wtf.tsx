import SimpleAccordion from 'src/components/simple-accordion'
import { useState } from 'react'

export default function HomeWTF(): JSX.Element {
  const [openAccordionIndex, setOpenAccordionIndex] = useState(-1)

  return (
    <div className="home-wtf">
      <div className="lg:container mx-auto font-500 text-px22 leading-px28 text-gray-4">
        <div className="px-4 md:px-12 lg:px-4">
          <h2 className="font-londrina text-[64px] leading-[78px] font-700 mb-16 text-black">
            WTF?
          </h2>
          <p className="mb-6">
            Nounlets are an experiment to allow for collective ownership over an individual{' '}
            <a
              href="https://nouns.wtf/noun/315"
              className="text-secondary-blue"
              target="_blank"
              rel="noreferrer"
            >
              Noun
            </a>
            . Each Nounlet represents 1% of the vaulted Noun and has a vote in delegating the Noun’s
            governance rights. The chosen delegate can join the official Nouns private discord
            channel, vote in governance and submit governance proposals.
          </p>
          <p className="mb-16">
            Learn more below, or by visiting and reviewing the{' '}
            <a
              href="src/components/home/home-wtf"
              className="text-secondary-blue"
              target="_blank"
              rel="noreferrer"
            >
              Nouns DAO homepage.
            </a>
          </p>

          <div className="flex flex-col space-y-12">
            <SimpleAccordion
              title="Summary"
              isOpen={openAccordionIndex === 0}
              onOpen={() => setOpenAccordionIndex(0)}
              onClose={() => setOpenAccordionIndex(-1)}
            >
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Nounlets artwork is in the{' '}
                  <a
                    href="src/components/home/home-wtf"
                    className="text-secondary-blue"
                    target="_blank"
                    rel="noreferrer"
                  >
                    public domain.
                  </a>
                </li>
                <li>
                  One Nounlet is trustlessly auctioned every 4 hours until all 100 Nounlets have
                  been sold.
                </li>
                <li>
                  98% of auction proceeds are trustlessly sent to the original Noun owner. 2% of
                  auction proceeds are sent to Tessera.
                </li>
                <li>Settlement of one auction kicks off the next.</li>
                <li>The elected delegate of the Noun is considered a member of NounsDAO.</li>
                <li>One Nounlet is equal to one vote for a delegate.</li>
                <li>Artwork is generative and stored directly on-chain (not IPFS).</li>
                <li>
                  Nounlets will all have the same head trait as the Vaulted Noun, but remaining
                  attributes will vary.
                </li>
              </ul>
            </SimpleAccordion>
            <SimpleAccordion
              title="4 Hour Auctions"
              isOpen={openAccordionIndex === 1}
              onOpen={() => setOpenAccordionIndex(1)}
              onClose={() => setOpenAccordionIndex(-1)}
            >
              <div className="space-y-4">
                <p>
                  The Nounlets Auction Contract will act as a self-sufficient Noun generation and
                  distribution mechanism, auctioning one Nounlet every 4 hours until all 100
                  Nounlets are sold. 98% of auction proceeds are trustlessly sent to the original
                  Noun owner. 2% of auction proceeds are sent to Tessera.
                </p>
                <p>
                  Each time an auction is settled, the settlement transaction will cause a new
                  Nounlet to be minted and a new 4 hour auction to begin. Bids within the last 10
                  minutes reset the auction timer to 10 minutes.
                </p>
                <p>
                  While settlement is most heavily incentivized for the winning bidder, it can be
                  triggered by anyone, allowing the system to trustlessly auction Nounlets as long
                  as Ethereum is operational and there are interested bidders.
                </p>
              </div>
            </SimpleAccordion>
            <SimpleAccordion
              title="Delegating"
              isOpen={openAccordionIndex === 2}
              onOpen={() => setOpenAccordionIndex(2)}
              onClose={() => setOpenAccordionIndex(-1)}
            >
              <div className="space-y-4">
                <p>
                  All Nounlet owners will be able to vote on a delegate. The delegate will be
                  elected on-chain in the nouns contract. The active delegate will be able to join
                  the official nouns-private discord channel, vote in governance and submit
                  governance proposals. Each Nounlet has 1 vote on the delegate.
                  When a Nounlet is transferred the delegate will be automatically assigned to the receivers wallet address.
                </p>
              </div>
            </SimpleAccordion>
            <SimpleAccordion
              title="Optimistic Buyouts"
              isOpen={openAccordionIndex === 3}
              onOpen={() => setOpenAccordionIndex(3)}
              onClose={() => setOpenAccordionIndex(-1)}
            >
              <div className="space-y-4">
                <p>
                  Reconstitution is only possible after all 100 Nounlets have been sold. The Noun is
                  able to be purchased and reconstituted (meaning one person buys the entire Noun
                  from the vault) using what we call an optimistic bid.
                </p>
                <p>
                  Someone who wants to buy the vaulted Noun makes a bid to buy the Noun out of the
                  vault, which the Nounlet holders implicitly accept if the rejection criteria of
                  purchasing all the bidder’s Nounlets aren’t met.
                </p>
                <p>
                  In this mechanism, the bidder must name a price and put up at least 1 of their
                  Nounlets as collateral. All other participants (whether they currently hold a
                  Nounlet or not) are able to reject this bid by purchasing all of the Nounlets used
                  as collateral at the fixed price proposed by the buyer.
                </p>
                <p>
                  Optimistic buyouts will last for 7 days before being accepted.{' '}
                  <span className="font-700 text-black">
                    If all Nounlets are purchased at the implied valuation before 7 days have
                    passed, the buyout ends and is rejected.
                  </span>
                </p>
                <p>
                  For more information visit the{' '}
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href="https://medium.com/tessera-nft/nounlets-explained-faq-57e9bc537d93"
                    className="text-secondary-blue"
                  >
                    FAQ
                  </a>
                </p>
              </div>
            </SimpleAccordion>
            <SimpleAccordion
              title="Nounlet Traits"
              isOpen={openAccordionIndex === 4}
              onOpen={() => setOpenAccordionIndex(4)}
              onClose={() => setOpenAccordionIndex(-1)}
            >
              <div className="space-y-4">
                <p>
                  Nounlets are generated randomly based on Ethereum block hashes. All Nounlets will
                  have the same head as the Vaulted Noun.
                </p>
                <p>As of this writing, Nounlet traits contain:</p>
                <ul className="list-disc pl-6 space-y-2">
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
              isOpen={openAccordionIndex === 5}
              onOpen={() => setOpenAccordionIndex(5)}
              onClose={() => setOpenAccordionIndex(-1)}
            >
              <div className="space-y-4">
                <p>
                  Nounlets are stored directly on Ethereum and do not utilize pointers to other
                  networks such as IPFS. This is possible because Noun parts are compressed and
                  stored on-chain using a custom run-length encoding (RLE), which is a form of
                  lossless compression.
                </p>
                <p>
                  The compressed parts are efficiently converted into a single base64 encoded SVG
                  image on-chain. To accomplish this, each part is decoded into an intermediate
                  format before being converted into a series of SVG rects using batched, on-chain
                  string concatenation. Once the entire SVG has been generated, it is base64
                  encoded.
                </p>
              </div>
            </SimpleAccordion>
            <SimpleAccordion
              title="Nounlet Seeder Contract"
              isOpen={openAccordionIndex === 6}
              onOpen={() => setOpenAccordionIndex(6)}
              onClose={() => setOpenAccordionIndex(-1)}
            >
              <div className="space-y-4">
                <p>
                  The Noun Descriptor contract is used to determine Nounlet traits during the
                  minting process. Currently, Nounlet traits are determined using pseudo-random
                  number generation:
                </p>
                <p>
                  <span className="bg-gray-2 rounded-lg p-2 px-4 text-black text-px16">
                    keccak256( abi.encodePacked( blockhash( block.number - 1 ), nounId ) )
                  </span>
                </p>
                <p>
                  Trait generation is not truly random. Traits can be predicted when minting a
                  Nounlet on the pending block.
                </p>
              </div>
            </SimpleAccordion>
          </div>
        </div>
      </div>
    </div>
  )
}
