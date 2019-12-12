import {
  Button,
  Card,
  Checkbox,
  DatePicker,
  Row,
  Form,
  Input,
  message,
  Radio,
  Select
} from "antd";
import { Component } from "react";
import Cleave from "cleave.js/react";
import "cleave.js/dist/addons/cleave-phone.us";

import Upload from "./Upload";
import { connect } from "react-redux";
import { createForm, createFormField, formShape } from "rc-form";
import axios from "axios";

const FormItem = Form.Item;
const { Option } = Select;

class PayoutSettings extends Component {
  constructor(props) {
    super(props);
  }

  handleSubmit = e => {
    e.preventDefault();
    // this.props.form.validateFieldsAndScroll((err, values) => {
    //   if (!err) {
    //     console.log('Received values of form: ', values);
    //   }
    // });
    axios
      .post("/api/connect", {
        data: this.props.user
      })
      .then(res => {
        // if(res.data.length!=0){
        message.success("Successfully created!");
        console.log(res);
        // window.location = "/myevents";
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
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0
        },
        sm: {
          span: 16,
          offset: 8
        }
      }
    };
    console.log(this.props);
    const validRoutingNumber = () => {
      const routing = getFieldValue("accountSettingsForm.routingNumber");
      console.log(routing.length);
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
          title="Payout Settings"
          className="mb-4"
          bodyStyle={{ padding: "1rem" }}
        >
          <Form onSubmit={this.handleSubmit}>
            <FormItem {...formItemLayout} label="Business or Individual">
              {getFieldDecorator("accountSettingsForm.accountType", {
                rules: [
                  {
                    required: true,
                    message: "Please input your event name!",
                    whitespace: true
                  }
                ],
                initialValue: "individual"
              })(
                <Radio.Group>
                  <Radio value={"company"}>Company</Radio>
                  <Radio value={"individual"}>Individual</Radio>
                </Radio.Group>
              )}
            </FormItem>
            {getFieldValue("accountSettingsForm.accountType") ===
            "individual" ? (
              <>
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
                <FormItem {...formItemLayout} label="Date of Birth">
                  {getFieldDecorator("accountSettingsForm.dob", {
                    rules: [
                      {
                        required: true,
                        message: "Please input your event name!",
                        whitespace: true
                      }
                    ]
                  })(
                    <Cleave
                      className="ant-input"
                      placeholder="MM / DD / YYYY"
                      options={{ date: true, datePattern: ["m", "d", "Y"] }}
                    />
                  )}
                </FormItem>
                <FormItem {...formItemLayout} label="SSN">
                  {getFieldDecorator("accountSettingsForm.lastFourSSN", {
                    rules: [
                      {
                        required: true,
                        message: "Please input your event name!",
                        whitespace: true
                      }
                    ]
                  })(<Input.Password />)}
                </FormItem>
                <FormItem {...formItemLayout} label="Photo ID - Front">
                  <Upload />
                </FormItem>
                <FormItem {...formItemLayout} label="Photo ID - Back">
                  <Upload />
                </FormItem>
              </>
            ) : (
              <>
                <FormItem {...formItemLayout} label="Company Name">
                  {getFieldDecorator("accountSettingsForm.name", {
                    rules: [
                      {
                        required: true,
                        message: "Please input your event name!",
                        whitespace: true
                      }
                    ]
                  })(<Input />)}
                </FormItem>
                <FormItem {...formItemLayout} label="Tax ID">
                  {getFieldDecorator("accountSettingsForm.taxId", {
                    rules: [
                      {
                        required: true,
                        message: "Please input your event name!",
                        whitespace: true
                      }
                    ]
                  })(
                    <Cleave
                      className="ant-input"
                      options={{
                        blocks: [2, 7],
                        delimiter: "-",
                        numericOnly: true
                      }}
                    />
                  )}
                </FormItem>
              </>
            )}
            <FormItem {...formItemLayout} label="Phone Number">
              {getFieldDecorator("accountSettingsForm.phoneNumber", {
                rules: [
                  {
                    required: true,
                    message: "Please input your event name!",
                    whitespace: true
                  }
                ]
              })(
                <Cleave
                  className="ant-input"
                  options={{ phone: true, phoneRegionCode: "US" }}
                />
              )}
            </FormItem>
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
        <Card
          title="Bank Info"
          className="mb-4"
          bodyStyle={{ padding: "1rem" }}
        >
          <Form onSubmit={this.handleSubmit}>
            <FormItem {...formItemLayout} label="Preferred Payout Method">
              {getFieldDecorator("accountSettingsForm.payoutMethod", {
                rules: [
                  {
                    required: true,
                    message: "Please input your event name!",
                    whitespace: true
                  }
                ]
              })(
                <Radio.Group>
                  <Radio value={"bank"}>Bank</Radio>
                  <Radio value={"cashapp"}>Cash App</Radio>
                  <Radio value={"paypal"}>Paypal</Radio>
                </Radio.Group>
              )}
            </FormItem>

            {getFieldValue("accountSettingsForm.payoutMethod") === "bank" && (
              <>
                <FormItem {...formItemLayout} label="Account Number">
                  {getFieldDecorator("accountSettingsForm.accountNumber", {
                    rules: [
                      {
                        required: true,
                        message: "Please input your event name!",
                        whitespace: true
                      }
                    ]
                  })(<Input.Password />)}
                </FormItem>
                <FormItem
                  validateStatus={
                    getFieldError("accountSettingsForm.routingNumber")
                      ? "error"
                      : ""
                  }
                  help={
                    getFieldError("accountSettingsForm.routingNumber")
                      ? "Invalid routing number!"
                      : ""
                  }
                  {...formItemLayout}
                  label="Routing Number"
                >
                  {getFieldDecorator("accountSettingsForm.routingNumber", {
                    rules: [
                      {
                        required: true,
                        message: "Please input your event name!",
                        whitespace: true
                      },
                      {
                        validator: validRoutingNumber
                      }
                    ]
                  })(<Input.Password />)}
                </FormItem>
              </>
            )}
            {getFieldValue("accountSettingsForm.payoutMethod") ===
              "cashapp" && (
              <>
                <FormItem {...formItemLayout} label="$Cashtag">
                  {getFieldDecorator("accountSettingsForm.cashApp", {
                    rules: [
                      {
                        required: true,
                        message: "Please input your event name!",
                        whitespace: true
                      }
                    ]
                  })(<Input />)}
                </FormItem>
              </>
            )}
            {getFieldValue("accountSettingsForm.payoutMethod") === "paypal" && (
              <>
                <FormItem {...formItemLayout} label="Paypal Email">
                  {getFieldDecorator("accountSettingsForm.paypalEmail", {
                    rules: [
                      {
                        required: true,
                        message: "Please input your event name!",
                        whitespace: true
                      }
                    ]
                  })(<Input />)}
                </FormItem>
              </>
            )}

            <p>
              By clicking 'Submit', under penalties of perjury, I certify that:
              <br />
              (1) The number shown on this form is my correct taxpayer
              identification number, and
              <br />
              (2) I am a U.S. citizen or other U.S. person (as defined by the
              IRS)
              <br />
              <strong>Note: </strong>The date, time of submission and your
              computer's IP address will be recorded upon submission.
            </p>
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
      name: state.accountSettingsForm.name,
      city: state.accountSettingsForm.city,
      organizerName: state.accountSettingsForm.organizerName,
      homeAddress: state.accountSettingsForm.homeAddress,
      homeAddress2: state.accountSettingsForm.homeAddress2,
      country: state.accountSettingsForm.country,
      zipCode: state.accountSettingsForm.zipCode,
      state: state.accountSettingsForm.state,
      lastFourSSN: state.accountSettingsForm.lastFourSSN,
      accountNumber: state.accountSettingsForm.accountNumber,
      routingNumber: state.accountSettingsForm.routingNumber,
      accountType: state.accountSettingsForm.accountType,
      taxId: state.accountSettingsForm.taxId,
      phoneNumber: state.accountSettingsForm.phoneNumber,
      payoutMethod: state.accountSettingsForm.payoutMethod,
      cashApp: state.accountSettingsForm.cashApp,
      paypalEmail: state.accountSettingsForm.paypalEmail,
      dob: state.accountSettingsForm.dob
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
          name: createFormField(props.formState.name),
          lastName: createFormField(props.formState.lastName),
          city: createFormField(props.formState.city),
          organizerName: createFormField(props.formState.organizerName),
          homeAddress: createFormField(props.formState.homeAddress),
          homeAddress2: createFormField(props.formState.homeAddress2),
          country: createFormField(props.formState.country),
          zipCode: createFormField(props.formState.zipCode),
          state: createFormField(props.formState.state),
          routingNumber: createFormField(props.formState.routingNumber),
          accountNumber: createFormField(props.formState.accountNumber),
          lastFourSSN: createFormField(props.formState.lastFourSSN),
          accountType: createFormField(props.formState.accountType),
          phoneNumber: createFormField(props.formState.phoneNumber),
          payoutMethod: createFormField(props.formState.payoutMethod),
          cashApp: createFormField(props.formState.cashApp),
          paypalEmail: createFormField(props.formState.paypalEmail),
          dob: createFormField(props.formState.dob),
          taxId: createFormField(props.formState.taxId)
        }
      };
    }
  })(PayoutSettings)
);
