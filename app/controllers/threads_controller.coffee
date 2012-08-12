Controller = require 'controllers/base/controller'

Threads = require 'models/threads'
Posts = require 'models/posts'

ThreadsView = require 'views/threads_view'
PostsView = require 'views/posts_view'

module.exports = class ThreadsController extends Controller

  initialize: ->
    console.log 'ThreadsController#initialize'
    super

  index: (params) ->
    console.log 'ThreadsController#index - params: ', params
    @collection = new Threads {boardId: params.boardId}
    console.log 'ThreadsController#collection: ', @collection
    @view = new ThreadsView {collection: @collection, boardId: params.boardId}
    @collection.fetch()

  show: (params) ->
    @currentId = params.threadId
    console.log 'ThreadsController#show - params: ', params
    @collection = new Threads {boardId: params.boardId, threadId: @currentId}
    console.log 'ThreadsController#collection: ', @collection
    @view = new ThreadsView {collection: @collection, boardId: params.boardId, threadId: @currentId}
    @collection.fetch({url: @collection.url() + '/' + @currentId})
    @postsCollection = new Posts {boardId: params.boardId, threadId: @currentId}
    console.log 'ThreadsController#postsCollection: ', @postsCollection
    @postsView = new PostsView collection: @postsCollection
    @postsCollection.fetch()
