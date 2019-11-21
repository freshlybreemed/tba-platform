/* eslint-disable react/react-in-jsx-scope */
import Head from "next/head";
import { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

// import MyEvents from '../../components/MyEvents';
import PayoutSettings from "../../components/PayoutSettings";
import fetch from "isomorphic-unfetch";
import { AUTH_CONFIG } from "../../lib/auth0-variables";

const host = AUTH_CONFIG.host;
class PayoutSettingsPage extends Component {
  static propTypes = {
    evenuserts: PropTypes.obj,
    dispatch: PropTypes.func
  };

  render() {
    return (
      <>
        <Head>
          <meta property="og:title" content="My Events" />
          <title>Payout Settings</title>
        </Head>
        <PayoutSettings user={this.props.user} />
      </>
    );
  }
}

const mapStateToProps = state => ({ user: state.user });

export default connect(mapStateToProps)(PayoutSettingsPage);
