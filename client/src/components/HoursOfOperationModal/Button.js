import React from 'react'
import styled from '@emotion/styled'
import system from '../../design/theme'

const Button = ({ handleHours, showHandleHours, id, day, name }) => {
  return (
    <Container>
      <button name={name} onClick={showHandleHours} className="days">
        {name}
      </button>
      {day === true ? (
        <div className="buttons">
          <button id={id} onClick={handleHours} name="open">
            open
          </button>
          <button id={id} onClick={handleHours} name="close">
            close
          </button>
        </div>
      ) : null}
    </Container>
  )
}

export default Button

const Container = styled('div')`
  display: flex;
  flex-direction: column;
  /* justify-content: center; */
  margin: 0 auto;
  .days {
    border-radius: ${system.borders.bigRadius};
    background: ${system.color.neutral};
    border: 0;
    box-shadow: ${system.shadows.button};
    padding: ${system.spacing.standardPadding};
    margin-bottom: 10px;
    cursor: pointer;
    &:hover {
      background: ${system.color.button};
      box-shadow: ${system.shadows.buttonHoverLight};
    }
  }
  .buttons {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
    button {
      margin: 5px;
    }
  }
`
