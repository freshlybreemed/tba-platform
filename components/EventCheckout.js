import React from 'react';
import {Elements} from 'react-stripe-elements';
import {
  Form,
  Button,
  Input,
  Modal,
  Select
  } from 'antd'
  import { createForm, createFormField, formShape } from 'rc-form';
  import { connect } from 'react-redux'
import CardSection from './CardSection';

const { Option } = Select;
const FormItem = Form.Item;
class EventCheckout extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      ModalText: 'Content of the modal',
      visible: false,
      confirmLoading: false,
      formLayout: 'inline',
    };
  }
  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = () => {
    this.setState({
      ModalText: 'The modal will be closed after two seconds',
      confirmLoading: true,
    });
    setTimeout(() => {
      this.setState({
        visible: false,
        confirmLoading: false,
      });
    }, 2000);
  };

  handleCancel = () => {
    console.log('Clicked cancel button');
    this.setState({
      visible: false,
    });
  };
  render() {
    const { formLayout, visible, confirmLoading, ModalText } = this.state;
    const { getFieldDecorator, getFieldValue, getFieldProps, getFieldError, setFieldsValue } = this.props.form;
    const formItemLayout =
      formLayout === 'horizontal'
        ? {
            labelCol: { span: 4 },
            wrapperCol: { span: 14 },
          }
        : null;
    const buttonItemLayout =
      formLayout === 'horizontal'
        ? {
            wrapperCol: { span: 14, offset: 4 },
          }
        : null;

    const prefixSelector = (
      <Select defaultValue="+1" style={{ width: 70 }}>
        <Option value="+1">+1</Option>
      </Select>
    )
  
    return (
      this.props.mode !== 'no-payment' ?
      <CardSection /> :
      <Form layout={formLayout} >
          <FormItem {...formItemLayout} label="First Name">
          {getFieldDecorator('firstName', {
              rules: [{ required: true, message: 'Please input your first name' }],
            })(<Input placeholder="John" />)}
          </FormItem>

          <FormItem {...formItemLayout} label="Last Name">
          {getFieldDecorator('lastName', {
              rules: [{ required: true, message: 'Please input your last name' }],
            })(<Input placeholder="Appleseed" />)}          
            </FormItem>
          <br/>
          <FormItem {...formItemLayout} label="Email Address">
          {getFieldDecorator('emailAddress', {
              rules: [{ required: true, message: 'Please input your emaikl address!' }],
            })(<Input placeholder="email@example.com"   />)}    
          </FormItem>
          <FormItem {...formItemLayout} label="Phone Number">
          {getFieldDecorator('phoneNumber', {
              rules: [{ required: true, message: `This Phone Number doesn't seem to be valid. Could you check and try again?` }],
            })(<Input pattern={[
              '^.{8,}$', // min 8 chars
              '(?=.*\\d)', // number required
              '(?=.*[A-Z])', // uppercase letter
            ]}addonBefore={prefixSelector} style={{ width: '100%' }}   />)}    
          </FormItem>
      </Form>
    );
  }
}

const mapStateToProps = (state) => {
  return {

    };
  }

export default connect(mapStateToProps)(createForm({
  onFieldsChange(props, changedFields) {
    console.log(props.form.getFieldsValue())
    console.log("changedFields",changedFields)
    props.dispatch({
      type: 'update_checkout',
      payload: changedFields,
    });
  },
  mapPropsToFields(props) {
    return {
        firstName: createFormField(props.firstName),
        lastName: createFormField(props.lastName),
        emailAddress: createFormField(props.emailAddress),
        phoneNumber: createFormField(props.phoneNumber)
      }
    },
  })(EventCheckout));