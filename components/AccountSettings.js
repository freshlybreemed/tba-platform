
import { Row, Form, Input  } from 'antd'
import { Component } from 'react' 
import Avatar from './Upload';

const FormItem = Form.Item;

class AccountSettings extends Component {
    constructor(props){
        super(props)
    }
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
          if (!err) {
            console.log('Received values of form: ', values);
          }
        });
      };
    render(){
        const { getFieldDecorator, getFieldValue } = this.props.form;
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
        return (
            <Form onSubmit={this.handleSubmit}>
                <FormItem {...formItemLayout} label="First Name">
                {getFieldDecorator('name', {
                    rules: [
                        {
                        required: true,
                        message: 'Please input your event name!',
                        whitespace: true
                        }
                    ]
                    })(<Input />)}          
                </FormItem>
                <FormItem {...formItemLayout} label="Last Name">
                {getFieldDecorator('name', {
                    rules: [
                        {
                        required: true,
                        message: 'Please input your event name!',
                        whitespace: true
                        }
                    ]
                    })(<Input />)}          
                </FormItem>
                <FormItem {...formItemLayout} label="Organizer Name">
                {getFieldDecorator('name', {
                    rules: [
                        {
                        required: true,
                        message: 'Please input your event name!',
                        whitespace: true
                        }
                    ]
                    })(<Input />)}          
                </FormItem>
                <FormItem {...formItemLayout} label="Add a Profile Image">
                    <Avatar />
                </FormItem>
            </Form>
        
        )
    }
}

export default Form.create()(AccountSettings);