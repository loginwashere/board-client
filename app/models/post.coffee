Model = require 'models/base/model'

module.exports = class Post extends Model
  parse: (response) ->
    console.log 'Post#parse - response', response
    if response?.response?.posts?
      response.response.posts[0]
    else
      response