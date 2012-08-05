Controller = require 'controllers/base/controller'

Board = require 'models/board'
Boards = require 'models/boards'

BoardView = require 'views/board_view'
BoardsView = require 'views/boards_view'

module.exports = class BoardsController extends Controller
  historyURL: (params) ->
    console.log 'BoardsController - historyURL - params: ', params
    if params.alias then "#{params.alias}" else ''

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
    # console.log 'BoardsController - show - params: ', params
    # @model = new Board {alias: params.alias}
    # @view = new BoardView {model: @model}
    # @model.fetch()

    console.log 'BoardsController - show - params: ', params
    @collection = new Boards {alias: params.alias}
    console.log 'collection: ', @collection
    @view = new BoardsView collection: @collection
    @collection.fetch()