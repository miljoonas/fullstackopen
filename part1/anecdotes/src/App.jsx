import { useState } from 'react'

const Button = ({ handleClick, text }) => <button onClick={handleClick}>{text}</button>

const ShowAnecdote = ({ selected, points, anecdotes }) => {
  return (
    <div>
      {anecdotes[selected]}
      <p>has {points[selected]} votes</p>
    </div>
  )
}

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]

  const [selected, setSelected] = useState(0)
  const [points, setVotes] = useState(new Array(anecdotes.length).fill(0))
  const [index, setIndex] = useState(0)

  const Next = () => {
    const rand = Math.floor(Math.random() * points.length)
    setSelected(rand)
    setVotes(points)
  }

  const Vote = () => {
    const copy = [...points]
    copy[selected] += 1
    setVotes(copy)
    const max = Math.max(...copy)
    setIndex(copy.indexOf(max))
  }

  return (
    <div>
      <h1>Anecdote of the day</h1>
      <ShowAnecdote selected={selected} points={points} anecdotes={anecdotes} />
      <Button handleClick={Vote} text="vote" />
      <Button handleClick={Next} text="next anecdote" />
      <h1>Anecdote with most votes</h1>
      <ShowAnecdote selected={index} points={points} anecdotes={anecdotes} />
    </div>
  )
}

export default App