/* eslint-disable react/react-in-jsx-scope */
import Head from 'next/head';
import Event from '../components/Event';
import fetch from 'isomorphic-unfetch'
import { connect } from 'react-redux';
import {AUTH_CONFIG} from '../lib/auth0-variables';

const host = AUTH_CONFIG.host

const EventPage = ({json}) => {
  return (
    <>
      <Head>
        <meta property="og:title" content={json.title} />
        {/* <meta property="og:site_name" content="Uno"/> */}
        <meta property="og:image" content={json.image.cdnUri} />
        <script src="https://js.stripe.com/v3/"></script>
        <link rel="stylesheet" href="/static/react-vis.css" />
        <link rel="stylesheet" href="/static/store.css" />

      </Head>
      <Event json={json}/>
    </>
  );
}
EventPage.getInitialProps = async ({store}) => {
  console.log("store ")
  const res = await fetch(`${host}/api/event/the-hav-mercy-show`)
  const json = await res.json()
  console.log(json)
  return { json: json[0] }
  // }
}

export default connect()(EventPage);
