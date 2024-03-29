import React, {Component} from 'react'
import {Button, Icon, Input} from 'fish'
import axios from 'axios'
import InfiniteScroll from 'react-infinite-scroller'
import {timesFormat} from '../../utils'

const { TextArea } = Input

export default class Detail extends Component {
  state = {
    questionList: [],
    init: true,
    answerList: [],
    visible: false,
    inputValue: '',
    hasMore: true
  };
  componentDidMount() {
    this.loadMore()
  }
  goHome = () => {
    this.props.router.push('/')
  };
  handleAnswer = () => {
    this.setState({visible: true})
  };
  handelClose = () => {
    this.setState({visible: false})
  };
  onChange = (e) => {
    this.setState({inputValue: e.target.value})
  };
  handleSubmit = () => {
    const {inputValue} = this.state
    let {questionList} = this.state
    questionList = questionList[0]
    if (Array.isArray(questionList.answerList)) {
      const newAnswer = {
        answerId: questionList.answerList.length + 1,
        content: inputValue,
        name: 'liurongsheng',
        date: new Date() - 0,
        likeNum: 0,
        dislikeNum: 0
      }
      questionList.answerList.unshift(newAnswer)
    } else {
      questionList.answerList = []
      const newAnswer = {
        answerId: 1,
        content: inputValue,
        name: 'liurongsheng',
        date: new Date() - 0,
        likeNum: 0,
        dislikeNum: 0
      }
      questionList.answerList.unshift(newAnswer)
    }
    this.putAPI(this.props.params.id, questionList)
    // const url = `/questions/${this.props.params.id}`
    // const config = {
    //   headers: {
    //     'Content-Type': 'application/json'
    //   }
    // }
    // axios.put(url, questionList, config).then((data) => {
    //   if (data.data.length > 0) {
    //     this.setState({questionList: [...this.state.questionList, ...data.data], init: false, hasMore: true}, () => { console.log(this.state.questionList) })
    //   } else {
    //     this.setState({hasMore: false, init: false})
    //   }
    // }).catch(function (error) {
    //   console.log(error)
    // })
    this.setState({visible: false, inputValue: ''})
  };
  loadMore = (pageIndex = 1) => {
    const url = `/api/v0.1/questions?id=${this.props.params.id}&_page=${pageIndex}&_limit=2&_t=${new Date().getTime()}`
    axios.get(url).then((data) => {
      if (data.data.length > 0) {
        this.setState({questionList: [...this.state.questionList, ...data.data], init: false, hasMore: true}, () => { console.log(this.state.questionList) })
      } else {
        this.setState({hasMore: false, init: false})
      }
    }).catch(function (error) {
      console.log(error)
    })
  };
  putAPI = (id, data) => {
    const url = `/questions/${id}`
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }
    axios.put(url, data, config).then((data) => {
      if (data.data.length > 0) {
        this.setState({questionList: [...this.state.questionList, ...data.data], init: false, hasMore: true}, () => { console.log(this.state.questionList) })
      } else {
        this.setState({hasMore: false, init: false})
      }
    }).catch(function (error) {
      console.log(error)
    })
  }
  item_like_add = (item) => {
    const answerId = item.answerId
    let {questionList} = this.state
    questionList = questionList[0]
    questionList.answerList.map(v => {
      if (v.answerId === answerId) {
        v.likeNum += 1
      }
      return v
    })
    this.putAPI(this.props.params.id, questionList)
  }
  item_dislike_add = (item) => {
    const answerId = item.answerId
    let {questionList} = this.state
    questionList = questionList[0]
    questionList.answerList.map(v => {
      if (v.answerId === answerId) {
        v.dislikeNum += 1
      }
      return v
    })
    this.putAPI(this.props.params.id, questionList)
  }
  render() {
    if (this.state.init) {
      return null
    }
    return (
      <div>
        <header className="detailPage header">
          <div className="header_left fl" onClick={this.goHome}><Icon type="left" /></div>
          <div className="header_center center">问题详情</div>
          <div className="header_right fr">
            <Button type="primary" onClick={this.handleAnswer}>我来回答</Button>
          </div>
        </header>
        <div className="detail_content">
          {this.state.questionList.map((item) => <div key={item.id} className="detail_item">
            <h3 className="title">{item.title}</h3>
            <div className="desc">{item.description}</div>
            <div className="footer">
              <span className="name">{item.author}</span>
              <span className="time">{timesFormat(item.date / 1000)}</span>
              <span className="total">{(item.answerList && item.answerList.length) ? item.answerList.length : 0}个回答</span>
            </div>
          </div>)}
          <div className="answer_list">
            {(this.state.questionList[0].answerList && this.state.questionList[0].answerList.length > 0)
              ? <div>
                <InfiniteScroll
                  pageStart={1}
                  loadMore={this.loadMore}
                  hasMore={this.state.hasMore}
                  loader={<div className="loader" key={0}>加载更多…</div>}
                >
                  {this.state.questionList[0].answerList.map((item) => <div key={item.date} className="item">
                    <div className="item_hd">
                      <span className="name">{item.name}</span>
                      <span className="time">{timesFormat(item.date / 1000)}</span>
                      <span className="item_dislike" onClick={() => this.item_dislike_add(item)}><Icon type="dislike" />{item.dislikeNum > 999 ? '999+' : item.dislikeNum}</span>
                      <div className="item_like" onClick={() => this.item_like_add(item)}><Icon type="like" />{item.likeNum > 999 ? '999+' : item.likeNum}</div>
                    </div>
                    <div className="item_content">{item.content}</div>

                  </div>)}
                </InfiniteScroll>
                {!this.state.hasMore && <div className="bottom">没有更多问题了！</div>}
              </div>
              : <div className="bottom">暂无数据！</div>}
          </div>
        </div>
        <div className="answer-popup-box" style={{display: this.state.visible ? 'block' : 'none'}}>
          <div className="answer-popup">
            <div className="title">
              我的回答（200字以内）
              <span className="close" onClick={this.handelClose}><Icon type="close" /></span>
            </div>
            <TextArea rows={4} placeholder="请输入答案" value={this.state.inputValue} onChange={this.onChange} />
            <div className="submit"><Button type="primary" onClick={this.handleSubmit}>提交回答</Button></div>
          </div>
        </div>
      </div>
    )
  }
}
