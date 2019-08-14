import React from 'react'
import StripeCheckout from 'react-stripe-checkout';
import axios from 'axios'

export default class Checkout extends React.Component {
  constructor(props){
    console.log(props.metadata)
    super(props)
    this.state= {
      eventId: props.metadata.id
    }
  }
  onToken = (token, addresses) => {
    const metadata = this.props.metadata
    console.log(metadata)
    let meta = {
      eventId: metadata.id
    }
    for (var tix in metadata.tickets){
      meta[tix] = metadata.tickets[tix].count
    }
    const body = {
        amount: this.props.metadata.total*100,
        token: token,
        metadata: meta
    }
    console.log(body)
    axios.post('/payments', body).then(response => {
        window.location = '#'+response.headers.location
        // window.location = '/confirmation?email='+response.data.token.email
        console.log(response)
    }).catch(error =>{
        console.log("Payment Error: ", error);
        alert("There was an issue with your payment. Please try again later")
    })
  };

  render() {
    console.log(this.state)
    return (
      <StripeCheckout
        stripeKey={process.env.REACT_APP_STRIPE_CLIENT_DEV}
        token={this.onToken}
        amount={this.props.metadata.total*100}
        billingAddress={true}
        description="Chicken & Mumbo Sauce"
        // image="/static/img/graph.png"
        locale="auto"
        name="Crank Karaoke"
      />
    ) 

  }
}