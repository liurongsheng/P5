import React from 'react'
import {Router, Route} from 'react-router'
import Intl from 'i18n/intl'

const QuestionList = (location, callback) => {
  require.ensure([], require => {
    callback(null, require('modules/question/lists'))
  }, 'QuestionList')
}
const QuestionDetail = (location, callback) => {
  require.ensure([], require => {
    callback(null, require('modules/question/detail'))
  }, 'QuestionDetail')
}
const QuestionArticleAdd = (location, callback) => {
  require.ensure([], require => {
    callback(null, require('modules/question/add'))
  }, 'QuestionArticleAdd')
}

const routes = history => (
  <Router history={history}>
    <Route component={Intl}>
      <Route exact path="/" getComponent={QuestionList} />
      <Route path="/detail/:id" getComponent={QuestionDetail} />
      <Route path="/add" getComponent={QuestionArticleAdd} />
    </Route>
  </Router>
)

export default routes
