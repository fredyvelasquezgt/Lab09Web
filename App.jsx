/* eslint-disable import/order */
/* eslint-disable import/extensions */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-shadow */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-param-reassign */
/* eslint-disable import/no-unresolved */
import React, { useEffect, useRef, useState } from 'react';
// eslint-disable-next-line import/extensions
import uniqueCardsArray from './data.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './src/components/Header';
import { Col, Container, Row } from 'react-bootstrap';
import Card from './src/components/Tarjeta';
import Finish from './src/components/Finish/index.jsx';

// FisherYates Modern Shuffle Algorithm
function swap(array, i, j) {
  const temp = array[i];
  array[i] = array[j];
  // eslint-disable-next-line no-param-reassign
  array[j] = temp;
}
function shuffleCards(array) {
  const { length } = array;
  for (let i = length; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * i);
    const currentIndex = i - 1;
    swap(array, currentIndex, randomIndex);
  }
  return array;
}

function App() {
  const [cards, setCards] = useState(() => shuffleCards(uniqueCardsArray.concat(uniqueCardsArray)));
  const [openCards, setOpencards] = useState([]);
  const [matchedCards, setMatchedcards] = useState({});
  const [moves, setMoves] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [shouldDisableAllCards, setShouldDisableAllCards] = useState(false);
  const [bestScore, setBestScore] = useState(
    JSON.parse(localStorage.getItem('bestScore')) || Number.POSITIVE_INFINITY,
  );
  const timeout = useRef(null);

  const disable = () => {
    setShouldDisableAllCards(true);
  };

  const enable = () => {
    setShouldDisableAllCards(false);
  };

  const checkCompletion = () => {
    if (Object.keys(matchedCards).length === uniqueCardsArray.length) {
      setShowModal(true);
      const highScore = Math.min(moves, bestScore);
      setBestScore(highScore);
      localStorage.setItem('bestScore', highScore);
    }
  };

  const evaluate = () => {
    const [first, second] = openCards;
    enable();
    if (cards[first].type === cards[second].type) {
      setMatchedcards((prev) => ({ ...prev, [cards[first].type]: true }));
      setOpencards([]);
      return;
    }
    timeout.current = setTimeout(() => {
      setOpencards([]);
    }, 500);
  };

  const handleCardClick = (index) => {
    if (openCards.length === 1) {
      setOpencards((prev) => [...prev, index]);
      setMoves((moves) => moves + 1);
      disable();
    } else {
      clearTimeout(timeout.current);
      setOpencards([index]);
    }
  };
  useEffect(() => {
    let timeout = null;
    if (openCards.length === 2) {
      timeout = setTimeout(evaluate, 300);
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [evaluate, openCards]);

  useEffect(() => {
    checkCompletion();
  }, [checkCompletion, matchedCards]);

  const checkIsFlipped = (index) => openCards.includes(index);
  const checkIsInactive = (card) => Boolean(matchedCards[card.type]);
  const handleRestart = () => {
    setMatchedcards({});
    setOpencards([]);
    setShowModal(false);
    setMoves(0);
    setShouldDisableAllCards(false);
    setCards(shuffleCards(uniqueCardsArray.concat(uniqueCardsArray)));
  };

  return (
    <div>
      <Header
        moves={moves}
        bestScore={bestScore}
        handleRestart={handleRestart}
      />
      <Container>
        <Row>
          {cards.map((card, index) => (
            <Col xs={6} md={3} lg={2}>
              <Card
                key={index}
                card={card}
                index={index}
                isDisabled={shouldDisableAllCards}
                isInactive={checkIsInactive(card)}
                isFlipped={checkIsFlipped(index)}
                onClick={handleCardClick}
              />
            </Col>
          ))}
        </Row>
      </Container>
      <Finish
        showModal={showModal}
        moves={moves}
        bestScore={bestScore}
        handleRestart={handleRestart}
      />
    </div>
  );
}

export default App;
