Collection = require 'models/base/collection'
Post = require 'models/post'
config = require 'config'

module.exports = class Posts extends Collection
  model: Post

  initialize: (attributes, options) ->
    super
    console.debug 'Posts#initialize - attributes', attributes 
    if attributes?.boardId?
      console.debug 'Posts#initialize - attributes.boardId', attributes.boardId
      console.debug 'Posts#initialize - attributes.threadId', attributes.threadId
      console.debug 'Posts#initialize - attributes.postId', attributes.postId
      @boardId = attributes.boardId
      if attributes.threadId?
        @threadId = attributes.threadId
        if attributes.postId?
          @postId = attributes.postId

  url: ->
    console.debug 'Posts#url - @boardId ', @boardId
    console.debug 'Posts#url - @threadId ', @threadId
    console.debug 'Posts#url - @postId ', @postId
    url = config.api.root + '/boards/' + @boardId + '/threads/' + @threadId + '/posts'
    if @postId?
      url = url + '/' + @postId
    url

  parse: (response) ->
    console.log 'Posts#parse - response', response
    response.response.posts
