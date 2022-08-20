// import {INounSeed, useNounletSeed} from "../../lib/wrappers/nounletToken";
import { BigNumber } from 'ethers'
import Link from 'next/link'
import { useDisplayAuctionStore } from '../../store/onDisplayAuctionStore'
// import Nounlet from "./nounlet";
import { useMemo } from 'react'

interface StandaloneNounletProps {
  nounId: BigNumber
}
interface StandaloneCircularNounletProps {
  nounId: BigNumber
}

interface StandaloneNounletWithSeedProps {
  nounId: BigNumber
  onLoadSeed?: (seed: any) => void
  shouldLinkToProfile: boolean
}
//
// const getNounlet = (nounId: string | BigNumber | number, seed: INounSeed) => {
//     const id = nounId.toString();
//     const name = `Noun ${id}`;
//     const description = `Lil Noun ${id} is a member of the Lil Nouns DAO`;
//     const { parts, background } = getNounletData(seed);
//     const svg = buildSVG(parts, data.palette, background);
//     const image = `data:image/svg+xml;base64,${btoa(svg)}`;
//
//     return {
//         name,
//         svg,
//         description,
//         image,
//         parts,
//     };
// };
//
// const getBigNoun = (nounId: string | EthersBN | number, seed: INounSeed) => {
//     const id = nounId.toString();
//     const name = `Noun ${id}`;
//     const description = `Noun ${id} is a member of the Nouns DAO`;
//     const { parts, background } = getBigNounData(seed);
//     const svg = buildSVG(parts, bigNounData.palette, background);
//     const image = `data:image/svg+xml;base64,${btoa(svg)}`;
//
//     return {
//         name,
//         svg,
//         description,
//         image,
//         parts,
//     };
// };
//
// export const useNounletData = (nounId: string | BigNumber | number) => {
//     const seed = useNounletSeed(BigNumber.from(nounId));
//     return useMemo(() => seed && getNounlet(nounId, seed), [nounId, seed]);
// };
//
// export const StandaloneNounletWithSeed: React.FC<StandaloneNounletWithSeedProps> = (
//     props: StandaloneNounletWithSeedProps,
// ) => {
//     const { setOnDisplayAuctionNounId } = useDisplayAuction()
//     const { nounId, onLoadSeed, shouldLinkToProfile } = props;
//     const seed = useNounletSeed(nounId);
//
//     if (!seed || !nounId || !onLoadSeed) return <Nounlet imgPath="" alt="Lil Noun" />;
//
//
//     onLoadSeed(seed);
//
//     const onClickHandler = () => setOnDisplayAuctionNounId(nounId.toNumber())
//
//     const { image, description, parts } = getNounlet(nounId, seed);
//
//     const noun = <Nounlet imgPath={image} alt={description} parts={parts} />;
//     const nounWithLink = (
//         <Link
//             href={'/nounlet/' + nounId.toString()}
//             onClick={onClickHandler}
//         >
//             {noun}
//         </Link>
//     );
//     return shouldLinkToProfile ? nounWithLink : noun;
// };
//
