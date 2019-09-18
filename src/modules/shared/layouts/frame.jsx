import React from 'react'
import style from './style.css'
import { Layout } from 'fish';
import {IndexLink} from "react-router";
const { Header, Footer, Sider, Content } = Layout;

class Frame extends React.Component {
  static propTypes = {
    children: React.PropTypes.element
  }
  render() {
    return (
      <div className="frame">
        <Header>
            答!
          <button className={style.header_right}><IndexLink to="/add">提问</IndexLink></button>
        </Header>
        <Layout>
          <Content>
            {this.props.children}
          </Content>
        </Layout>
      </div>
    )
  }
}

export default Frame
