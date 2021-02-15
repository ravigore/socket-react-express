import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
export default function ScoreBoard() {
  const [startRaceData, setRaceData] = useState([]);
  const [finishResult, setFinishResult] = useState([]);
  const [tableResult, setTableResult] = useState([]);

  useEffect(() => {
    const socket = socketIOClient("/");
    socket.on("start", (data) => {
      setTableResult(data);
      setRaceData(data);
    });
    socket.on("finish", (data) => {
      let res = data.sort((a, b) => Number(b.time) - Number(a.time));
      setTableResult(res);
      setFinishResult(data);
    });
  });

  return (
    <div>
      <p>{JSON.stringify(startRaceData)}</p>
      <p>{JSON.stringify(finishResult)}</p>
      <h2>Score Board</h2>
      <table>
        <tbody>
          <tr>
            <th>No</th>
            <th>Horse</th>
            <th>Time</th>
          </tr>
          {tableResult.map((data, index) => (
            <tr key={index}>
              <td>{data.id}</td>
              <td>{data.name}</td>
              <td>{data.time && data.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
