const Header = (course) => {
  return (
    <h2>{course.name}</h2>
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
    <b>total of {parts.reduce((total, element) => total + element.exercises, 0)} exercises</b>
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