import { useState } from 'react'

const Header = ({ text }) => <h1>{text}</h1>

const Button = (props) => (
  <button onClick={props.handleClick}>
    {props.name}
  </button>
)

const StatisticLine = (props) => {
  return(
    <tbody>
      <tr>
        <td>{props.text}</td> 
        <td>{props.value}</td> 
        <td>{props.mark}</td>
      </tr>
    </tbody>
  )
}

const Statistics = ({ good, neutral, bad }) => {
  if ((good || neutral || bad) != 0) {
    return(
      <table>
        <StatisticLine text="good" value={good}/>
        <StatisticLine text="neutral" value={neutral}/>
        <StatisticLine text="bad" value={bad}/>
        <StatisticLine text="all" value={good + neutral + bad}/>
        <StatisticLine text="average" value={(good - bad)/
        (good + neutral + bad)}/>
        <StatisticLine text="positive" value={100 * good/
        (good + neutral + bad)} mark="%"/>
      </table>
    )
  }
  return(
    <div>No feedback given</div>
  )
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <Header text="give feedback"/>
      <Button handleClick={() => setGood(good + 1)} name="good"/>
      <Button handleClick={() => setNeutral(neutral + 1)} name="neutral"/>
      <Button handleClick={() => setBad(bad + 1)} name="bad"/>
      <Header text="statistics"/>
      <Statistics good={good} neutral={neutral} bad={bad}/>
    </div>
  )
}

export default App