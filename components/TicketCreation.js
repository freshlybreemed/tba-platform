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
  Typography,
  Radio
} from "antd";
import { connect } from "react-redux";
import { createForm, createFormField, formShape } from "rc-form";

class TicketCreateForm extends React.Component {
  static propTypes = {
    form: formShape
  };

  render() {
    const { visible, onCancel, onCreate, form } = this.props;
    console.log("props", this.props);
    const {
      getFieldDecorator,
      getFieldValue,
      setFieldsValue,
      getFieldError
    } = form;
    return (
      <Modal
        visible={visible}
        title="Create a new ticket"
        okText="Create"
        onCancel={onCancel}
        onOk={onCreate}
      >
        <Form layout="inline">
          <Form.Item
            label="Ticket Name"
            validateStatus={getFieldError("name") ? "error" : ""}
            help={getFieldError("name") ? "Enter a ticket name" : ""}
          >
            {getFieldDecorator("name", {
              rules: [
                {
                  required: true,
                  type: "string",
                  min: 1,
                  message: "Please input the title of collection!"
                }
              ]
            })(<Input />)}
          </Form.Item>
          <Form.Item
            label="Quantity"
            validateStatus={getFieldError("startingQuantity") ? "error" : ""}
            help={
              getFieldError("startingQuantity")
                ? "Enter a quantity greater than 1"
                : ""
            }
          >
            {getFieldDecorator("startingQuantity", {
              rules: [{ required: true, type: "number", min: 0 }]
            })(<InputNumber />)}
          </Form.Item>
          <Form.Item label="Price">
            {getFieldDecorator("price", {
              initialValue: 0
            })(
              <InputNumber
                min={0}
                disabled={getFieldValue("type") === "free"}
                parser={value => value.replace(/\$\s?|(,*)/g, "")}
                formatter={value =>
                  `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
              />
            )}
          </Form.Item>
          <Form.Item label="Description">
            {getFieldDecorator("description")(<Input type="textarea" />)}
          </Form.Item>
          <Form.Item label="Show guests number of remaining tickets">
            {getFieldDecorator("showRemaining", {})(<Checkbox />)}
          </Form.Item>
          <Form.Item label="Ticket Type">
            {/* {getFieldDecorator('type', {
              initialValue: "free",
              getValueFromEvent: (e) => {
                if(e.target.value === 'free'){
                  setFieldsValue({"price": 0})
                }
                return e.target.value
              }
            })( */}
            <Radio.Group>
              <Radio value="free">Free</Radio>
              <Radio value="paid">Paid</Radio>
            </Radio.Group>
            {/* )} */}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

class TicketCreation extends React.Component {
  state = {
    visible: false,
    ticketTypes: {},
    tixArray: []
  };
  componentDidMount() {
    console.log("porppy", this.props);
    let tickets = { ...this.props.tickets };
    const tixArray = [];
    for (var tix in tickets) {
      tixArray.push(tickets[tix]);
    }
    this.setState({ tixArray });
  }
  showModal = () => {
    this.setState({ visible: true });
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };
  handleCreate = () => {
    const { form } = this.formRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      console.log("Received values of form: ", values);
      let formFields = values;
      formFields.currentQuantity = values.startingQuantity;
      formFields.fees = values.price * 0.032 + 1.3;
      let tickets = { ...this.props.tickets };
      tickets[values.name] = formFields;
      const tixArray = [];
      for (var tix in tickets) {
        tixArray.push(tickets[tix]);
      }
      form.resetFields();
      console.log(tickets);
      let ticket = {};
      ticket[formFields.name] = formFields;
      this.props.dispatch({
        type: "ticket_creation",
        payload: ticket
      });
      this.setState({ visible: false, tixArray }, () =>
        console.log(this.state)
      );
    });
    console.log("creation", this.props);
  };

  removeTicket = tix => {
    this.props.dispatch({
      type: "ticket_deletion",
      payload: tix
    });
    const tixArray = this.state.tixArray.filter(ticket => {
      return ticket.name !== tix;
    });
    let tickets = {};
    tixArray.forEach(ticket => {
      tickets[ticket.name] = ticket;
    });
    this.setState({ tixArray }, () => console.log(this.state));
  };
  saveFormRef = formRef => {
    this.formRef = formRef;
  };

  render() {
    console.log("props", this.state);
    const customizeRenderEmpty = () => (
      <div style={{ textAlign: "center" }}>
        <Icon type="smile" style={{ fontSize: 20 }} />
        <p>No Tickets Created</p>
      </div>
    );

    return (
      <div>
        <ConfigProvider renderEmpty={customizeRenderEmpty}>
          <List
            itemLayout="horizontal"
            dataSource={this.state.tixArray}
            renderItem={item => (
              <List.Item
                actions={[
                  <a onClick={() => this.removeTicket(item.name)}>delete</a>,
                  <a onClick={this.showModal}>edit</a>
                ]}
              >
                <List.Item.Meta
                  avatar={<Avatar icon="tag" />}
                  title={<a href="https://ant.design">{item.name}</a>}
                  description={item.description}
                />
                <div>{item.price === 0 ? "Free" : `$${item.price}`}</div>
              </List.Item>
            )}
          />
        </ConfigProvider>
        <br />
        <Button type="primary" onClick={this.showModal}>
          Add Ticket
        </Button>
        <TicketCreateForm
          wrappedComponentRef={this.saveFormRef}
          visible={this.state.visible}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
        />
      </div>
    );
  }
}

TicketCreateForm = connect(state => {
  return {};
})(
  createForm({
    onFieldsChange(props, changedFields) {
      console.log(props.form.getFieldsValue());
    },
    mapPropsToFields(props) {
      console.log(props);
      return {
        name: createFormField(props.name),
        description: createFormField(props.description),
        startingQuantity: createFormField(props.startingQuantity),
        price: createFormField(props.price),
        type: createFormField(props.type)
      };
    },
    onValuesChange(_, values) {
      console.log(values);
    }
  })(TicketCreateForm)
);

TicketCreation = connect(state => {
  return {
    tickets: state.createdEventForm.ticketTypes
  };
})(TicketCreation);

export default TicketCreation;
