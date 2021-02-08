import React from 'react'

const Header = (props) => {
    return (
      <h1>{props.name}</h1>
    )
  }
  
  const Part = (props) => {
    return (
      <p>{props.name} {props.exer}</p>
    )
  }
  
  const Content = ({ parts }) => {
    return (
      parts.map(element => {
        return <Part key={element.id} name={element.name} exer={element.exercises} />
      })
    )
  }
  
  const Total = ({ parts }) => {
    return (
      <p><strong>total of {parts.reduce((acc, i) => acc + i.exercises, 0)} exercises </strong></p>
    )
  }
  
  const Course = ({ course }) => {
    return (
      <div>
        <Header name={course.name} />
        <Content parts={course.parts} />
        <Total parts={course.parts} />
      </div>
    )
  }

  export default Course