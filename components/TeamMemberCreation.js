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
  Radio,
  Select
} from "antd";
const { Option } = Select;

import { connect } from "react-redux";
import { createForm, createFormField, formShape } from "rc-form";

class TeamMemberCreationForm extends React.Component {
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
        title="Add a new expense"
        okText="Create"
        onCancel={onCancel}
        onOk={onCreate}
      >
        <Form layout="inline">
          <Form.Item
            label="Expense Name"
            validateStatus={getFieldError("name") ? "error" : ""}
            help={getFieldError("name") ? "Enter a expense name" : ""}
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
            label="Expense Type"
            validateStatus={getFieldError("type") ? "error" : ""}
            help={
              getFieldError("type") ? "Enter a quantity greater than 1" : ""
            }
          >
            {getFieldDecorator("type", {
              rules: [{ required: true }]
            })(
              <Select defaultValue="lucy" style={{ width: 300 }}>
                <Option value="On-Site Event Expenses">
                  On-Site Event Expenses
                </Option>
                <Option value="Venue Costs">Venue Costs</Option>
                <Option value="Food and Catering">Food and Catering</Option>
                <Option value="Audio/Visual">Audio/Visual</Option>
                <Option value="Third-Party Vendors">Third-Party Vendors</Option>
                <Option value="Third Rentals">Third Rentals</Option>
                <Option value="Décor Vendors">Décor Vendors</Option>
                <Option value="Entertainment">Entertainment</Option>
                <Option value="Production Expenses">Production Expenses</Option>
                <Option value="Marketing">Marketing</Option>
                <Option value="Planning and Organization">
                  Planning and Organization
                </Option>
                <Option value="Administrative Expenses">
                  Administrative Expenses
                </Option>
                <Option value="Cost Overages and Emergency Funds">
                  Cost Overages and Emergency Funds
                </Option>
              </Select>
            )}
          </Form.Item>
          <Form.Item label="Price">
            {getFieldDecorator("price", {
              initialValue: 0
            })(
              <InputNumber
                min={0}
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
        </Form>
      </Modal>
    );
  }
}

class TeamMemberCreation extends React.Component {
  state = {
    visible: false,
    ticketTypes: {},
    expenseArray: []
  };
  componentWillMount() {
    // let expenses = { ...this.props.expenses };
    // const expenseArray = [];
    // for (var tix in expenses) {
    //   expenseArray.push(expenses[tix]);
    // }
    // this.setState({ expenseArray });
  }
  showModal = () => {
    this.setState({ visible: true });
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };
  handleCreate = () => {
    const { form } = this.formRef.props;
    // form.validateFields((err, values) => {
    //   if (err) {
    //     return;
    //   }
    //   console.log('Received values of form: ', values);
    //   let formFields = values;
    //   let expenses = { ...this.props.expenses };
    //   expenses[values.name] = formFields;
    //   const expenseArray = [];
    //   for (var exp in expenses) {
    //     expenseArray.push(expenses[exp]);
    //   }
    //   form.resetFields();
    //   console.log(expenses);
    //   let expense = {};
    //   expense[formFields.name] = formFields;
    //   //   this.props.dispatch({
    //   //     type: 'expense_creation',
    //   //     payload: expense,
    //   //   });
    //   this.setState({ visible: false, expenseArray }, () =>
    //     console.log(this.state),
    //   );
    // });
    console.log("creation", this.props);
  };

  saveFormRef = formRef => {
    this.formRef = formRef;
  };

  render() {
    console.log("props", this.state);
    const customizeRenderEmpty = () => (
      <div style={{ textAlign: "center" }}>
        {/* <Icon type="smile" style={{ fontSize: 20 }} /> */}
        {/* <p>No Tickets Created</p> */}
      </div>
    );

    return (
      <div>
        {/* <ConfigProvider renderEmpty={customizeRenderEmpty}> */}
        {/* <List
            itemLayout="horizontal"
            dataSource={this.state.expenseArray}
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
          /> */}
        {/* </ConfigProvider> */}
        <br />
        <Button type="primary" onClick={this.showModal}>
          <Icon type="plus" />
          Add Team Member
        </Button>
        <TeamMemberCreationForm
          wrappedComponentRef={this.saveFormRef}
          visible={this.state.visible}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
        />
      </div>
    );
  }
}

TeamMemberCreationForm = connect(state => {
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
        price: createFormField(props.price),
        type: createFormField(props.type)
      };
    },
    onValuesChange(_, values) {
      console.log(values);
    }
  })(TeamMemberCreationForm)
);

TeamMemberCreation = connect(state => {
  return {
    // teamMembers: state.event.expenses,
  };
})(TeamMemberCreation);

export default TeamMemberCreation;
