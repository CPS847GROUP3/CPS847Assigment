import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import './App.css';
import { TextField } from '@material-ui/core';
import { useEffect, useState } from 'react';

function App() {
  const [questionsAndAnswers, setQuestionsAndAnswers] = useState([]);

  useEffect(() => {
    async function getData() {
      const response = await fetch('api/questionsAndAnswers');
      const body = await response.json();
      setQuestionsAndAnswers(body.data);
    }

    getData();

  }, []);

  
  return (
    <div className="App">
      <header className="App-header">
        <p>
          Questions and Answers for Slack bot
        </p>
      </header>
      <TableContainer component={Paper}>
      <Table  aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="center">Questions</TableCell>
            <TableCell align="center">Answers</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {questionsAndAnswers.map((questionsAndAnswer) => (
            <TableRow key={questionsAndAnswer.question}>
              <TableCell align="left">{questionsAndAnswer.question}</TableCell>
              <TableCell align="left">{questionsAndAnswer.answer}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {/* <TextField id="standard-basic" label="Standard" /> */}
    </TableContainer>
    </div>
  );
}

export default App;
