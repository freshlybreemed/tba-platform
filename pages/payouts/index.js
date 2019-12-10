/* eslint-disable react/react-in-jsx-scope */
import Head from "next/head";
import { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

// import MyEvents from '../../components/MyEvents';
import Payouts from "../../components/Payouts";
import fetch from "isomorphic-unfetch";
import { AUTH_CONFIG } from "../../lib/auth0-variables";

const host = AUTH_CONFIG.host;
class PayoutsPage extends Component {
  static propTypes = {
    events: PropTypes.array,
    dispatch: PropTypes.func
  };
  constructor(props) {
    super(props);
    this.state = {
      loading: true
    };
  }

  render() {
    return (
      <>
        <Head>
          <meta property="og:title" content="My Events" />
          <title>My Events</title>
        </Head>
        <Payouts loading={this.state.loading} events={this.props.events} />
      </>
    );
  }
}

const mapStateToProps = state => ({ events: state.myEvents });

export default connect(mapStateToProps)(PayoutsPage);
