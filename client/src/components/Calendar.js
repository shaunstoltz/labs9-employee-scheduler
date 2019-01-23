import React from 'react'
import BigCalendar from 'react-big-calendar'
import moment from 'moment'
import styled from '@emotion/styled'
import system from '../design/theme'

import 'react-big-calendar/lib/css/react-big-calendar.css'
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'

const localizer = BigCalendar.momentLocalizer(moment)

export default function Calendar(props) {
  const { names } = props
  const colors = [
    '#E91E63',
    '#3F51B5',
    '#ff7473',
    '#79bd9a',
    '#8F2D56',
    '#C89EC4',
    '#2196F3',
    '#03A9F4',
    '#00BCD4',
    '#009688',
    '#00695C',
    '#D84315',
    '#FFC107',
    '#FF5722',
    '#AD1457',
    '#6200EA',
    '#2962FF',
    '#00838F',
    '#FF8F00',
    '#558B2F'
  ]
  let style = []
  for (let i = 0; i < names.length; i++) {
    style.push(`.${names[i]} {background: ${colors[i]};}`)
  }

  return (
    <StyledCalendar
      {...props}
      colors={style.join(' ')}
      localizer={localizer}
      views={['week', 'day']}
      step={30}
    />
  )
}

const StyledCalendar = styled(BigCalendar)`
  width: 100%;
  padding: ${system.spacing.hugePadding};

  ${props => props.colors} .rbc-event {
    border: 1px solid ${system.color.white};
  }

  .rbc-event-label {
    margin: 10px 0 0 7.5px;
  }

  .rbc-event-content {
    margin-left: 7.5px;
  }

  .rbc-header {
    padding-top: 5px;
  }

  /* the below makes the Agenda view normally colored instead of the same color as events */
  table,
  tr,
  td {
    background: transparent !important;
  }
`
