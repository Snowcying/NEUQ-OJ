import React, {Component} from "react";
import {Table,Icon} from "antd";
import "./index.less";
class HomeManage extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        let {data:{introduce, notice = []}} = this.props;
        notice = notice.map((t = {}, i) => ({
            ...t,
            num: i + 1
        }));
        const title = () => (
            <span className="home-manage-table-title">
                <span>公告列表</span>
                <span className="home-manage-table-title-icon">发布公告 <Icon type="plus-square-o" /></span>
            </span>
        );
        const columns = [{
            title: '',
            width: '1%',
            key: 'home-manage',
            className: 'home-manage-none'
        }, {
            title: 'No.',
            dataIndex: 'num',
            key: 'home-manage-num',
            className: 'home-manage-num'
        }, {
            title: '标题',
            dataIndex: 'title',
            key: 'home-manage-title',
            width: 300,
            className: 'home-manage-title'
        }, {
            title: '创建者',
            dataIndex: 'author',
            key: 'home-manage-author',
            className: 'home-manage-author'
        }, {
            title: '修改时间',
            dataIndex: 'date',
            key: 'home-manage-update',
            className: 'home-manage-update'
        }, {
            title: '创建时间',
            dataIndex: 'date',
            key: 'home-manage-date',
            className: 'home-manage-date'
        }, {
            title: '操作',
            render: (text, record) => (
                <span>
                  <a href="#">修改</a>
                  <span className="ant-divider"/>
                  <a href="#">删除</a>
                </span>
            ),
            width: 100,
            key: 'home-manage-action',
            className: 'home-manage-action'
        }];

        return (
            <div className="home-manage">
                <div className="h-1">
                    主页公告
                </div>
                <Table
                    columns={columns}
                    rowKey={record => `home-manage-${record.id}`}
                    dataSource={notice}
                    pagination={false}
                    size="small"
                    key="home-manage-table"
                    className="home-manage-table"
                    expandedRowRender={record => <p>{record.content}</p>}
                    title={title}
                />
            </div>
        );
    }
}

export default HomeManage;
