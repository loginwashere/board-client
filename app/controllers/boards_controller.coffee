Controller = require 'controllers/base/controller'

Boards = require 'models/boards'

BoardsView = require 'views/boards_view'

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
    console.log 'BoardsController - show - params: ', params
    @collection = new Boards {alias: params.alias}
    console.log 'collection: ', @collection
    @view = new BoardsView collection: @collection
    @collection.fetch()