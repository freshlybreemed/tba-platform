import { Button, Card, Col, Divider, Icon, Row } from "antd";

import ExpenseCreation from "./ExpenseCreation";
import MockInvoice from "../demos/mock/invoice";
import { formatPrice } from "../lib/helpers";
import { connect } from "react-redux";
import { STATUS_CODES } from "http";

const Invoice = props => {
  console.log(props);
  const { user, event, selectedEvent } = props;
  const tax = 15;
  const getSubTotal = () =>
    invoice.reduce(
      (sum, item) => sum + item.quantity * (item.price + item.fees),
      0
    );

  const getCalculatedTax = () => (tax * getSubTotal()) / 100;
  const getFreshlyTax = () =>
    -invoice.reduce((sum, item) => sum + item.quantity * item.fees, 0);

  const getTotal = () => getSubTotal() + getCalculatedTax();
  const ticketTypes = Object.keys(event.ticketTypes);
  const invoice = ticketTypes.map(ticket => {
    return {
      title: ticket,
      subtitle: "Tickets sold",
      price: event.ticketTypes[ticket].price,
      quantity:
        -event.ticketTypes[ticket].currentQuantity +
        event.ticketTypes[ticket].startingQuantity,
      fees: event.ticketTypes[ticket].fees
    };
  });

  const renderExpenses = () => {
    const { selectedEvent } = props;
    const { expenses } = selectedEvent;
    const expenseRender = [];
    console.log("Object.keys(expenses)", expenses);
    // if (Object.keys(expenses).length > 0) {
    //   expenseRender.push(
    //     <>
    //       <Row
    //         type="flex"
    //         justify="space-between"
    //         align="middle"
    //         className="py-4"
    //       >
    //         <br />
    //         <small className="mr-auto text-muted">{`Expenses`}</small>
    //         <span className="text-right">
    //           {formatPrice(expenses[expense].price)}
    //         </span>
    //       </Row>
    //       <Divider className="m-0" />
    //     </>
    //   );
    // }
    for (var expense in expenses) {
      expenseRender.push(
        <>
          <Row
            type="flex"
            justify="space-between"
            align="middle"
            className="py-4"
          >
            <Icon type="edit" />
            <small className="mr-auto text-muted">{`${expenses[expense].type}`}</small>
            <span>
              <small className="text-muted">{`${expense}`} </small>
            </span>
            <span className="text-right">
              {formatPrice(expenses[expense].price)}
            </span>
          </Row>
          <Divider className="m-0" />
        </>
      );
    }
    return expenseRender;
  };
  return (
    <>
      <Card
        className="shadow-sm text-monospace"
        bodyStyle={{ padding: 0 }}
        bordered={false}
      >
        <div className="bg-dark text-light rounded-top p-5">
          <div className="p-5">
            <h1 className="text-white">{event.title}</h1>
            <Row type="flex" justify="space-between">
              <Col>
                <ul className="list-unstyled">
                  <li>{event.organizer}</li>
                  <li>{user.nickname}</li>
                  <li>{user.email}</li>
                </ul>
                <ul className="list-unstyled">
                  <li>{event.location.name.split(",")[0]}</li>
                  <li>{event.location.streetAddress}</li>
                  <li>
                    {event.location.city}, {event.location.state},{" "}
                    {event.location.postalCode}
                  </li>
                  <li>United States of America</li>
                </ul>
              </Col>
              <Col className="text-right">
                <ul className="list-unstyled">
                  <li>TBA</li>
                  {/* <li>Francine Miles</li> */}
                  <li>stamp@whatstba.com</li>
                </ul>
                <ul className="list-unstyled">
                  <li>Invoice #45789</li>
                  <li>November 05, 2019</li>
                </ul>
                {/* <ul className="list-unstyled">
                  <li>1033 W Sherman Dr</li>
                  <li>798 Mariana Isle</li>
                  <li>Lake Maegan</li>
                  <li>Wyoming</li>
                  <li>00 263</li>
                  <li>South Africa</li>
                </ul> */}
              </Col>
            </Row>
          </div>
        </div>

        <div className="p-5">
          <div className="p-5">
            <Divider className="m-0" />
            <Row
              type="flex"
              justify="space-between"
              className="py-2 text-muted"
            >
              <div>
                <small>Description</small>
              </div>
              <div className="text-right">
                <small>Amount</small>
              </div>
            </Row>
            <Divider className="m-0" />
            {invoice.map((item, index) => (
              <div key={index}>
                <Row
                  type="flex"
                  justify="space-between"
                  align="middle"
                  className="py-4"
                >
                  <div className="mr-auto">
                    <span>{item.title}</span>
                    <small
                      className="text-muted"
                      css={`
                        display: block;
                      `}
                    >
                      {/* {item.subtitle} */}
                      {item.quantity && (
                        <span>
                          &nbsp;*&nbsp;
                          {item.quantity} Sold
                        </span>
                      )}
                    </small>
                  </div>
                  <div className="text-right">
                    <span>
                      {formatPrice((item.price + item.fees) * item.quantity)}
                    </span>
                  </div>
                </Row>
                <Divider className="m-0" />
              </div>
            ))}
            <Divider className="m-0" />
            {renderExpenses()}
            <Row>
              <div
                className="ml-auto"
                css={`
                  display: block;
                  width: 100%;
                  max-width: 400px;
                `}
              >
                <Row
                  type="flex"
                  justify="space-between"
                  align="middle"
                  className="py-4"
                >
                  <small className="mr-auto text-muted">Gross Sales</small>
                  <span className="text-right">
                    {formatPrice(getSubTotal())}
                  </span>
                </Row>
                <Divider className="m-0" />
                <Row
                  type="flex"
                  justify="space-between"
                  align="middle"
                  className="py-4"
                >
                  <small className="mr-auto text-muted">Service Fees</small>
                  <span className="text-right">
                    {formatPrice(getFreshlyTax() * 0.32)}
                  </span>
                </Row>
                <Divider className="m-0" />
                <Row
                  type="flex"
                  justify="space-between"
                  align="middle"
                  className="py-4"
                >
                  <small className="mr-auto text-muted">
                    Payment Processing Fees
                  </small>
                  <span className="text-right">
                    {formatPrice(getFreshlyTax() * 0.68)}
                  </span>
                </Row>
                <Divider className="m-0" />
                <Row
                  type="flex"
                  justify="space-between"
                  align="middle"
                  className="py-4"
                >
                  <small className="mr-auto text-muted">Tax</small>
                  <span>
                    <small className="text-muted">@ {tax}% - </small>
                    <span>{formatPrice(getCalculatedTax())}</span>
                  </span>
                </Row>
                <Divider className="m-0" />
                <Row
                  type="flex"
                  justify="space-between"
                  align="middle"
                  className="py-4"
                >
                  <small className="mr-auto text-muted">Discount</small>
                  <span>
                    <small className="text-muted">0% off - </small>
                    <span>{formatPrice(0)}</span>
                  </span>
                </Row>
                <Divider className="m-0 bg-primary" />
                <Row
                  type="flex"
                  justify="space-between"
                  align="middle"
                  className="py-4"
                >
                  <small className="mr-auto text-muted">Net Sales</small>
                  <strong>{formatPrice(getTotal())}</strong>
                </Row>
                <Divider className="m-0 bg-primary" />
              </div>
            </Row>
            <ExpenseCreation />
          </div>
        </div>
      </Card>

      <div className="my-5 text-center"></div>
    </>
  );
};

export default connect(state => {
  return {
    myEvents: state.myEvents,
    user: state.user,
    selectedEvent: state.selectedEvent
  };
})(Invoice);
