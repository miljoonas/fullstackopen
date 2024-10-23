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

const Content = ({ parts }) => {
  return (
    parts.map(element => {
      return <Part key={element.id} name={element.name} exer={element.exercises} />
    })
  )
}

const Total = ({ parts }) => {
  return (
    <b>Number of exercises {parts.reduce((total, element) => total + element.exercises, 0)}</b>
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