import { BackTop } from "antd";
import "./index.css";

const style = {
    height: 40,
    width: 40,
    lineHeight: '40px',
    borderRadius: 4,
    backgroundColor: '#1088e9',
    color: '#fff',
    textAlign: 'center',
    fontSize: 14,
};

export default function Dashboard(props) {
    return (
        <div style={{ maxWidth: '1200px', margin: '10px auto', padding: '0 5px', minHeight: '400px' }}>
            <div id='easymark-edit-area' className='main-editor'>
                <h1>Python Django 服务器开发</h1>
                <h2>Python Django 服务器开发</h2>
                <h3>Python Django 服务器开发</h3>
                <h4>Python Django 服务器开发</h4>
                <h5>Python Django 服务器开发</h5>
                <h6>Python Django 服务器开发</h6>
                <p>Python Django 服务器开发</p>
                {/* <h3 style={{ padding: '10px' }}>Python Django 服务器开发</h3>
                <div className="site-layout-background" style={{ padding: 24, minHeight: '400px' }}>
                    <p>早上好，<a href="/">Somebody</a>！欢迎登录 XXX 管理系统。</p>
                    <h3>商品营销信息概览：</h3>
                    <div style={{ marginTop: '20px' }}>
                        <DemoChart></DemoChart>
                    </div>
                </div>
                <div className="site-layout-background" style={{ padding: 24, marginTop: '20px', minHeight: '400px' }}>
                    <p>早上好，<a href="/">Somebody</a>！欢迎登录 XXX 管理系统。</p>
                    <h3>商品营销信息概览：</h3>
                    <div style={{ marginTop: '20px' }}>
                        <DemoChart></DemoChart>
                    </div>
                </div> */}
            </div>
            <BackTop>
                <div style={style}>UP</div>
            </BackTop>
        </div>
    )
}