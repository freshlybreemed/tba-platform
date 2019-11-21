import {
  CardElement,
  CardNumberElement,
  CardExpiryElement,
  CardCVCElement,
  PostalCodeElement,
  PaymentRequestButtonElement,
  IbanElement,
  IdealBankElement,
  StripeProvider,
  Elements,
  injectStripe
} from "react-stripe-elements";
import { Spin } from "antd";
import { connect } from "react-redux";
import axios from "axios";

const handleBlur = () => {
  console.log("[blur]");
};
const handleChange = change => {
  console.log("[change]", change);
};
const handleClick = () => {
  console.log("[click]");
};
const handleFocus = () => {
  console.log("[focus]");
};
const handleReady = () => {
  console.log("[ready]");
};

const createOptions = (fontSize, padding) => {
  return {
    style: {
      base: {
        fontSize,
        color: "#424770",
        letterSpacing: "0.025em",
        fontFamily: "Source Code Pro, monospace",
        "::placeholder": {
          color: "#aab7c4"
        },
        padding,
        border: "30px solid green"
      },
      invalid: {
        color: "#9e2146"
      }
    }
  };
};

class _CardForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      processing: false
    };
  }
  handleSubmit = ev => {
    ev.preventDefault();
    this.setState({ processing: true });
    if (this.props.stripe) {
      this.props.stripe
        .createToken({
          name: this.props.eventCheckout.firstName.value
          // address_line1: 'Castle Blvd',
        })
        .then(payload => {
          console.log("[token]", payload);
          const { selectedEvent, eventCheckout } = this.props;
          axios
            .post(`/api/charge`, {
              token: payload.token,
              eventCheckout: { ...eventCheckout, title: selectedEvent.title }
            })
            .then(res => {
              console.log(res.data);
              this.props.dispatch({
                type: "complete_checkout",
                payload: {
                  status: "complete"
                }
              });
            });
        });
    } else {
      console.log("Stripe.js hasn't loaded yet.");
    }
  };
  render() {
    const { processing } = this.state;

    return (
      <Spin spinning={processing} tip="Loading...">
        <form onSubmit={this.handleSubmit}>
          <label class="label" class="label">
            <div className="ant-input">
              <CardElement
                onBlur={handleBlur}
                onChange={handleChange}
                onFocus={handleFocus}
                onReady={handleReady}
                {...createOptions(this.props.fontSize)}
              />
            </div>
          </label>
          <button class="ant-btn ant-btn-primary">Pay</button>
        </form>
      </Spin>
    );
  }
}
const mapStateToProps = state => {
  console.log(state);
  return {
    selectedEvent: state.selectedEvent,
    eventCheckout: state.eventCheckout
  };
};

const CardForm = connect(mapStateToProps)(injectStripe(_CardForm));

class _SplitForm extends React.Component {
  handleSubmit = ev => {
    ev.preventDefault();
    if (this.props.stripe) {
      this.props.stripe
        .createToken()
        .then(payload => console.log("[token]", payload));
    } else {
      console.log("Stripe.js hasn't loaded yet.");
    }
  };
  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label class="label">
          Card number
          <CardNumberElement
            onBlur={handleBlur}
            onChange={handleChange}
            onFocus={handleFocus}
            onReady={handleReady}
            {...createOptions(this.props.fontSize)}
          />
        </label>
        <label class="label">
          Expiration date
          <CardExpiryElement
            onBlur={handleBlur}
            onChange={handleChange}
            onFocus={handleFocus}
            onReady={handleReady}
            {...createOptions(this.props.fontSize)}
          />
        </label>
        <label class="label">
          CVC
          <CardCVCElement
            onBlur={handleBlur}
            onChange={handleChange}
            onFocus={handleFocus}
            onReady={handleReady}
            {...createOptions(this.props.fontSize)}
          />
        </label>
        <label class="label">Postal code</label>
        <button class="button">Pay</button>
      </form>
    );
  }
}
const SplitForm = injectStripe(_SplitForm);

class _PaymentRequestForm extends React.Component {
  constructor(props) {
    super(props);

    const paymentRequest = props.stripe.paymentRequest({
      country: "US",
      currency: "usd",
      total: {
        label: "Demo total",
        amount: 1000
      }
    });

    paymentRequest.on("token", ({ complete, token, ...data }) => {
      console.log("Received Stripe token: ", token);
      console.log("Received customer information: ", data);
      complete("success");
    });

    paymentRequest.canMakePayment().then(result => {
      this.setState({ canMakePayment: !!result });
    });

    this.state = {
      canMakePayment: false,
      paymentRequest
    };
  }

  render() {
    return this.state.canMakePayment ? (
      <PaymentRequestButtonElement
        className="PaymentRequestButton"
        onBlur={handleBlur}
        onClick={handleClick}
        onFocus={handleFocus}
        onReady={handleReady}
        paymentRequest={this.state.paymentRequest}
        style={{
          paymentRequestButton: {
            theme: "dark",
            height: "64px",
            type: "donate"
          }
        }}
      />
    ) : null;
  }
}
const PaymentRequestForm = injectStripe(_PaymentRequestForm);
class Checkout extends React.Component {
  constructor() {
    super();
    this.state = {
      elementFontSize: window.innerWidth < 450 ? "14px" : "18px"
    };
    window.addEventListener("resize", () => {
      if (window.innerWidth < 450 && this.state.elementFontSize !== "14px") {
        this.setState({ elementFontSize: "14px" });
      } else if (
        window.innerWidth >= 450 &&
        this.state.elementFontSize !== "18px"
      ) {
        this.setState({ elementFontSize: "18px" });
      }
    });
  }

  render() {
    const { elementFontSize } = this.state;
    return (
      <div className="Checkout">
        <Elements>
          <CardForm fontSize={elementFontSize} />
        </Elements>
        {/* <Elements>
          <SplitForm fontSize={elementFontSize} />
        </Elements> */}
        <Elements>
          <PaymentRequestForm />
        </Elements>
      </div>
    );
  }
}
const App = () => {
  return (
    <StripeProvider apiKey="pk_test_KJ6mPZxJuMvOl8yqmsCtdM9J00bx9VCCpE">
      <Checkout />
    </StripeProvider>
  );
};

export default connect(mapStateToProps)(App);
