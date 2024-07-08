const Header = ({ name }) => {
    return(
      <h1>
        {name}
      </h1>
    )
  }
  
  const Part = (props) => {
    return (
      <p>{props.name} {props.exercises}</p>
    )
  }
  
  const Content = ({ parts }) => {
    return(
      <div>      
        {parts.map(part => 
          <Part key={parts.id} name={part.name} exercises={part.exercises}/>
        )}    
      </div>
    )
  }
  
  const Total = ({ parts }) => {
    const total = parts.reduce((total_exercises, part) => total_exercises + part.exercises, 0)
    return(
      <div>
        <p>Total of {total} exercises</p>
      </div>
    )
  }
  
  const Course = ({ course }) => {
    return (
      <div>
        <Header name = {course.name} />
        <Content parts = {course.parts}/>
        <Total parts = {course.parts}/>
      </div>
    )
  }

  export default Course