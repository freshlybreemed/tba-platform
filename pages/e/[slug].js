/* eslint-disable react/react-in-jsx-scope */
import Head from 'next/head';
import Event from '../../components/Event';
import fetch from 'isomorphic-unfetch'
import { connect } from 'react-redux';
import {AUTH_CONFIG} from '../../lib/auth0-variables';

const host = AUTH_CONFIG.host
const EventPage = ({json, errorCode}) => {
    var response
    switch (errorCode){
        case 200: 
            response =  
            <>
                <Head>
                    <meta property="og:title" content={json.title} />
                    {/* <meta property="og:site_name" content="Uno"/> */}
                    <meta property="og:image" content={json.image} />
                    <script src="https://js.stripe.com/v3/"></script>
                    <link rel="stylesheet" href="/static/react-vis.css" />
                </Head>
                <Event json={json}/>
                <style jsx>{`
          .StripeElement {
            display: block;
            margin: 10px 0 20px 0;
            max-width: 500px;
            padding: 10px 14px;
            box-shadow: rgba(50, 50, 93, 0.14902) 0px 1px 3px, rgba(0, 0, 0, 0.0196078) 0px 1px 0px;
            border-radius: 4px;
            background: white;
          }

          .StripeElement--focus {
            box-shadow: rgba(50, 50, 93, 0.109804) 0px 4px 6px, rgba(0, 0, 0, 0.0784314) 0px 1px 3px;
            -webkit-transition: all 150ms ease;
            transition: all 150ms ease;
          }`}</style>
            </>;
            break
        case 404:
        response = 
        <>
            Sorry that event is not available.
        </>
        break
    }
    return response
}
EventPage.getInitialProps = async (context) => {
    console.log("context")
    const { slug } = context.query;
    const res = await fetch(`${host}/api/event/${slug}`)
    const json = await res.json()
    const errorCode = json.length === 1? 200 : 404
    context.store.dispatch({
        type: 'fetch_event',
        payload: json[0]
    })
    return { json: json[0], errorCode }
}

export default connect()(EventPage);
