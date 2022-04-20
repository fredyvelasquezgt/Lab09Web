import React from 'react';
import './Tarjeta.css';
import classnames from 'classnames';
import backpick from '../../image/backpick.jpeg';

function Card({
  onClick, card, index, isInactive, isFlipped, isDisabled,
}) {
  const handleClick = () => {
    !isFlipped && !isDisabled && onClick(index);
  };
  return (
    <div
      className={classnames('card', {
        'is-flipped': isFlipped,
        'is-inactive': isInactive,
      })}
      onClick={handleClick}
    >
      <div className="card-face card-font-face">
        <img src={backpick} alt="backpick" className="img" />
      </div>
      <div className="card-face card-back-face">
        <img src={card.image} alt="frontpic" className="img" />
      </div>
    </div>
  );
}
export default Card;
