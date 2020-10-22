import React, { useState } from 'react';
import inputData from "./input.json"
import Roomba from "./components/Roomba"
import "./styles/all.scss"
import './App.css';

function App() {
  const [records, setRecords] = useState([
    {
      location: {
        x: 1,
        y: 1
      },
      dirtCollected: 0,
      action: null,
      wallHits: 0
    }
  ])

  const [wallHits, incrementWallhit] = useState(0)
  const [dirtCollected, incrementDirtCollected] = useState(0)

  const nextStep = () => {
    let current_location = records[records.length - 1].location
    let action = inputData.drivingInstructions[records.length - 1]
    let next_location
    switch (action) {
      case "N":
        next_location = {
          x: current_location.x,
          y: current_location.y + 1
        }
        break;
    
      case "E":
        next_location = {
          x: current_location.x + 1,
          y: current_location.y 
        }
        break;
    
      case "S":
        next_location = {
          x: current_location.x,
          y: current_location.y - 1
        }
        break;
    
      case "W":
        next_location = {
          x: current_location.x - 1,
          y: current_location.y
        }
        break;
      default:
        break;
    }

    let check = checkWallhit(next_location, current_location)

    next_location = check.location
    
    let wall = check.wall

    let dirt = checkDirtLocation([next_location.x, next_location.y])

    let new_records = records.concat({
      location: next_location,
      dirtCollected: dirt,
      wallHits: wall,
      action: action
    })

    setRecords(new_records)
  }

  const checkWallhit = (next_location, current_location) => {
    let wall = wallHits
    if (next_location.y < 0 || next_location.y > inputData.roomDimensions[1] || next_location.x < 0 || next_location.x > inputData.roomDimensions[0]) {
      incrementWallhit(wallHits + 1)
      wall = wallHits + 1
      next_location = current_location
    }
    return { location: next_location, wall  }
  }

  const checkDirtLocation = (location) => {
    let dirt = dirtCollected
    inputData.dirtLocations.forEach(loc => {
      if (loc[0] === location[0] && loc[1] === location[1]) {
        incrementDirtCollected(dirtCollected + 1)
        dirt = dirtCollected + 1
      }
    });
    return dirt
  }

  const reset = () => {
    setRecords([
      {
        location: {
          x: 1,
          y: 1
        },
        dirtCollected: 0,
        action: null,

      }
    ])
    incrementWallhit(0)
    incrementDirtCollected(0)
  }

  return (
    <div className="container bg padding-m">
      {/* buttons (next and reset) */}
      <h1>Controls</h1>
      <div className="flex">
        <button disabled={records.length > inputData.drivingInstructions.length} onClick={nextStep}>Next Step</button>
        <button onClick={reset}>Reset</button>
      </div>

      {/* invisible table to hold roomba */}
      <h1>The Room</h1>
      <table style={{ width: "100%", border: "solid 1px white" }}>
        {rowsNColumns(inputData.roomDimensions, records[records.length - 1].location)}
      </table>

      {/* output table */}
      <h1>Output</h1>
      <table>
        <tr>
          <th>Step</th>
          <th>Roomba Location</th>
          <th>Action</th>
          <th>Total Dirt Collected</th>
          <th>Total Wall Hits</th>
        </tr>
        {records.map((record, index) => {
          return (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{record.location.x},{record.location.y}</td>
              <td>{record.action}</td>
              <td>{record.dirtCollected}</td>
              <td>{record.wallHits}</td>
            </tr>
          )
        })}
      </table>
    </div>
  );
}

const rowsNColumns = (dimensions, currentLocation) => {
  let rNc = []
  for (let i = 0; i < dimensions[1]; i++) {
    rNc.push(<tr>
              {columns(dimensions[0], i, currentLocation)}
            </tr>)
  }
  return rNc
}

const columns = (column_width, row, currentLocation) => {
  let columns = []
  for (let i = 0; i < column_width; i++) {
    columns.push(
      <td style={{ height: "25px", width: "25px" }}>
        {i === currentLocation.x && row === currentLocation.y &&
          <Roomba />
        }
      </td>
    )
  }
  return columns
}

export default App;
