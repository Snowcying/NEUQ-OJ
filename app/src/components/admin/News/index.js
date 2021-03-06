import React, { Component } from 'react'
import { Button, Form, Icon, Input, Modal, Radio, Table, Tag } from 'antd'
import './index.less'
import QueueAnim from 'rc-queue-anim'
import { color } from 'utils'
const RadioGroup = Radio.Group
const FormItem = Form.Item
const confirm = Modal.confirm

// TODO 公告 content
@Form.create()
class NewsManage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: false,
      visible: false,
      title: null,
      content: null,
      important: null,
      id: NaN
    }
    this.editNew = this.editNew.bind(this)
    this.delNew = this.delNew.bind(this)
    this.handleOk = this.handleOk.bind(this)
    this.showModal = this.showModal.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
  }

  componentDidMount () {
    this.props.getNewsList()
  }

  showModal () {
    this.setState({
      title: null,
      content: null,
      importance: null,
      id: NaN
    })
    this.setState({
      visible: true
    })
  }

  handleOk (e) {
    e.preventDefault()
    this.setState({loading: true})

    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        await this.props.editNews(values, this.state.id)
        await this.setState({
          visible: false
        })
        await this.props.getNewsList()
        await this.setState({
          title: null,
          content: null,
          importance: null,
          id: NaN
        })
      }
    })
    setTimeout(() => {
      this.setState({loading: false})
    }, 1000)
  }

  handleCancel () {
    this.setState({visible: false})
  }

  createMarkup = html => ({__html: html})

  async editNew (record) {
    await this.props.getNews(record.id)
    const {admin: {news}} = this.props
    await this.setState({
      visible: true,
      title: news.title,
      content: news.content,
      importance: news.importance,
      id: record.id
    })
  }

  delNew (record) {
    confirm({
      title: '确认删除',
      content: '请认真审核信息，一旦删除，本次删除将无法撤销!',
      onOk: async () => {
        await this.props.delNews(record.id)
        await this.props.getNewsList()
      }
    })
  }

  render () {
    const {admin: {newsList}} = this.props
    const {news = []} = newsList
    const privateStatus = [
      '固定',
      '普通',
      '重要',
      '紧急'
    ]
    const colorArr = [
      color.blue, color.green, color.yellow, color.red
    ]
    const title = () => (
      <span className='news-manage-table-title'>
        <span>公告列表</span>
        <span className='news-manage-table-title-icon'>
                    发布公告 <Icon type='plus-square-o' onClick={this.showModal} />
        </span>
      </span>
    )
    const columns = [{
      title: '',
      width: '1%',
      key: 'news-manage',
      className: 'news-manage-none'
    }, {
      title: '#',
      dataIndex: 'id',
      width: 40,
      key: 'news-manage-id',
      className: 'news-manage-id'
    }, {
      title: '标题',
      dataIndex: 'title',
      key: 'news-manage-title',
      className: 'news-manage-title'
    }, {
      title: '创建者ID',
      dataIndex: 'author_id',
      key: 'news-manage-author',
      width: 100,
      className: 'news-manage-author'
    }, {
      title: '修改时间',
      dataIndex: 'updated_at',
      key: 'news-manage-UpdatePassword',
      width: 140,
      className: 'news-manage-UpdatePassword'
    }, {
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'news-manage-date',
      width: 140,
      className: 'news-manage-date'
    }, {
      title: '重要性',
      render: record => (
        <span>
          <Tag color={colorArr[record.importance]}>{privateStatus[record.importance]}</Tag>
        </span>
      ),
      width: 40,
      key: 'news-manage-importance',
      className: 'news-manage-importance'
    }, {
      title: '操作',
      render: () => '修改',
      width: 40,
      key: 'news-manage-action',
      onCellClick: this.editNew,
      className: 'news-manage-action mock-a'
    }, {
      render: () => (
        <a>删除</a>
      ),
      width: 40,
      key: 'news-manage-del',
      onCellClick: this.delNew,
      className: 'news-manage-action'
    }]
    const {getFieldDecorator} = this.props.form

    return (
      <QueueAnim className='news-manage' delay={100}>
        <div className='h-1' key='news-manage'>
          主页公告
        </div>
        <Table
          columns={columns}
          rowKey={record => `news-manage-${record.id}`}
          dataSource={news}
          pagination={false}
          size='small'
          key='news-manage-table'
          className='news-manage-table'
          title={title}
        />
        <div>
          <Modal
            visible={this.state.visible}
            title='添加公告'
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            key={'news-manage-modal-' + this.state.visible}
            footer={[
              <Button key='back' size='large' onClick={this.handleCancel}>取消</Button>,
              <Button
                key='submit'
                type='primary'
                size='large'
                loading={this.state.loading}
                onClick={this.handleOk}
              >
                提交
              </Button>
            ]}
          >
            <Form onSubmit={this.handleOk}>
              <FormItem>
                {getFieldDecorator('title', {
                  rules: [{required: true, message: '请输入标题'}],
                  initialValue: this.state.title ? this.state.title : ''
                })(
                  <Input type='textarea' placeholder='请输入标题' autosize={{maxRows: 6}} />
                )}
              </FormItem>
              <FormItem>
                {getFieldDecorator('content', {
                  rules: [{required: true, message: '请输入内容！'}],
                  initialValue: this.state.content ? this.state.content : ''
                })(
                  <Input
                    type='textarea' placeholder='请输入内容，支持 Markdown 语法，请在 Markdown 编辑器中编辑后粘贴'
                    autosize={{minRows: 2, maxRows: 6}} />
                )}
              </FormItem>
              <FormItem>
                <span style={{marginRight: '10px'}}>请选择重要程度，会根据程度展示不同样式</span>
                {getFieldDecorator('importance', {
                  rules: [{required: true, message: '请选择！'}],
                  initialValue: this.state.importance ? this.state.importance : ''
                })(
                  <RadioGroup onChange={this.onChange}>
                    <Radio value={0}>固定</Radio>
                    <Radio value={1}>普通</Radio>
                    <Radio value={2}>重要</Radio>
                    <Radio value={3}>紧急</Radio>
                  </RadioGroup>
                )}
              </FormItem>
            </Form>
            <div style={{margin: '24px 0'}} />
          </Modal>
        </div>

      </QueueAnim>
    )
  }
}

export default NewsManage
