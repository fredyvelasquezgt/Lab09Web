import React from 'react';
import './style.css';
import { Container } from 'react-bootstrap';

function Header({ moves, handleRestart }) {
  return (
    <div>
      <h1>Memory Game</h1>
      <Container>
        <div className="sub-header">
          <div className="moves">
            <span className="bold">Moves:</span>
            {moves}
          </div>
          <div className="reshuffle">
            <button onClick={handleRestart} type="button">
              Reiniciar
            </button>
          </div>
        </div>
      </Container>
    </div>
  );
}
Header.propTypes = myPropTypes;

export default Header;
