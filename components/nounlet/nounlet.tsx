import NounletTraitsOverlay from "./nounlet-traits-tooltip";

// const Nounlet: React.FC<{
//     imgPath: string;
//     isBigNoun?: boolean;
//     alt: string;
//     className?: string;
//     wrapperClassName?: string;
//     parts?: { filename: string }[];
// }> = props => {
//     const { imgPath, alt, className, wrapperClassName, parts, isBigNoun } = props;
//     return (
//         <div data-tip data-for="noun-traits">
//             <img className={` ${className}`}
//                  src={imgPath ? imgPath : isBigNoun ? loadingBigNoun : loadingNoun}
//                  alt={alt}/>
//             {Boolean(parts?.length) && <NounletTraitsOverlay parts={parts!} />}
//         </div>
//     );
// };
//
// export default Nounlet;
