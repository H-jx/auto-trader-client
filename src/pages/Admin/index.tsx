
import React, { useRef, useState } from 'react';

import WatchSymbol from './WatchSymbol';
import Invite from './Invite';
import Strategy from './Strategy';
import styles from './index.less';

const Admin: React.FC = () => {


  return (
    <div className={styles.container}>
      <WatchSymbol />
      <Strategy></Strategy>
      <Invite></Invite>
    </div>
  );
};

export default Admin;
