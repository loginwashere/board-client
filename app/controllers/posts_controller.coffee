Controller = require 'controllers/base/controller'
Threads = require 'models/threads'
Posts = require 'models/posts'

ThreadsView = require 'views/threads_view'
PostsView = require 'views/posts_view'
module.exports = class PostsController extends Controller
  
  initialize: ->
    console.log 'PostsController - initialize'
    super

  index: (params) ->
    console.log 'PostsController - index - params: ', params
    @collection = new Posts {boardId: params.boardId, threadId: params.threadId}
    console.log 'collection: ', @collection
    @view = new PostsView {collection: @collection, boardId: params.boardId, threadId: params.threadId}
    @collection.fetch()

  show: (params) ->
    console.log 'PostsController - show - params: ', params
    @collection = new Posts {boardId: params.boardId, threadId: params.threadId, postId: params.postId}
    console.log 'collection: ', @collection
    @view = new PostsView {collection: @collection, boardId: params.boardId, postId: params.postId}
    @collection.fetch()