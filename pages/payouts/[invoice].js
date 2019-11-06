import Invoice from '../../components/Invoice';
import Manage from '../../components/Manage';
import {connect} from "react-redux";
import Head from 'next/head';
import fetch from 'isomorphic-unfetch'
import {AUTH_CONFIG} from '../../lib/auth0-variables';

const host = AUTH_CONFIG.host

const InvoicePage = ({data, errorCode}) => {
  console.log("data")
  console.log(data)
  var response
  switch (errorCode){
      case 200: 
        response = <Invoice event={data}/>
        break
      case 404:
        response = 
        <>
        Sorry that event is not available.
        </>
        break
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
InvoicePage.getInitialProps = async (context) => {
  const { invoice } = context.query;

  console.log('json', invoice)
  const res = await fetch(`${host}/api/event/${invoice}`)
  const json = await res.json()
  console.log(json)
  const errorCode = json.length === 1? 200 : 404
  return { data: json[0], errorCode}
}

export default InvoicePage;
