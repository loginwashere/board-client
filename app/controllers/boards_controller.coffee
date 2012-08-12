Controller = require 'controllers/base/controller'

Boards = require 'models/boards'
Threads = require 'models/threads'

BoardsView = require 'views/boards_view'
ThreadsView = require 'views/threads_view'

module.exports = class BoardsController extends Controller

  initialize: ->
    console.log 'BoardsController - initialize'
    super

  index: (params) ->
    console.log 'BoardsController - index - params: ', params
    @collection = new Boards()
    console.log 'collection: ', @collection
    @view = new BoardsView collection: @collection
    @collection.fetch()

  show: (params) ->
    @currentId = params.boardId
    console.log 'BoardsController - show - params: ', params
    @collection = new Boards {boardId: @currentId}
    console.log 'collection: ', @collection
    @view = new BoardsView collection: @collection
    @collection.fetch({url: @collection.url() + '/' + @currentId})
    @threadsCollection = new Threads {boardId: @currentId}
    console.log 'threadsCollection: ', @threadsCollection
    @threadsView = new ThreadsView collection: @threadsCollection
    @threadsCollection.fetch()