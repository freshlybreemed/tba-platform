import {
  Avatar,
  Button,
  Checkbox,
  ConfigProvider,
  Modal,
  Form,
  Input,
  Icon,
  InputNumber,
  List,
  Panel,
  Row,
  Select,
  Steps,
  Typography,
  Tag,
  Radio,
  Table
} from "antd";
import { connect } from "react-redux";
import { formatPrice } from "../lib/helpers";
import CardSection from "./CardSection";
import EventCheckout from "./EventCheckout";
import Cleave from "cleave.js/react";
import "cleave.js/dist/addons/cleave-phone.us";

import { createForm, createFormField, formShape } from "rc-form";
const { Step } = Steps;
const { Option } = Select;
const FormItem = Form.Item;
class EventCheckoutForm extends React.Component {
  static propTypes = {
    form: formShape
  };

  state = {
    current: 0,
    visible: false,
    formLayout: "inline"
  };
  componentDidMount() {
    // Create Stripe instance in componentDidMount
    // (componentDidMount only fires in browser/DOM environment)
    this.setState({
      stripe: window.Stripe("pk_test_KJ6mPZxJuMvOl8yqmsCtdM9J00bx9VCCpE")
    });
  }
  componentWillMount() {
    const event = this.props.selectedEvent;
    let ticketTypes = {};
    let tickettypes = [];
    for (let ticket in event.ticketTypes) {
      ticketTypes[ticket] = event.ticketTypes[ticket];
      ticketTypes[ticket].count = 0;
      tickettypes.push(ticketTypes[ticket]);
    }
    this.setState({ data: tickettypes });
  }
  next() {
    const current = this.state.current + 1;
    this.setState({ current });
  }
  handleIncrement(value, type) {
    const { selectedEvent } = this.props;
    let tixs = {};
    tixs[type] = {
      quantity: value,
      id: selectedEvent.ticketTypes[type].id
    };
    this.props.dispatch({
      type: "update_cart",
      payload: tixs
    });
  }
  prev() {
    const current = this.state.current - 1;
    this.setState({ current });
  }
  handleCancel = () => {
    this.setState({ visible: false });
  };

  showModal = () => {
    this.setState({ visible: true });
  };
  render() {
    const { onCancel, onCreate, form, eventCheckoutForm } = this.props;
    const { visible } = this.state;
    const {
      getFieldDecorator,
      getFieldValue,
      getFieldProps,
      setFieldsValue,
      getFieldError
    } = form;
    const { current, formLayout, viewport } = this.state;
    const formItemLayout =
      formLayout === "horizontal"
        ? {
            labelCol: { span: 4 },
            wrapperCol: { span: 14 }
          }
        : null;

    const prefixSelector = (
      <Select defaultValue="+1" style={{ width: 70 }}>
        <Option value="+1">+1</Option>
      </Select>
    );
    const columns = [
      {
        title: "Ticket Type",
        dataIndex: "name",
        key: "name"
      },
      {
        title: "Price",
        dataIndex: "price",
        key: "age",
        render: (text, ticket) => {
          let price;
          if (text === 0) price = "Free";
          else price = `$${text} + ${formatPrice(ticket.fees)} Fees`;
          return <>{price}</>;
        }
      },
      {
        title: "Quantity",
        dataIndex: "count",
        key: "count",
        render: (text, ticket) => {
          return (
            <>
              <Row>
                {ticket.currentQuantity > 0 ? (
                  <Select
                    defaultValue={
                      this.props.eventCheckoutForm.cart[ticket.name]
                        ? this.props.eventCheckoutForm.cart[ticket.name]
                        : 0
                    }
                    style={{ width: 120 }}
                    onChange={e => this.handleIncrement(e, ticket.name)}
                  >
                    <Option value={0}>0</Option>
                    <Option value={1}>1</Option>
                    <Option value={2}>2</Option>
                    <Option value={3}>3</Option>
                    <Option value={4}>4</Option>
                  </Select>
                ) : (
                  <Tag color="red">Sold Out</Tag>
                )}
              </Row>
            </>
          );
        }
      }
    ];

    const moneySteps = [
      {
        title: "Select Tickets",
        content: (
          <>
            <Table
              pagination={false}
              footer={() => `Total: ${formatPrice(eventCheckoutForm.total)}`}
              columns={columns}
              dataSource={this.state.data}
            />
          </>
        )
      },
      {
        title: "Info",
        content: (
          <Form layout={formLayout}>
            <FormItem {...formItemLayout} label="First Name">
              <Input
                placeholder="John"
                {...getFieldProps("userCheckoutForm.firstName", {
                  rules: [
                    { required: true, message: "Please input your first name" }
                  ]
                })}
              />
            </FormItem>

            <FormItem {...formItemLayout} label="Last Name">
              <Input
                placeholder="Appleseed"
                {...getFieldProps("userCheckoutForm.lastName", {
                  rules: [
                    { required: true, message: "Please input your last name" }
                  ]
                })}
              />
            </FormItem>
            <br />
            <FormItem {...formItemLayout} label="Email Address">
              <Input
                placeholder="email@example.com"
                {...getFieldProps("userCheckoutForm.emailAddress", {
                  rules: [
                    {
                      required: true,
                      message: "Please input your emaikl address!"
                    }
                  ]
                })}
              />
            </FormItem>
            <FormItem {...formItemLayout} label="Phone Number">
              <Cleave
                className="ant-input"
                options={{ phone: true, phoneRegionCode: "US" }}
                {...getFieldProps("userCheckoutForm.phoneNumber", {
                  rules: [
                    {
                      required: true,
                      message: `This Phone Number doesn't seem to be valid. Could you check and try again?`
                    }
                  ]
                })}
              />
            </FormItem>
          </Form>
        )
      },
      {
        title: "Checkout",
        status: "payment",
        content:
          eventCheckoutForm.total > 0 ? (
            <CardSection />
          ) : (
            <Form layout={formLayout}>
              <FormItem {...formItemLayout} label="First Name">
                {getFieldDecorator("userCheckoutForm.firstName", {
                  rules: [
                    { required: true, message: "Please input your first name" }
                  ]
                })(<Input placeholder="John" />)}
              </FormItem>

              <FormItem {...formItemLayout} label="Last Name">
                {getFieldDecorator("userCheckoutForm.lastName", {
                  rules: [
                    { required: true, message: "Please input your last name" }
                  ]
                })(<Input placeholder="Appleseed" />)}
              </FormItem>
              <br />
              <FormItem {...formItemLayout} label="Email Address">
                {getFieldDecorator("userCheckoutForm.emailAddress", {
                  rules: [
                    {
                      required: true,
                      message: "Please input your emaikl address!"
                    }
                  ]
                })(<Input placeholder="email@example.com" />)}
              </FormItem>
              <FormItem {...formItemLayout} label="Phone Number">
                {getFieldDecorator("userCheckoutForm.phoneNumber", {
                  rules: [
                    {
                      required: true,
                      message: `This Phone Number doesn't seem to be valid. Could you check and try again?`
                    }
                  ]
                })(
                  <Cleave
                    className="ant-input"
                    options={{ phone: true, phoneRegionCode: "US" }}
                  />
                )}
              </FormItem>
            </Form>
          )
      }
    ];
    const freeSteps = [
      {
        title: "Select Tickets",
        content: (
          <>
            <Table
              pagination={false}
              footer={() => `Total: ${formatPrice(eventCheckoutForm.total)}`}
              columns={columns}
              dataSource={this.state.data}
            />
          </>
        )
      },
      {
        title: "Info",
        content: <EventCheckout mode="no-payment" />
      },
      {
        title: "Done",
        content: <EventCheckout Form mode="no-payment" />
      }
    ];
    const steps =
      this.props.eventCheckoutForm.total > 0 ? moneySteps : freeSteps;

    return (
      <>
        <Modal
          visible={visible}
          title="Create a new ticket"
          okText="Create"
          onCancel={this.onCancel}
        >
          <Steps current={current}>
            {steps.map(item => (
              <Step disabled={true} key={item.title} title={item.title} />
            ))}
          </Steps>
          <div className="steps-content">{steps[current].content}</div>
          <div className="steps-action">
            {current > 0 && (
              <Button style={{ marginLeft: 8 }} onClick={() => this.prev()}>
                Previous
              </Button>
            )}
            {current < steps.length - 1 && (
              <Button type="primary" onClick={() => this.next()}>
                Next
              </Button>
            )}
          </div>
        </Modal>
        <Button type="primary" onClick={this.showModal}>
          Tickets
        </Button>
      </>
    );
  }
}
const mapStateToProps = state => {
  console.log("state", state);
  return {
    selectedEvent: state.selectedEvent,
    eventCheckoutForm: state.eventCheckoutForm,
    formState: {
      phoneNumber: state.userCheckoutForm.phoneNumber,
      emailAddress: state.userCheckoutForm.emailAddress,
      firstName: state.userCheckoutForm.firstName,
      lastName: state.userCheckoutForm.lastName
    }
  };
};
export default connect(mapStateToProps)(
  createForm({
    onFieldsChange(props, changedFields) {
      // console.log("changedFields", changedFields);

      // console.log(props.form.getFieldsValue());
      props.dispatch({
        type: "update_checkout",
        payload: changedFields
      });
    },
    mapPropsToFields(props) {
      console.log(props);
      return {
        userCheckoutForm: {
          firstName: createFormField(props.formState.firstName),
          lastName: createFormField(props.formState.lastName),
          emailAddress: createFormField(props.formState.emailAddress),
          phoneNumber: createFormField(props.formState.phoneNumber)
        }
      };
    },
    onValuesChange(_, values) {
      console.log(values);
    }
  })(EventCheckoutForm)
);

// export default connect(state => {
//   return {
//     tickets: state.createdEventForm.ticketTypes,
//     eventCheckoutForm: state.eventCheckoutForm,
//     selectedEvent: state.selectedEvent
//   };
// })(EventCheckoutForm);
