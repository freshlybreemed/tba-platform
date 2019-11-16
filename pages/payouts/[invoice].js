import Invoice from '../../components/Invoice';
import Manage from '../../components/Manage';
import { connect } from 'react-redux';
import { Component } from 'react';

import Head from 'next/head';
import fetch from 'isomorphic-unfetch';
import { AUTH_CONFIG } from '../../lib/auth0-variables';

const host = AUTH_CONFIG.host;

class InvoicePage extends Component {
  static async getInitialProps(context) {
    const { invoice } = context.query;
    console.log('json', invoice);
    const res = await fetch(`${host}/api/event/${invoice}`);
    const json = await res.json();
    console.log(json);
    const errorCode = json.length === 1 ? 200 : 404;

    return { data: json[0], errorCode };
  }
  async componentDidMount() {
    var user_data = localStorage.getItem('user_details');
    var isLoggedIn = localStorage.getItem('isLoggedIn');
    const data = JSON.parse(user_data);
    console.log('cmon', this.props);
    if (isLoggedIn) {
      console.log(`logged in `);
      const res = await fetch(`${host}/api/events/${data.sub}`);
      const resUser = await fetch(`${host}/api/user/${data.sub}`);
      const user = await resUser.json();
      this.props.dispatch({
        type: 'fetch_user',
        payload: user[0],
      });
      this.props.dispatch({
        type: 'fetch_event',
        payload: this.props.data,
      });
      this.setState({ loading: false });
    } else {
      console.log(`not logged in `);
      this.setState({ loading: false });
    }
  }
  render() {
    const { data, errorCode } = this.props;
    console.log('data');
    console.log(data);
    var response;
    switch (errorCode) {
      case 200:
        response = <Invoice event={data} />;
        break;
      case 404:
        response = <>Sorry that event is not available.</>;
        break;
    }
    return (
      <>
        <Head>
          {/* <link rel="stylesheet" href="/static/react-vis.css" /> */}
        </Head>
        {response}
      </>
    );
  }
}

export default connect()(InvoicePage);
