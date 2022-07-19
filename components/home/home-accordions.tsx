import { Disclosure, Transition } from '@headlessui/react'
import IconArrow from 'components/icons/icon-arrow'
import SimpleAccordion from 'components/simple-accordion'
import { useState } from 'react'

export default function HomeAccordions(): JSX.Element {
  const [openAccordionIndex, setOpenAccordionIndex] = useState(-1)

  return (
    <div className="home-accordions">
      <div className="mx-auto w-full">
        <div className="flex flex-col space-y-10">
          <SimpleAccordion
            title="Summary"
            isOpen={openAccordionIndex === 0}
            onOpen={() => setOpenAccordionIndex(0)}
            onClose={() => setOpenAccordionIndex(-1)}
          >
            <ul className="list-disc pl-6">
              <li>Nounlets artwork is in the public domain.</li>
              <li>
                One Nounlet is trustlessly auctioned every 4 hours until all 100 Nounlets have been
                sold.
              </li>
              <li>
                97% of auction proceeds are trustlessly sent to the original Noun owner. 1.5% of
                auction proceeds are sent to Nouns DAO and another 1.5% are sent to Fractional.
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
            <ul className="list-disc pl-6">
              <li>Nounlets artwork is in the public domain.</li>
              <li>
                One Nounlet is trustlessly auctioned every 4 hours until all 100 Nounlets have been
                sold.
              </li>
              <li>
                97% of auction proceeds are trustlessly sent to the original Noun owner. 1.5% of
                auction proceeds are sent to Nouns DAO and another 1.5% are sent to Fractional.
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
            title="Delegating"
            isOpen={openAccordionIndex === 2}
            onOpen={() => setOpenAccordionIndex(2)}
            onClose={() => setOpenAccordionIndex(-1)}
          >
            <ul className="list-disc pl-6">
              <li>Nounlets artwork is in the public domain.</li>
              <li>
                One Nounlet is trustlessly auctioned every 4 hours until all 100 Nounlets have been
                sold.
              </li>
              <li>
                97% of auction proceeds are trustlessly sent to the original Noun owner. 1.5% of
                auction proceeds are sent to Nouns DAO and another 1.5% are sent to Fractional.
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
            title="Nounlet Traits"
            isOpen={openAccordionIndex === 3}
            onOpen={() => setOpenAccordionIndex(3)}
            onClose={() => setOpenAccordionIndex(-1)}
          >
            <ul className="list-disc pl-6">
              <li>Nounlets artwork is in the public domain.</li>
              <li>
                One Nounlet is trustlessly auctioned every 4 hours until all 100 Nounlets have been
                sold.
              </li>
              <li>
                97% of auction proceeds are trustlessly sent to the original Noun owner. 1.5% of
                auction proceeds are sent to Nouns DAO and another 1.5% are sent to Fractional.
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
            title="On-Chain Artwork"
            isOpen={openAccordionIndex === 4}
            onOpen={() => setOpenAccordionIndex(4)}
            onClose={() => setOpenAccordionIndex(-1)}
          >
            <ul className="list-disc pl-6">
              <li>Nounlets artwork is in the public domain.</li>
              <li>
                One Nounlet is trustlessly auctioned every 4 hours until all 100 Nounlets have been
                sold.
              </li>
              <li>
                97% of auction proceeds are trustlessly sent to the original Noun owner. 1.5% of
                auction proceeds are sent to Nouns DAO and another 1.5% are sent to Fractional.
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
            title="Nounlet Seeder Contract"
            isOpen={openAccordionIndex === 5}
            onOpen={() => setOpenAccordionIndex(5)}
            onClose={() => setOpenAccordionIndex(-1)}
          >
            <ul className="list-disc pl-6">
              <li>Nounlets artwork is in the public domain.</li>
              <li>
                One Nounlet is trustlessly auctioned every 4 hours until all 100 Nounlets have been
                sold.
              </li>
              <li>
                97% of auction proceeds are trustlessly sent to the original Noun owner. 1.5% of
                auction proceeds are sent to Nouns DAO and another 1.5% are sent to Fractional.
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
            title="NounsDao Reward"
            isOpen={openAccordionIndex === 6}
            onOpen={() => setOpenAccordionIndex(6)}
            onClose={() => setOpenAccordionIndex(-1)}
          >
            <ul className="list-disc pl-6">
              <li>Nounlets artwork is in the public domain.</li>
              <li>
                One Nounlet is trustlessly auctioned every 4 hours until all 100 Nounlets have been
                sold.
              </li>
              <li>
                97% of auction proceeds are trustlessly sent to the original Noun owner. 1.5% of
                auction proceeds are sent to Nouns DAO and another 1.5% are sent to Fractional.
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
        </div>
      </div>
    </div>
  )
}
