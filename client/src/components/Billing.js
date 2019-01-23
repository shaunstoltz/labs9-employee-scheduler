import React, { Component } from 'react'
import { CardElement, injectStripe } from 'react-stripe-elements'
import propTypes from 'prop-types'
import BreadCrumb from './BreadCrumb'
import LeftSideBar from './LeftSideBar'
import OuterContainer from './common/OuterContainer'
import Button from './common/Button'
import styled from '@emotion/styled'
import system from '../design/theme'
import axios from 'axios'
import { connect } from 'react-redux'
import Loader from './Loader'
import Status from './Status'
import { fetchOrgFromDB } from '../actions'

class Billing extends Component {
  constructor(props) {
    super(props)
    this.state = {
      paid: false,
      loading: false,
      signupSuccess: false,
      cancelSuccess: false,
      error: false
    }
    this.submit = this.submit.bind(this)
    this.cancelSub = this.cancelSub.bind(this)
  }

  componentDidMount = () => {
    this.props.fetchOrgFromDB(this.props.user.organization_id, this.props.token)
  }

  async submit(ev) {
    // User clicked submit
    ev.preventDefault()
    this.setState({
      loading: true,
      signupSuccess: false,
      cancelSuccess: false,
      error: false
    })
    // Tokenize payment info by sending to Stripe server
    const { token } = await this.props.stripe.createToken({
      name: `${this.props.user.first_name} ${this.props.user.last_name}`
    })
    const submission = {
      token: token,
      email: this.props.user.email,
      org_id: this.props.user.organization_id
    }
    // create customer and subscription in our back-end
    axios
      .post(`${process.env.REACT_APP_SERVER_URL}/stripe`, submission, {
        headers: { authorization: this.props.token }
      })
      .then(res => {
        this.setState({
          loading: false,
          signupSuccess: true,
          cancelSuccess: false,
          error: false
        })
        this.props.fetchOrgFromDB(
          this.props.user.organization_id,
          this.props.token
        )
      })
      .catch(err => {
        console.log(err)
        this.setState({
          loading: false,
          signupSuccess: false,
          cancelSuccess: false,
          error: true
        })
      })
  }

  deleteHandler = ev => {
    ev.preventDefault()
    const r = window.confirm(
      'Are you sure you want to cancel your subscription?'
    )

    if (r) {
      return this.cancelSub(ev)
    }
  }

  cancelSub = ev => {
    ev.preventDefault()
    this.setState({
      loading: true,
      signupSuccess: false,
      cancelSuccess: false,
      error: false
    })
    const submission = {
      subscription_id: this.props.organization.subscription_id,
      org_id: this.props.user.organization_id
    }
    axios
      .put(`${process.env.REACT_APP_SERVER_URL}/stripe`, submission, {
        headers: { authorization: this.props.token }
      })
      .then(res => {
        this.props.fetchOrgFromDB(
          this.props.user.organization_id,
          this.props.token
        )
        this.setState({
          loading: false,
          signupSuccess: false,
          cancelSuccess: true,
          error: false
        })
      })
      .catch(err => {
        console.log(err)
        this.setState({
          loading: false,
          signupSuccess: false,
          cancelSuccess: false,
          error: true
        })
      })
  }

  render() {
    if (Boolean(this.props.organization.paid)) {
      return (
        <OuterContainer height="true">
          <LeftSideBar />
          <BreadCrumb location="Billing" />

          <Container danger>
            <h1>Billing</h1>

            {this.state.loading ? <Loader /> : null}
            {this.state.signupSuccess ? (
              <Status success={this.state.signupSuccess}>
                You're signed up for our $20/mo plan, with a 14-day free trial!
                <span role="img" aria-label="smiling eyes emoji">
                  &#x1F60A;
                </span>
              </Status>
            ) : null}
            {this.state.cancelSuccess ? (
              <Status success={this.state.cancelSuccess}>
                You've successfully canceled your account, but we're sad to see
                you go.
                <span role="img" aria-label="weeping emoji">
                  &#x1F62D;
                </span>
              </Status>
            ) : null}
            {this.state.error ? (
              <Status>
                Something's wrong. Computers make mistakes, too!
                <span role="img" aria-label="wink emoji">
                  &#x1F916;
                </span>
                Please try again.
              </Status>
            ) : null}

            <form onSubmit={this.deleteHandler}>
              <h6 id="instructions">
                Here's what's included in the $20 / month SMB Plan:
              </h6>
              <ul>
                <li>A simple calendar interface to manage shifts</li>
                <li>
                  An employee directory to add new users and adjust
                  availability.
                </li>
                <li>
                  A PTO management system for employees' time off requests.
                </li>
                <li>
                  A convenient dashboard where an employee can see their shifts
                  and time off.
                </li>
                <li>Up to 20 seats in our software.</li>
                <li>Different views for you, supervisors, and employees.</li>
              </ul>
              <Button className="danger" type="submit">
                Delete
              </Button>
            </form>
          </Container>
        </OuterContainer>
      )
    }

    return (
      <OuterContainer height="true">
        <LeftSideBar />
        <BreadCrumb location="Billing" />

        <Container>
          <h1>Billing</h1>

          {this.state.loading ? <Loader /> : null}
          {this.state.signupSuccess ? (
            <Status success={this.state.signupSuccess}>
              You're signed up for our $20/mo plan, with a 14-day free trial!
              <span role="img" aria-label="smiling eyes emoji">
                &#x1F60A;
              </span>
            </Status>
          ) : null}
          {this.state.cancelSuccess ? (
            <Status success={this.state.cancelSuccess}>
              You've successfully canceled your account, but we're sad to see
              you go.
              <span role="img" aria-label="weeping emoji">
                &#x1F62D;
              </span>
            </Status>
          ) : null}
          {this.state.error ? (
            <Status>
              Something's wrong. Computers make mistakes, too!
              <span role="img" aria-label="wink emoji">
                &#x1F916;
              </span>
              Please try again.
            </Status>
          ) : null}

          <form onSubmit={this.submit}>
            <h6 id="instructions">
              Here's what's included in the $20 / month SMB Plan:
            </h6>
            <ul>
              <li>A simple calendar interface to manage shifts</li>
              <li>
                An employee directory to add new users and adjust availability.
              </li>
              <li>A PTO management system for employees' time off requests.</li>
              <li>
                A convenient dashboard where an employee can see their shifts
                and time off.
              </li>
              <li>Up to 20 seats in our software.</li>
              <li>Different views for you, supervisors, and employees.</li>
            </ul>
            <CardElement />
            <Button type="submit">Pay</Button>
          </form>
        </Container>
      </OuterContainer>
    )
  }
}

const mapStateToProps = state => {
  return {
    user: state.auth.user,
    token: state.auth.token,
    organization: state.organization.details
  }
}

export default connect(
  mapStateToProps,
  { fetchOrgFromDB }
)(injectStripe(Billing))

Billing.propTypes = {
  // adding propTypes here
  user: propTypes.object,
  fetchOrgFromDB: propTypes.func.isRequired,
  token: propTypes.string.isRequired,
  error: propTypes.string
}

const Container = styled('div')`
  margin: 0 7.5rem;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;

  form {
    display: flex;
    position: relative;
    flex-flow: column nowrap;
    width: 60%;
    background: ${system.color.white};
    padding: ${system.spacing.bigPadding};
    border-radius: ${system.borders.bigRadius};
    box-shadow: ${system.shadows.otherLight};
    margin-bottom: 20px;

    #instructions {
      font-size: ${system.fontSizing.m};
      color: ${system.color.bodytext};
    }

    ul {
      list-style-type: disc;
      margin: 2rem;
      li {
        font-size: ${system.fontSizing.sm};
        margin-bottom: 1rem;
      }
    }

    .StripeElement {
      padding: 10px;
      border-bottom: 2px solid #d2d2d2;
      transition: ${system.transition};
      font-size: 20px !important;

      input {
        font-family: 'Nunito' !important;
      }
    }

    .StripeElement--focus {
      border-bottom: 2px solid ${system.color.primary};
    }

    .StripeElement--invalid {
      border-bottom: 2px solid crimson !important;

      input {
        color: ${system.color.danger};
      }
    }

    button {
      width: 150px;
      margin-top: 40px;
      background: ${props => (props.danger ? system.color.danger : null)};
    }
  }
`
