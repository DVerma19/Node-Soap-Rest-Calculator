import React, {useEffect, useState} from 'react';
import axios from 'axios';
import './App.css';
//const port = process.env.PORT || 8000;


function App() {
  const [num1, setNum1] = useState();
  const [num2, setNum2] = useState();
  const [result, setResult] = useState();
  const[word, setWord] = useState();
  const[welcomeMsg, setWelcomeMsg] = useState();

  useEffect(() => {getStartPage()}, [])

  const handleInput1 = (event) => {
    setNum1(parseInt(event.target.value));
  }
  const handleInput2 = (event) => {
    setNum2(parseInt(event.target.value));
  }

  const getStartPage = () => {
    axios({
      method: 'get',
      url: `https://node-soap-dhruv.herokuapp.com/`
      })
    .then((response) => {
      setWelcomeMsg(response.data);
    });
  }
  const addReq = () => {
    
    if(!num1 || !num2){ alert ("Numbers cannot be empty");}
    else {
      const body = [{"intA": num1, "intB": num2}]
      axios({
        method: 'post',
        url: `https://node-soap-dhruv.herokuapp.com/add`,
        data: body
      })
      .then((response) => {
        var addVal = response.data[0].AddResult;
        setResult(addVal);
      });
    }
  }

  const subReq = () => {
  
    if(!num1 || !num2){ alert ("Numbers cannot be empty");}
    else {
      const body = [{"intA": num1, "intB": num2}]
      axios({
        method: 'post',
        url: `https://node-soap-dhruv.herokuapp.com/sub`,
        data: body
      })
      .then((response) => {
        var subVal = response.data[0].SubtractResult;
        setResult(subVal);
      });
    }
  }

  const multReq = () => {
    
    if(!num1 || !num2){ alert ("Numbers cannot be empty");}
    else {
      const body = [{"intA": num1, "intB": num2}]
      axios({
        method: 'post',
        url: `https://node-soap-dhruv.herokuapp.com/mult`,
        data: body
      })
      .then((response) => {
        var multVal = response.data[0].MultiplyResult;
        setResult(multVal);
      });
    }
  }

  const divReq = () => {
  
    if(!num1 || !num2){ alert ("Numbers cannot be empty");}
    else {
      const body = [{"intA": num1, "intB": num2}]

      axios({
        method: 'post',
        url: `https://node-soap-dhruv.herokuapp.com/div`,
        data: body
      })
      .then((response) => {
        var divVal = response.data[0].DivideResult;
        setResult(divVal);
      });
      }
  }

  const wordReq = () => {
    
    if(result == null) {alert('Perform a mathematical Operation!')}
    else{
      var reqResult = parseInt(result);

      if(reqResult < 0) {setWord('Number is not positive!')}
      
      else {
        const body = [{"ubiNum": reqResult}]

        axios({
          method: 'post',
          url: `https://node-soap-dhruv.herokuapp.com/word`,
          data: body
        })
        .then((response) => {
          var wordVal = response.data[0].NumberToWordsResult;
          setWord(wordVal);
        });
      }
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>{welcomeMsg}</h1>

        <div id = "main-div">
        <span><label>Enter Number 1</label></span><input type="text" value={num1} onChange={handleInput1} />
        <br />
        <span><label>Enter Number 2</label></span><input type="text" value={num2} onChange={handleInput2} />
        <br />
        <br />
        <button onClick={addReq}>Add</button>
        <button onClick={subReq}>Subtract</button>
        <button onClick={multReq}>Multiply</button>
        <button onClick={divReq}>Divide</button>
        <br />
        <br />
        <input type="text" value={result} disabled/>
        <br />
        <button onClick={wordReq}>Number To Words</button>
        <br />
        <br />
        <input type="text" value={word} disabled/>
        </div>
      </header>
    </div>
  );
}

export default App;
