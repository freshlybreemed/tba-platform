/* eslint-disable react/react-in-jsx-scope */
import Head from "next/head";
import { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import MyEvents from "../components/MyEvents";
import fetch from "isomorphic-unfetch";
import { AUTH_CONFIG } from "../lib/auth0-variables";

const host = AUTH_CONFIG.host;
class MyEventsPage extends Component {
  static propTypes = {
    events: PropTypes.array,
    dispatch: PropTypes.func
  };
  constructor(props) {
    super(props);
    this.state = {
      events: [],
      loading: true
    };
  }

  async componentDidMount() {
    var user_data = localStorage.getItem("user_details");
    var isLoggedIn = localStorage.getItem("isLoggedIn");
    const data = JSON.parse(user_data);
    if (isLoggedIn) {
      console.log(`logged in `);
      const res = await fetch(`${host}/api/events/${data.sub}`);
      const resUser = await fetch(`${host}/api/user/${data.sub}`);
      const user = await resUser.json();
      const events = await res.json();
      this.props.dispatch({
        type: "fetch_user",
        payload: user[0]
      });
      this.props.dispatch({
        type: "fetch_events",
        payload: events
      });
      this.setState({ loading: false });
    } else {
      console.log(`not logged in `);
      this.setState({ loading: false });
    }
  }
  render() {
    return (
      <>
        <Head>
          <meta property="og:title" content="My Events" />
          <title>My Events</title>
        </Head>
        <MyEvents loading={this.state.loading} events={this.props.events} />
      </>
    );
  }
}

const mapStateToProps = state => ({ events: state.myEvents });

export default connect(mapStateToProps)(MyEventsPage);
