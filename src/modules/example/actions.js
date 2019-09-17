import {createAction} from 'redux-actions'
import * as T from './actionTypes'
import axios from 'axios'

export const articleGet = createAction(T.ARTICLE_GET,
  () => axios.get('/api/v0.1/articles')
)

export const articleAdd = createAction(T.ARTICLE_ADD,
  (data) => axios.post('/api/v0.1/articles', data)
)
