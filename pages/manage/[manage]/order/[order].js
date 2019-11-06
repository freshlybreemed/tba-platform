import Order from '../../../../components/Order';
import {connect} from "react-redux";
import Head from 'next/head';
import fetch from 'isomorphic-unfetch'
import {AUTH_CONFIG} from '../../../../lib/auth0-variables';

const host = AUTH_CONFIG.host

const OrderPage = ({data, errorCode, customer, order}) => {
  console.log("data")
  console.log({data, customer, order})
  var response
  switch (errorCode){
      case 200: 
        response = <Order event={data} customer={customer}/>
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
OrderPage.getInitialProps = async (context) => {
  const { manage, order } = context.query;
  console.log('manage',manage)
  console.log('order',order)
  const res = await fetch(`${host}/api/event/${manage}`)
  const json = await res.json()
  const customer = json[0].tickets.filter(tix=>{
    return order === tix.created.toString().slice(-5)
  })[0]
  const errorCode = json.length === 1? 200 : 404
  return { data: json[0], customer, errorCode, order}
}
export default OrderPage;
