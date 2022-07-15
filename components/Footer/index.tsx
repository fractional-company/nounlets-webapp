import classes from './Footer.module.css';
import { Container } from 'react-bootstrap';
import config from '../../config';
import {ExternalURL, externalURL} from "../../lib/utils/externalURL";
import {buildEtherscanAddressLink} from "../../lib/utils/etherscan";
import Link from "next/link";

const Footer = () => {
  const twitterURL = externalURL(ExternalURL.twitter);
  const discordURL = externalURL(ExternalURL.discord);
  const etherscanURL = buildEtherscanAddressLink('0x0000000000000000000000000000000000000000');
  // const etherscanURL = buildEtherscanAddressLink(config.addresses.nounsToken);
  const discourseURL = externalURL(ExternalURL.discourse);

  return (
    <div className={classes.wrapper}>
      <Container className={classes.container}>
        <footer className={classes.footerSignature}>
          <Link href={discordURL} passHref={true}>Discord</Link>
          <Link href={twitterURL} passHref={true}>Twitter</Link>
          <Link href={etherscanURL} passHref={true}>Etherscan</Link>
          <Link href={discourseURL}>Forums</Link>
        </footer>
      </Container>
    </div>
  );
};
export default Footer;
