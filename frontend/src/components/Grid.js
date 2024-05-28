import React, { useRef, useEffect, useState, useContext } from 'react';
import App, { AppContext } from '../App';
import './Grid.css';
import Xarrow from "react-xarrows";

function Grid() {

  const { grid, connections, handleLetterChange } = useContext(AppContext);
  const inputRefs = useRef([]);

  function handleKeyDown(e, rowIndex, colIndex) {
    const currentInputIndex = rowIndex * grid[0].length + colIndex;

    if (e.key === 'Backspace' && e.target.value === '') {
      const prevInputIndex = currentInputIndex - 1;
      if (prevInputIndex >= 0) {
        inputRefs.current[prevInputIndex].focus();
      }
    }
  }

  function handleChange(e, rowIndex, colIndex) {
    const letter = e.target.value.toUpperCase();
    handleLetterChange(rowIndex, colIndex, letter);

    if (letter.match(/^[A-Z]$/)) {
      const nextInputIndex = rowIndex * grid[0].length + colIndex + 1;
      if (nextInputIndex < inputRefs.current.length) {
        inputRefs.current[nextInputIndex].focus();
      }
    }
  }

  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, grid.length * grid[0].length); // Limit array size to grid size
  }, [grid]);

  return (
    <div className="grid">
      {grid.map((row, rowIndex) => (
        <div key={rowIndex} className="grid-row">
          {row.map((letter, colIndex) => (
            <input
              key={rowIndex * 6 + colIndex}
              id={rowIndex * 6 + colIndex}
              className="grid-cell"
              type="text"
              maxLength="1"
              value={letter}
              onChange={(e) => handleChange(e, rowIndex, colIndex)}
              onKeyDown={(e) => handleKeyDown(e, rowIndex, colIndex)}
              ref={(el) => (inputRefs.current[rowIndex * grid[0].length + colIndex] = el)}
            />
          ))}
        </div>
      ))}

      {connections && connections.map(connection => (
        <Xarrow
          start={connection[0].toString()}
          end={connection[1].toString()}
          startAnchor="middle"
          endAnchor="middle"
          curveness={0}
          showHead={true}
        />
      ))}

    </div>
  );
};

export default Grid;