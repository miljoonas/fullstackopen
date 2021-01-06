import React from 'react'
import ReactDOM from 'react-dom'

const Header = (course) => {
  return (
    <h1>{course.name}</h1>
  )
}

const Part = (param) => {
  return (
    <p>{param.part} {param.exer}</p>
  )
}

const Content = (param) => {
  return (
    <div>
      <Part part={param.a1} exer={param.a2}/>
      <Part part={param.b1} exer={param.b2}/>
      <Part part={param.c1} exer={param.c2}/>
    </div>
  )
}

const Total = (param) => {
  return (
    <p>Number of exercises {param.all}</p>
  )
}

const App = () => {
  const course = 'Half Stack application development'
  const part1 = 'Fundamentals of React'
  const exercises1 = 10
  const part2 = 'Using props to pass data'
  const exercises2 = 7
  const part3 = 'State of a component'
  const exercises3 = 14

  return (
    <div>
      <Header name={course} />
      <Content a1={part1} a2={exercises1} b1={part2} b2={exercises2} c1={part3} c2={exercises3} />
      <Total all={exercises1 + exercises2 + exercises3} />
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
