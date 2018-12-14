import React, {Component} from 'react';
import {Form, Icon, Input, Button, Checkbox, message} from 'antd';
import storage from '../utils/storage.js';
import {port} from '../common/port'
import {withRouter} from 'react-router-dom';
// import $ from 'jquery';
// import 'whatwg-fetch';
import axios from 'axios';
import cookie from 'react-cookies'

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as userActions from '../redux/action/user';

// import '../style/login.css';
// import '../style/login/reset.css';
import '../style/login/login.css';

const FormItem = Form.Item;

class Login extends Component {

    constructor(props) {
        super(props)
        this.state = {
            type: false
        }
    }

    componentWillMount() {
        // if(storage.get('access_token')) {
        //     this.props.history.push('/erp')
        // }
        if (cookie.load('access_token') && this.props.user.status === 'success') {
            this.props.history.push('/erp')
        }
    }


    handleSubmit = async (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                // console.log('Received values of form: ', values);
                //使用redux
                this.props.userActions.login(values.userName, values.password, values.remember).then(val => {
                    if (val) {
                        const {access_token, remember} = this.props.user
                        cookie.save('access_token', access_token.access_token, {
                            maxAge: access_token.expires_in  //token过期时间
                        })
                        this.props.history.push('/erp')
                    }
                })
            }
        });
    }

    loginType = () => {
        this.setState({
            type: !this.state.type
        })
    }


    render() {
        const {getFieldDecorator} = this.props.form;
        return (
            <div className="login-container">
                <div className="login-header">
                    <div className="bx">
                        <div className="logo">
                            <a href="#">
                                <img src={require('../asset/img/login-logo.png')} alt="logo"/>
                            </a>
                        </div>
                        <div className="apply-use">
                            <a href="http://www.yunzifeng.com/apply/#/client">申请使用</a>
                        </div>
                    </div>
                </div>
                <div className="content clearfix">
                    <img src={require('../asset/img/login-bg.png')} alt=""/>
                    <div className="bx" id="login-box">
                        {
                            !this.state.type ? (
                                <div className="login-form">
                                    <div className="code" onClick={this.loginType}>
                                        <div className="prompt" data-val="0">
                                            <span>扫码登录更安全</span>
                                        </div>
                                    </div>
                                    <div className="login-bx">
                                        <div className="form-title">
                                            <i></i>
                                            <h6>用户登录</h6>
                                        </div>
                                        <Form onSubmit={this.handleSubmit}>
                                            <div className="inputbox">
                                                <FormItem>
                                                    {getFieldDecorator('userName', {
                                                        rules: [{required: true, message: '请输入用户名!'}],
                                                    })(
                                                        <Input prefix={<Icon type="user"
                                                                             style={{color: 'rgba(0,0,0,.25)'}}/>}
                                                               placeholder="用户名"/>
                                                    )}
                                                </FormItem>
                                            </div>
                                            <div className="inputbox">
                                                <FormItem>
                                                    {getFieldDecorator('password', {
                                                        rules: [{required: true, message: '请输入密码!'}],
                                                    })(
                                                        <Input prefix={<Icon type="lock"
                                                                             style={{color: 'rgba(0,0,0,.25)'}}/>}
                                                               type="password" placeholder="密码"/>
                                                    )}
                                                </FormItem>
                                            </div>
                                            <div className="extra">
                                                <label><input name="Fruit" type="checkbox" value=""/>记住密码</label>
                                                <a className="download" href="#">客户端下载</a>
                                                <a href="#">忘记密码?</a>
                                            </div>
                                            <div className="submit">
                                                <Button type="primary" htmlType="submit" className="login-form-button"
                                                        block>
                                                    登录
                                                </Button>
                                            </div>
                                            <p className="apply-account"><a href="#">还没有账户，马上申请</a></p>
                                        </Form>
                                    </div>
                                </div>
                            ) : (
                                <div className="login-form">
                                    <div className="code pas" onClick={this.loginType}>
                                        <div className="prompt" data-val="1">
                                            <span>密码登录在这里</span>
                                        </div>
                                    </div>
                                    <div className="login-bx">
                                        <div className="user-erm-login">
                                            <div className="form-title">
                                                <i></i>
                                                <h6>手机扫码,安全登录</h6>
                                            </div>
                                            <div className="form-erm clearfix">
                                                <img src={require('../asset/img/erm.png')} alt=""/>
                                            </div>
                                            <div className="other-login">
                                                <a style={{marginRight: '10px'}} href="#">密码登录</a>
                                                <a href="#">用户申请</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        }


                    </div>
                </div>
                <div className="footer">
                    <div className="bx">
                        <div className="link">
                            <ul>
                                <li className="link-title">关于我们 法律声明 服务条款</li>
                                <li className="link-title"> 客服电话：400-668-0006</li>
                                <li className="link-contact">地址：广东省深圳市罗湖区庐山大厦14G 邮编：518000</li>
                                <li className="link-contact">Copyright © 2016-2099 深圳云紫峰网络科技股份有限公司 版权所有</li>
                                <li className="link-contact">建议使用IE8及以上版本的浏览器</li>
                            </ul>
                        </div>
                        <div className="erm"></div>
                    </div>
                </div>
            </div>

        );
    }
}

const mapStateToProps = (state) => {
    return {
        store: state.store,
        user: state.user,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        userActions: bindActionCreators(userActions, dispatch)
    }
}

const WrappedNormalLoginForm = withRouter(Form.create()(Login))

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(WrappedNormalLoginForm)