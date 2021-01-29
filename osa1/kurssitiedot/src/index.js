import React from 'react'
import ReactDOM from 'react-dom'

const Header = (course) => {
  return (
    <h1>{course.name}</h1>
  )
}

const Part = (param) => {
  return (
    <p>{param.name} {param.exer}</p>
  )
}

const Content = (param) => {
  return (
    <div>
      <Part name={param.parts[0].name} exer={param.parts[0].exercises}/>
      <Part name={param.parts[1].name} exer={param.parts[1].exercises}/>
      <Part name={param.parts[2].name} exer={param.parts[2].exercises}/>
    </div>
  )
}

const Total = (param) => {
  return (
    <p>Number of exercises {param.parts[0].exercises + param.parts[1].exercises + param.parts[2].exercises}</p>
  )
}

const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10,
      },
      {
        name: 'Using props to pass data',
        exercises: 7,
      },
      {
        name: 'State of a component',
        exercises: 14,
      }
    ]
  } 

  return (
    <div>
      <Header name={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
