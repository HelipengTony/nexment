import React from 'react';
import Popover from 'react-tiny-popover';
import emojis from './emoji';
import Icons from '../../icons/index';

const EmojiCard = (Props: { handler: any }) => {
  // Popover state
  const [emojiPopoverStatus, setEmojiPopoverStatus] = React.useState<boolean>(
    false
  );
  const toggleEmojiCard = () => {
    setEmojiPopoverStatus(!emojiPopoverStatus);
  };
  const emojiContent = () => {
    return (
      <div className="nexment-emoji-container">
        {emojis.map(cate => {
          return (
            <div className="nexment-emoji-section" key={'cate' + cate}>
              <div className="nexment-emoji-section-header">
                <b>{cate[0]}</b>
              </div>
              <div className="nexment-emoji-section-box">
                <div className="nexment-emoji-section-container">
                  {cate.slice(1).map(item => {
                    return (
                      <span
                        key={'emoji' + item}
                        onClick={() => {
                          Props.handler(item);
                        }}
                      >
                        {item}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };
  return (
    <Popover
      isOpen={emojiPopoverStatus}
      position={'right'}
      content={emojiContent}
      onClickOutside={() => {
        toggleEmojiCard();
      }}
    >
      <button onClick={() => toggleEmojiCard()}>{Icons().emoji}</button>
    </Popover>
  );
};

export default EmojiCard;