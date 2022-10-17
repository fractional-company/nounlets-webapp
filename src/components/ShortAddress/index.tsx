import { useEthers } from '@usedapp/core';
import Davatar from '@davatar/react';
import classes from './ShortAddress.module.css';
import {useReverseENSLookUp} from "../../lib/utils/ensLookup";

export const useShortAddress = (address: string): string => {
  return address && [address.substr(0, 4), address.substr(38, 4)].join('...');
};

const ShortAddress: React.FC<{ address: string; avatar?: boolean; size?: number }> = props => {
  const { address, avatar, size = 24 } = props;
  const { library: provider } = useEthers();

  if (!address){
    props.address = "0x0000000000000000000000000000000000000000"
  }

  const ens = useReverseENSLookUp(address);
     //DONE: Add reverse lookup after stable rpc plan (temp fix)
  const shortAddress = useShortAddress(address);

  if (avatar) {
    return (
      <div className={classes.shortAddress}>
        {avatar && (
          <div key={address}>
            <Davatar size={size} address={address} provider={provider} />
          </div>
        )}
        <span>{ens ? ens : shortAddress}</span>
        {/* <span>{shortAddress}</span> */}
      </div>
    );
  }

  // return <>{ens ? ens : shortAddress}</>;
  return <>{shortAddress}</>;
};

export default ShortAddress;
