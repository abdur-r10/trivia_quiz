import { useState, useEffect } from "react";
import Quiz from "./Component/Quiz.js";
import Main from "./Component/Main.js"
import './App.css';
import {nanoid} from "nanoid"
import he from 'he' //to convert html entities into characters 
import Confetti from 'react-confetti'

 
export default function App() {

  //state to start game
  const [start, setStart] = useState(false);

  //initialising data state
  const [data, setData] = useState([]);

  //isSelected state initialised
  const [quiz, setQuiz] = useState([]);

  //submit state initialised
  const [submit, setSubmit] = useState(false);

  //count state initialised
  const [score, setScore] = useState(0);

  //newGame state initialised
  const [newGame, setNewGame] = useState(false)


  //function to toggle start
  function startQuiz() {
    setStart(prevStart => !prevStart)
  }
  
  //api call to get data
  useEffect(() => {
    fetch("https://opentdb.com/api.php?amount=7&type=multiple")
      .then(res => res.json())
      .then(data => setData(data.results))
  }, [newGame])
  
  //claning data up to how we want to store it and randomising the options then setting it as quiz quiz 
  //using a copy of data to avoid causing a side-effect
  useEffect( () => {
    let randomisedQuiz = [...data].map(item => {return {key: nanoid(), question: he.decode(item.question), questionId: nanoid(), options: [
      {answerText: he.decode(item.correct_answer), isCorrect: true, isSelected: false, id: nanoid()},
      {answerText: he.decode(item.incorrect_answers[0]), isCorrect: false, isSelected: false, id: nanoid()},
      {answerText: he.decode(item.incorrect_answers[1]), isCorrect: false, isSelected: false, id: nanoid()},
      {answerText: he.decode(item.incorrect_answers[2]), isCorrect: false, isSelected: false, id: nanoid()}
      ]
    }})

    //actually randomising it here
    randomisedQuiz.map(item => item.options.sort((a, b) => 0.5 - Math.random()))
    setQuiz(randomisedQuiz)
  }, [data])

  //!!!!!!!!!!
  //API url
  //const API_URL = 'https://opentdb.com/api.php?amount=7&type=multiple'
  //!!!!!!!!!!

  //toggle isSelected and only allowing one option to be selected at a time
  function toggleIsSelected(optionId, questionId) {
    const copyOfQuiz = [...quiz]

    const indexOfQuestion = quiz.findIndex(object => {
      return object.questionId === questionId;
    });
   
   copyOfQuiz[indexOfQuestion].options.map(option => {
     if(option.id === optionId){
       return(option.isSelected = true)
     }
     else return (option.isSelected = false)
   })
   
    setQuiz(copyOfQuiz)
  }

  //function to check answers and keep track of score and alert if not all questions are answered
  function checkAnswers() {
    let selectedAcc = 0
    let newCount = 0
    quiz.map(item => {
      item.options.map(option => {
        if(option.isSelected && option.isCorrect){
          newCount += 1 
          selectedAcc += 1
        }
        else if(option.isSelected && option.isCorrect === false) {
          selectedAcc += 1
        }
      })
      
    }
    )
    if(selectedAcc === 7){
      setSubmit(prevSubmit => !prevSubmit)
      setScore(newCount)
    }
    else 
      alert('You have not answered all questions!') 
  }

  //function to start new game by toggling newGame and submit
  function startNewGame() {
    setNewGame(prevNewGame => !prevNewGame)
    setSubmit(prevSubmit => !prevSubmit)
  }


  
  //render
  return (
    <main className="App">
      {start 
      ? (
      <>
      {quiz.map(item =>
        (
      <Quiz
        key={item.key}
        questionId={item.questionId}
        question={item.question}
        options={item.options}
        toggleIsSelected={toggleIsSelected}
        submit={submit}
      />
      ))}
      <button className='check--button' onClick={checkAnswers}>Mark Answers</button>
      {submit && 
      <div className='score--container'> 
        <h3 className='display--score'>{`Your score is ${score}/${quiz.length}`}</h3> 
        <button className='newGame--button' onClick={startNewGame}>New Game</button>
        {score === 7 ? <Confetti width={'1500%'} height={'3000%'}/> : ''}
      </div>}
      </>
      ) 
      : (
      <Main startQuiz={startQuiz}/>
      )
      }
    </main>
  );
}