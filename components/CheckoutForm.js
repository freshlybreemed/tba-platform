import React from 'react';
import {injectStripe} from 'react-stripe-elements';

// import AddressSection from './AddressSection';
import CardSection from './CardSection';

class CheckoutForm extends React.Component {
  handleSubmit = (ev) => {
    // We don't want to let default form submission happen here, which would refresh the page.
    ev.preventDefault();
    // console.log(ev)

    // Within the context of `Elements`, this call to createPaymentMethod knows from which Element to
    // create the PaymentMethod, since there's only one in this group.
    // See our createPaymentMethod documentation for more:
    // https://stripe.com/docs/stripe-js/reference#stripe-create-payment-method
    this.props.stripe
      .createPaymentMethod('card', {billing_details: {name: 'Jenny Rosen'}})
      .then(({paymentMethod}) => {
        console.log('Received Stripe PaymentMethod:', paymentMethod);
      });

    // You can also use handleCardPayment with the PaymentIntents API automatic confirmation flow.
    // See our handleCardPayment documentation for more:
    // https://stripe.com/docs/stripe-js/reference#stripe-handle-card-payment
    // this.props.stripe.handleCardPayment('{PAYMENT_INTENT_CLIENT_SECRET}', data);

    // You can also use handleCardSetup with the SetupIntents API.
    // See our handleCardSetup documentation for more:
    // https://stripe.com/docs/stripe-js/reference#stripe-handle-card-setup
    // this.props.stripe.handleCardSetup('{PAYMENT_INTENT_CLIENT_SECRET}', data);

    // You can also use createToken to create tokens.
    // See our tokens documentation for more:
    // https://stripe.com/docs/stripe-js/reference#stripe-create-token
    // this.props.stripe.createToken({type: 'card', name: 'Jenny Rosen'});
    // token type can optionally be inferred if there is only one Element
    // with which to create tokens
    this.props.stripe.createToken({name: 'Jenny Rosen'})
    .then(({token}) => {
      console.log('Received Stripe Token:', token);
    });

    // You can also use createSource to create Sources.
    // See our Sources documentation for more:
    // https://stripe.com/docs/stripe-js/reference#stripe-create-source
    // this.props.stripe.createSource({
    //   type: 'card',
    //   owner: {
    //     name: 'Jenny Rosen',
    //   },
    // });
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        {/* <AddressSection /> */}
        <CardSection   css={`
          .StripeElement {
            box-sizing: border-box;
          
            height: 40px;
          
            padding: 10px 12px;
          
            border: 1px solid transparent;
            border-radius: 4px;
            background-color: white;
          
            box-shadow: 0 1px 3px 0 #e6ebf1;
            -webkit-transition: box-shadow 150ms ease;
            transition: box-shadow 150ms ease;
          }
          
          .StripeElement--focus {
            box-shadow: 0 1px 3px 0 #cfd7df;
          }
          
          .StripeElement--invalid {
            border-color: #fa755a;
          }
          
          .StripeElement--webkit-autofill {
            background-color: #fefde5 !important;
          }`} />
        <button >Confirm order</button>
      </form>
    );
  }
}

export default injectStripe(CheckoutForm);