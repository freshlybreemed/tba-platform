import { Button, Card, Row, Form, Input, message, Select } from "antd";
import { Component } from "react";
import Avatar from "./Upload";
import { connect } from "react-redux";
import { createForm, createFormField } from "rc-form";
import axios from "axios";

const FormItem = Form.Item;
const { Option } = Select;

class AccountSettings extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    this.props.dispatch({
      type: "edit_account",
      payload: this.props.user
    });
  }

  handleSubmit = e => {
    e.preventDefault();
    // this.props.form.validateFieldsAndScroll((err, values) => {
    //   if (!err) {
    //     console.log('Received values of form: ', values);
    //   }
    // });
    axios
      .post("/api/user", {
        data: this.props.user
      })
      .then(res => {
        // if(res.data.length!=0){
        message.success("Successfully created!");
        console.log(res);
        this.props.dispatch({
          type: "fetch_events",
          payload: res.data
        });
        window.location = "/myevents";
        // }
        // else {
        //   console.log("ERROR- event:", res.data)
        // }
      })
      .catch(err => {
        console.log(err);
      });
  };
  render() {
    const { getFieldDecorator, getFieldValue, getFieldError } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      }
    };
    console.log(this.props);
    const validRoutingNumber = () => {
      const routing = getFieldValue("accountSettingsForm.routingNumber");
      console.log(routing);
      if (routing.length !== 9) {
        return false;
      }

      // http://en.wikipedia.org/wiki/Routing_transit_number#MICR_Routing_number_format
      var checksumTotal =
        7 *
          (parseInt(routing.charAt(0), 10) +
            parseInt(routing.charAt(3), 10) +
            parseInt(routing.charAt(6), 10)) +
        3 *
          (parseInt(routing.charAt(1), 10) +
            parseInt(routing.charAt(4), 10) +
            parseInt(routing.charAt(7), 10)) +
        9 *
          (parseInt(routing.charAt(2), 10) +
            parseInt(routing.charAt(5), 10) +
            parseInt(routing.charAt(8), 10));

      var checksumMod = checksumTotal % 10;
      if (checksumMod !== 0) {
        return false;
      } else {
        return true;
      }
    };
    return (
      <>
        <Card
          title="Contact Settings"
          className="mb-4"
          bodyStyle={{ padding: "1rem" }}
        >
          <Form onSubmit={this.handleSubmit}>
            <FormItem {...formItemLayout} label="First Name">
              {getFieldDecorator("accountSettingsForm.firstName", {
                rules: [
                  {
                    required: true,
                    message: "Please input your event name!",
                    whitespace: true
                  }
                ]
              })(<Input />)}
            </FormItem>
            <FormItem {...formItemLayout} label="Last Name">
              {getFieldDecorator("accountSettingsForm.lastName", {
                rules: [
                  {
                    required: true,
                    message: "Please input your event name!",
                    whitespace: true
                  }
                ]
              })(<Input />)}
            </FormItem>
            <FormItem {...formItemLayout} label="Organizer Name">
              {getFieldDecorator("accountSettingsForm.organizerName", {
                rules: [
                  {
                    required: true,
                    message: "Please input your event name!",
                    whitespace: true
                  }
                ]
              })(<Input />)}
            </FormItem>
            <FormItem {...formItemLayout} label="Add a Profile Image">
              <Avatar />
            </FormItem>
          </Form>
        </Card>

        <Card
          title="Home Address"
          bodyStyle={{ padding: "1rem" }}
          className="mb-4"
        >
          <Form onSubmit={this.handleSubmit}>
            <FormItem {...formItemLayout} label="Address">
              {getFieldDecorator("accountSettingsForm.homeAddress", {
                rules: [
                  {
                    required: true,
                    message: "Please input your event name!",
                    whitespace: true
                  }
                ]
              })(<Input />)}
            </FormItem>
            <FormItem {...formItemLayout} label="Address 2">
              {getFieldDecorator("accountSettingsForm.homeAddress2", {
                rules: [
                  {
                    required: true,
                    message: "Please input your event name!",
                    whitespace: true
                  }
                ]
              })(<Input />)}
            </FormItem>
            <FormItem {...formItemLayout} label="City">
              {getFieldDecorator("accountSettingsForm.city", {
                rules: [
                  {
                    required: true,
                    message: "Please input your event name!",
                    whitespace: true
                  }
                ]
              })(<Input />)}
            </FormItem>
            <FormItem {...formItemLayout} label="Country">
              {getFieldDecorator("accountSettingsForm.country", {
                rules: [
                  {
                    required: true,
                    initialValue: "USA",
                    message: "Please input your event name!",
                    whitespace: true
                  }
                ]
              })(<Input />)}
            </FormItem>
            <FormItem {...formItemLayout} label="Zip/Postal Code">
              {getFieldDecorator("accountSettingsForm.zipCode", {
                rules: [
                  {
                    required: true,
                    message: "Please input your event name!",
                    whitespace: true
                  }
                ]
              })(<Input />)}
            </FormItem>
            <FormItem {...formItemLayout} label="State">
              {getFieldDecorator("accountSettingsForm.state", {
                rules: [
                  {
                    required: true,
                    message: "Please input your event name!",
                    whitespace: true
                  }
                ]
              })(
                <Select defaultValue="Select a State">
                  <Option value="Select a State">Select a State</Option>
                  <Option value="AL">Alabama</Option>
                  <Option value="AK">Alaska</Option>
                  <Option value="AZ">Arizona</Option>
                  <Option value="AR">Arkansas</Option>
                  <Option value="CA">California</Option>
                  <Option value="CO">Colorado</Option>
                  <Option value="CT">Connecticut</Option>
                  <Option value="DE">Delaware</Option>
                  <Option value="DC">District Of Columbia</Option>
                  <Option value="FL">Florida</Option>
                  <Option value="GA">Georgia</Option>
                  <Option value="HI">Hawaii</Option>
                  <Option value="ID">Idaho</Option>
                  <Option value="IL">Illinois</Option>
                  <Option value="IN">Indiana</Option>
                  <Option value="IA">Iowa</Option>
                  <Option value="KS">Kansas</Option>
                  <Option value="KY">Kentucky</Option>
                  <Option value="LA">Louisiana</Option>
                  <Option value="ME">Maine</Option>
                  <Option value="MD">Maryland</Option>
                  <Option value="MA">Massachusetts</Option>
                  <Option value="MI">Michigan</Option>
                  <Option value="MN">Minnesota</Option>
                  <Option value="MS">Mississippi</Option>
                  <Option value="MO">Missouri</Option>
                  <Option value="MT">Montana</Option>
                  <Option value="NE">Nebraska</Option>
                  <Option value="NV">Nevada</Option>
                  <Option value="NH">New Hampshire</Option>
                  <Option value="NJ">New Jersey</Option>
                  <Option value="NM">New Mexico</Option>
                  <Option value="NY">New York</Option>
                  <Option value="NC">North Carolina</Option>
                  <Option value="ND">North Dakota</Option>
                  <Option value="OH">Ohio</Option>
                  <Option value="OK">Oklahoma</Option>
                  <Option value="OR">Oregon</Option>
                  <Option value="PA">Pennsylvania</Option>
                  <Option value="RI">Rhode Island</Option>
                  <Option value="SC">South Carolina</Option>
                  <Option value="SD">South Dakota</Option>
                  <Option value="TN">Tennessee</Option>
                  <Option value="TX">Texas</Option>
                  <Option value="UT">Utah</Option>
                  <Option value="VT">Vermont</Option>
                  <Option value="VA">Virginia</Option>
                  <Option value="WA">Washington</Option>
                  <Option value="WV">West Virginia</Option>
                  <Option value="WI">Wisconsin</Option>
                  <Option value="WY">Wyoming</Option>
                </Select>
              )}
            </FormItem>
          </Form>
        </Card>
        <Button onClick={this.handleSubmit} type="primary" htmlType="submit">
          Update
        </Button>
      </>
    );
  }
}

const mapStateToProps = state => {
  return {
    accountSettings: state.accountSettings,
    user: state.user,
    formState: {
      firstName: state.accountSettingsForm.firstName,
      lastName: state.accountSettingsForm.lastName,
      city: state.accountSettingsForm.city,
      organizerName: state.accountSettingsForm.organizerName,
      homeAddress: state.accountSettingsForm.homeAddress,
      homeAddress2: state.accountSettingsForm.homeAddress2,
      country: state.accountSettingsForm.country,
      zipCode: state.accountSettingsForm.zipCode,
      state: state.accountSettingsForm.state
    }
  };
};
export default connect(mapStateToProps)(
  createForm({
    onFieldsChange(props, changedFields) {
      console.log(props.form.getFieldsValue());
      console.log("changedFields", changedFields);
      props.dispatch({
        type: "update_account",
        payload: changedFields
      });
    },
    mapPropsToFields(props) {
      return {
        accountSettingsForm: {
          firstName: createFormField(props.formState.firstName),
          lastName: createFormField(props.formState.lastName),
          city: createFormField(props.formState.city),
          organizerName: createFormField(props.formState.organizerName),
          homeAddress: createFormField(props.formState.homeAddress),
          homeAddress2: createFormField(props.formState.homeAddress2),
          country: createFormField(props.formState.country),
          zipCode: createFormField(props.formState.zipCode),
          state: createFormField(props.formState.state)
        }
      };
    }
  })(AccountSettings)
);
