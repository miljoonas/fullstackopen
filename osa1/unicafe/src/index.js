import React, { useState } from 'react'
import ReactDOM from 'react-dom'

const Button = ({ onClick, text }) => (
  <button onClick={onClick}>
    {text}
  </button>
)

const StatisticLine = ({text, value}) => {
  return(
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
    )
}

const Statistics = (props) => {
  if(props.stats.all === 0){
    return <p>No feedback given</p>
  } else {
    return(
      <table>
        <tbody>
          <StatisticLine text = {"good"} value = {props.stats.g}/>
          <StatisticLine text = {"neutral"} value = {props.stats.n}/>
          <StatisticLine text = {"bad"} value = {props.stats.b}/>
          <StatisticLine text = {"all"} value = {props.stats.all}/>
          <StatisticLine text = {"average"} value = {props.stats.avg}/>
          <StatisticLine text = {"positive"} value = {props.stats.pos}/>
        </tbody>
      </table>
    )
  }
}

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const stats = {
    g: good,
    n: neutral,
    b: bad,
    all: good+neutral+bad,
    avg: (good-bad)/(good+neutral+bad),
    pos: (good/(good+neutral+bad))*100 +" %"
  }

  return (
    <div>
      <h1>give feedback</h1>
      <Button onClick = {() => setGood(good + 1)} text = 'good' />
      <Button onClick = {() => setNeutral(neutral + 1)} text = 'neutral' />
      <Button onClick = {() => setBad(bad + 1)} text = 'bad' />
      <h1>statistics</h1>
      <Statistics stats = {stats}/>
    </div>
  )
}

ReactDOM.render(<App />, 
  document.getElementById('root')
)