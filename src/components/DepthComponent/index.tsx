import { keepDecimalFixed } from '@/utils/number';
import classnames from 'classnames';
import React, { useMemo, useState, useRef } from 'react';
import './index.less';

interface DepthData {
  price: number;
  quantity: number;
  sum: number;
}

interface DepthProps {
  data: DepthData[];
  type: 'asks' | 'bids';
  height: number;
}


const DepthComponent: React.FC<DepthProps> = ({ data, type, height }) => {

  const title = type === 'asks' ? 'Asks' : 'Bids';


  return (
    <div className={classnames('depth', type)}>
      <h2><b>{title}({data.length})</b></h2>
      <ul className='depth-row-title'>
        <li className={'depth-col'}>价格</li>
        <li className={'depth-col'}>数量</li>
        <li className={'depth-col'}>总额</li>
      </ul>
      <div style={{ height: `${height}px`, width: '100%', overflow: 'auto' }}>
        <ul className='depth-row-list'>
          {data.map((item, index) => {
            return (
              <li key={index} className={classnames('depth-row')}>
                <span className={'depth-col'}>{item.price}</span>
                <span className={'depth-col'}>{keepDecimalFixed(item.quantity, 1)}</span>
                <span className={'depth-col'}>{item.sum | 0}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default DepthComponent;