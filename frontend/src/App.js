import React, { useState, createContext, useEffect } from 'react';
import Grid from './components/Grid';
import './App.css';

export const AppContext = createContext();

const initialGrid = [
  ['', '', '', '', '', ''],
  ['', '', '', '', '', ''],
  ['', '', '', '', '', ''],
  ['', '', '', '', '', ''],
  ['', '', '', '', '', ''],
  ['', '', '', '', '', ''],
  ['', '', '', '', '', ''],
  ['', '', '', '', '', '']
];

function App() {
  const [grid, setGrid] = useState(initialGrid);
  const [spanagramPathList, setSpanagramPathList] = useState([]);
  const [currentSpanagramIndex, setCurrentSpanagramIndex] = useState(0);
  const [wordPathList, setWordPathList] = useState([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [connections, setConnections] = useState([]);

  useEffect(() => {
    if (spanagramPathList.length === 0) {
      return;
    }
    const path = spanagramPathList[currentSpanagramIndex].path;
    const newConnections = [];
    var prev = path[0];

    for (let i = 1; i < path.length; i++) {
      newConnections.push([prev, path[i]]);
      prev = path[i];
    }
    setConnections(newConnections);
  }, [spanagramPathList, currentSpanagramIndex])

  function handleLetterChange(row, col, letter) {
    const newGrid = grid.map((gridRow, rowIndex) =>
      gridRow.map((gridCol, colIndex) =>
        rowIndex === row && colIndex === col ? letter : gridCol
      )
    );
    setGrid(newGrid);
  }

  function handleSolve()  {
    // Replace with your actual API endpoint
    // const response = await fetch('https://api.example.com/solve', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify({ grid })
    // });
    // const data = await response.json();
    let letters = '';
    for (let row of grid) {
      letters += row.join('');
    }
    fetch(`/solve?input_value=${letters}`)
      .then(response => response.json())
      .then(data => {
        setSpanagramPathList(data);
        setCurrentSpanagramIndex(0);
      })
      .catch(error => console.error(error));
    
  }

  function handleSpanagramFeedback(isCorrect) {
    const currentSpanagram = spanagramPathList[currentSpanagramIndex];

    const newPath = [];
    var prev = "";

    if (isCorrect) {
      // Make another API call given the grid and the correct spanagram
      // const response = await fetch('https://api.example.com/words', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify({ grid, spanagram: currentSpanagram })
      // });
      // const data = await response.json();
      // setPotentialWords(['ex1', 'ex2', 'ex3']);
    } else {
      // Move to the next spanagram
      setCurrentSpanagramIndex((prevIndex) => prevIndex + 1);
    }
  }

  return (
    <div className="App">

      <AppContext.Provider 
        value={{ 
          grid, 
          setGrid,
          connections, 
          handleLetterChange,
        }}
      >

        <div className="grid-container">
          <h1>NYT Strands Grid Solver</h1>
          <Grid />
        </div>
        
        <div className="controls">
          <button onClick={handleSolve}>Solve Grid</button>
        </div>
        {spanagramPathList.length > 0 && currentSpanagramIndex < spanagramPathList.length && (
          <div className="spanagram-item">
            <h2>Possible Spanagram</h2>
            <span>{spanagramPathList[currentSpanagramIndex].word}</span>
            <button onClick={() => handleSpanagramFeedback(true)}>Correct</button>
            <button onClick={() => handleSpanagramFeedback(false)}>Incorrect</button>
          </div>
        )}
        {wordPathList.length > 0 && currentWordIndex < wordPathList.length && (
          <div className="word-item">
            <h2>Possible Word</h2>
            <span>{wordPathList[currentSpanagramIndex].word}</span>
            {/* <button onClick={() => handleSpanagramFeedback(true)}>Correct</button>
            <button onClick={() => handleSpanagramFeedback(false)}>Incorrect</button> */}
          </div>
        )}

      </AppContext.Provider>

    </div>
  );
};

export default App;