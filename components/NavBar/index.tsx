import classes from './NavBar.module.css';
import logo from '../../assets/logo.svg';
import { useEtherBalance } from '@usedapp/core';
import { Nav, Navbar, Container } from 'react-bootstrap';
import testnetNoun from '../../assets/testnet-noun.png';
import config, { CHAIN_ID } from '../../config';
import { utils } from 'ethers';
import { buildEtherscanHoldingsLink } from '../../lib/utils/etherscan';
import { ExternalURL, externalURL } from '../../lib/utils/externalURL';
import useLidoBalance from '../../hooks/useLidoBalance';
import NavBarButton, { NavBarButtonStyle } from '../NavBarButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookOpen, faUsers, faPlay, faComments } from '@fortawesome/free-solid-svg-icons';
import NavBarTreasury from '../NavBarTreasury';
import NavWallet from '../NavWallet';
import { useEffect, useState } from 'react';
import { createClient } from 'urql';
import { useAccountState } from '../../store/account'
import { useAppState } from '../../store/application'
import {BigNumber} from "@ethersproject/bignumber";
import Link from "next/link";

const NavBar = () => {
  const {activeAccount} = useAccountState();
  const {stateBackgroundColor: stateBgColor, isCoolBackground: isCool} = useAppState();
  // const ethBalance = useEtherBalance(config.addresses.nounsDaoExecutor);
  const ethBalance = BigNumber.from('10');
  const lidoBalanceAsETH = useLidoBalance();
  const treasuryBalance = ethBalance && lidoBalanceAsETH && ethBalance.add(lidoBalanceAsETH);
  const daoEtherscanLink = buildEtherscanHoldingsLink('0x0000000000000000000000000000000000000000');

  const isPreLaunch = config.isPreLaunch === 'true';

  const useStateBg = true

  const navLogo = logo;

  const nonWalletButtonStyle = !useStateBg
    ? NavBarButtonStyle.WHITE_INFO
    : isCool
    ? NavBarButtonStyle.COOL_INFO
    : NavBarButtonStyle.WARM_INFO;

    const [bigNounBalance, setBigNounBalance] = useState('...');

    const fetchNounsQuery = `
    query {
        accounts(where: {id: "0xd5f279ff9eb21c6d40c8f345a66f2751c4eea1fb" }) {
        id
        tokenBalance
        nouns {
          id
        }
      }
    }
      `;

    async function fetchData() {
      const repsonse = await createClient({ url: config.app.nounsDAOSubgraphApiUri })
        .query(fetchNounsQuery)
        .toPromise();
      return repsonse.data.accounts[0];
    }

    useEffect(() => {
      fetchData()
        .then(async repsonse => {
          const tokenBalance = repsonse.tokenBalance;
          const nounIds = repsonse.nouns.flatMap((obj: { id: any }) => obj.id);

          setBigNounBalance(tokenBalance);
          return;
        })
        .catch(error => {
          console.log(`Nouns Owned Error ${error}`);
          return;
        });
    }, []);

  return (
    <>
      <Navbar
        expand="lg"
        style={{ backgroundColor: `${useStateBg ? stateBgColor : 'white'}` }}
        className={classes.navBarCustom}
      >
        <Container style={{ maxWidth: 'unset' }}>
          <div className={classes.brandAndTreasuryWrapper}>
            <Navbar.Brand as={Link} href="/" className={classes.navBarBrand}>
              <img src={navLogo.src} className={classes.navBarLogo} alt="Lil Nouns DAO logo" />
            </Navbar.Brand>
            {Number(CHAIN_ID) !== 1 && (
              <Nav.Item>
                <img className={classes.testnetImg} src={testnetNoun.src} alt="testnet noun" />
                TESTNET
              </Nav.Item>
            )}

            {isPreLaunch ? (
              <></>
            ) : (
              <Nav.Item>
                {treasuryBalance && (
                  <Nav.Link
                    href={daoEtherscanLink}
                    className={classes.nounsNavLink}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <NavBarTreasury
                      treasuryBalance={Number(utils.formatEther(treasuryBalance)).toFixed(0)}
                      treasuryStyle={nonWalletButtonStyle}
                      treasuryBigNounBalance={bigNounBalance}
                    />
                  </Nav.Link>
                )}
              </Nav.Item>
            )}
          </div>
          <Navbar.Toggle className={classes.navBarToggle} aria-controls="basic-navbar-nav" />
          <Navbar.Collapse className="justify-content-end">
            {isPreLaunch ? (
              <>
                <Nav.Link
                  href={externalURL(ExternalURL.notion)}
                  className={classes.nounsNavLink}
                  target="_blank"
                  rel="noreferrer"
                >
                  <NavBarButton
                    buttonText={'Docs'}
                    buttonIcon={<FontAwesomeIcon icon={faBookOpen} />}
                    buttonStyle={nonWalletButtonStyle}
                  />
                </Nav.Link>
                <Nav.Link
              href={externalURL(ExternalURL.discourse)}
              className={classes.nounsNavLink}
              target="_blank"
              rel="noreferrer"
            >
              <NavBarButton
                buttonText={'Discourse'}
                buttonIcon={<FontAwesomeIcon icon={faComments} />}
                buttonStyle={nonWalletButtonStyle}
              />
            </Nav.Link>
                <Nav.Link as={Link} href="/playground" className={classes.nounsNavLink}>
                  <NavBarButton
                    buttonText={'Playground'}
                    buttonIcon={<FontAwesomeIcon icon={faPlay} />}
                    buttonStyle={nonWalletButtonStyle}
                  />
                </Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={Link} href="/vote" className={classes.nounsNavLink}>
                  <NavBarButton
                    buttonText={'DAO'}
                    buttonIcon={<FontAwesomeIcon icon={faUsers} />}
                    buttonStyle={nonWalletButtonStyle}
                  />
                </Nav.Link>
                <Nav.Link
                  href={externalURL(ExternalURL.notion)}
                  className={classes.nounsNavLink}
                  target="_blank"
                  rel="noreferrer"
                >
                  <NavBarButton
                    buttonText={'Docs'}
                    buttonIcon={<FontAwesomeIcon icon={faBookOpen} />}
                    buttonStyle={nonWalletButtonStyle}
                  />
                </Nav.Link>
                <Nav.Link
              href={externalURL(ExternalURL.discourse)}
              className={classes.nounsNavLink}
              target="_blank"
              rel="noreferrer"
            >
              <NavBarButton
                buttonText={'Discourse'}
                buttonIcon={<FontAwesomeIcon icon={faComments} />}
                buttonStyle={nonWalletButtonStyle}
              />
            </Nav.Link>
                <Nav.Link as={Link} href="/playground" className={classes.nounsNavLink}>
                  <NavBarButton
                    buttonText={'Playground'}
                    buttonIcon={<FontAwesomeIcon icon={faPlay} />}
                    buttonStyle={nonWalletButtonStyle}
                  />
                </Nav.Link>
                <NavWallet address={activeAccount || '0'} buttonStyle={nonWalletButtonStyle} />{' '}
              </>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default NavBar;
