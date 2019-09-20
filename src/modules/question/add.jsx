import React, {Component} from 'react'
import {Button, message, Icon, Form, Input, Modal} from 'fish'
import axios from 'axios'

const { TextArea } = Input
class AddPage extends Component {
  goHome = () => {
    this.props.router.push('/')
  };
  // 标题校验
  checkTitle = (rule, value, callback) => {
    // 只允许输入中文，英文或者数字
    const reg = /^[\u4e00-\u9fa5a-z0-9]+$/gi
    if (value && !reg.test(value)) {
      const msg = '只能输入中文，英文或数字'
      callback(msg)
    }
    callback()
  };

  handleSubmit = (e) => {
    e.preventDefault()
    const { getFieldValue, setFieldsValue } = this.props.form
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        Modal.confirm({
          content: '是否确认提交问题',
          zIndex: 9999,
          onOk() {
            axios.post(`/api/v0.1/questions`, {
              'title': getFieldValue('title'),
              'description': getFieldValue('description'),
              'date': new Date() - 0,
              'author': 'liu',
              'answerList': [],
              'isMine': true
            }).then((data) => {
              message.success('发布成功')
              setFieldsValue({
                title: '',
                description: ''
              })
            }).catch(function (error) {
              console.log(error)
            })
          }
        })
      }
    })
  };

  render() {
    const { getFieldDecorator } = this.props.form
    // const formItemLayout = {
    //   labelCol: {
    //     xs: { span: 24 },
    //     sm: { span: 8 },
    //   },
    //   wrapperCol: {
    //     xs: { span: 24 },
    //     sm: { span: 16 },
    //   },
    // };
    return (
      <div>
        <header className="addPage header">
          <div className="header_left fl" onClick={this.goHome}><Icon type="left" /></div>
          <div className="header_center center">发布问题</div>
          <div className="header_right fr">
            <Button type="primary" onClick={this.handleSubmit}>提问</Button>
          </div>
        </header>
        <div className="addPage form_content">
          <Form onSubmit={this.handleSubmit} >
            <Form.Item label="标题：（50字以内的中文、英文或数字）">
              {getFieldDecorator('title', {
                rules: [{
                  required: true, message: '请输入标题！'
                }, {
                  max: 50, message: '最多只能输入50个字！'
                }, {
                  validator: this.checkTitle
                }]
              })(
                <Input placeholder="请输入问题标题" />
              )}
            </Form.Item>
            <Form.Item label="描述：（200字以内）">
              {getFieldDecorator('description', {
                rules: [{
                  required: true, message: '请输入问题描述！'
                }, {
                  max: 200, message: '最多只能输入200个字！'
                }, {
                  validator: this.checkTitle
                }]
              })(
                <TextArea rows={10} placeholder="请输入问题描述" />
              )}
            </Form.Item>
          </Form>
          <div className="form_footer">
            <Button type="primary" onClick={this.handleSubmit}>提交</Button>
            <Button onClick={this.goHome}>取消</Button>
          </div>
        </div>
      </div>
    )
  }
}
export default Form.create()(AddPage)
