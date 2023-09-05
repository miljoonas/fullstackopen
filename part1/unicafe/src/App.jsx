import { useState } from 'react'

const Button = ({ handleClick, text }) => <button onClick={handleClick}>{text}</button>

const StatisticLine = ({ text, value }) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  )
}

const Statistics = (props) => {
  if (props.stats.all === 0) {
    return <p>No feedback given</p>
  }
  else {
    return (
      <div>
        <StatisticLine text="good" value={props.stats.g} />
        <StatisticLine text="neutral" value={props.stats.n} />
        <StatisticLine text="bad" value={props.stats.b} />
        <StatisticLine text="all" value={props.stats.all} />
        <StatisticLine text="average" value={props.stats.avg} />
        <StatisticLine text="positive" value={props.stats.pos} />
      </div>
    )
  }
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const stats = {
    g: good,
    n: neutral,
    b: bad,
    all: good + neutral + bad,
    avg: (good - bad) / (good + neutral + bad),
    pos: (good / (good + neutral + bad)) * 100 + " %"
  }

  return (
    <div>
      <h1>give feedback</h1>
      <Button
        handleClick={() => setGood(good + 1)}
        text='good'
      />
      <Button
        handleClick={() => setNeutral(neutral + 1)}
        text='neutral'
      />
      <Button
        handleClick={() => setBad(bad + 1)}
        text='bad'
      />
      <h1>statistics</h1>
      <Statistics stats={stats} />
    </div>
  )
}

export default App