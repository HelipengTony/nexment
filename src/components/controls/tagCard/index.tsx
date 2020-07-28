import React from 'react';
import Popover from 'react-tiny-popover';
import Icons from '../../icons/index';

const TagCard = (Props: { tag: string; handler: any }) => {
  // Popover state
  const [tagPopoverStatus, setTagPopoverStatus] = React.useState<boolean>(
    false
  );

  const tagContent = () => {
    return (
      <div className="nexment-popover">
        <div className="nexment-popover-text">
          <b>Description Tag</b>
        </div>
        <p>Add a description tag to help others to know about you</p>
        <div className="nexment-popover-input">
          <input
            placeholder={Props.tag ? Props.tag : 'Description tag'}
            onChange={Props.handler}
          ></input>
          <button
            onClick={() => {
              setTagPopoverStatus(!tagPopoverStatus);
            }}
          >
            Confirm
          </button>
        </div>
      </div>
    );
  };
  return (
    <Popover
      isOpen={tagPopoverStatus}
      position={'top'}
      content={tagContent}
      onClickOutside={() => {
        setTagPopoverStatus(!tagPopoverStatus);
      }}
    >
      <button onClick={() => setTagPopoverStatus(!tagPopoverStatus)}>
        {Icons().tag}
      </button>
    </Popover>
  );
};

export default TagCard;
