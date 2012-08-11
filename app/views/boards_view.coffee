CollectionView = require 'views/base/collection_view'
template = require 'views/templates/boards'
BoardView = require 'views/board_view'
Board = require 'models/board'

module.exports = class BoardsView extends CollectionView
  initialize: (options) ->
    super
    console.debug 'BoardsView#initialize', @el, @$el, options
    @delegate('submit', 'form.board-create', @create)
    @delegate('click', 'i.board-delete', @delete)
    @delegate('click', 'i.board-edit', @toggleEdit)
    @delegate('submit', 'form.board-edit', @edit)

  create: (event) =>
    event.preventDefault()
    console.debug 'BoardsView#save', event
    @collection.create({
        'alias': $('input#board-alias').val(),
        'title': $('input#board-title').val(),
        'description': $('input#board-description').val()
      },{
        'wait': true
      })

  delete: (event) =>
    event.preventDefault()
    console.debug 'BoardsView#delete', event
    cid = $(event.target).parents('div.board').data('cid')
    console.debug 'BoardsView#delete - alias ', cid
    board = @collection.getByCid(cid)
    console.debug 'BoardsView#delete - board before', board
    result = board.destroy({
      success: (model, response) ->
        console.debug 'BoardsView#delete - board desctroy success model', model
        console.debug 'BoardsView#delete - board desctroy success response', response
      error: (model, response) ->
        console.debug 'BoardsView#delete - board desctroy error model', model
        console.debug 'BoardsView#delete - board desctroy error response', response
      })
    console.debug 'BoardsView#delete - result', result
    console.debug 'BoardsView#delete - board after', board

  toggleEdit: (event) =>
    console.debug 'BoardsView#toggleEdit', event
    $(event.target).parents('div.board').find('div.board-view').toggleClass('hidden')
    $(event.target).parents('div.board').find('div.board-edit-view').toggleClass('hidden')

  edit: (edit) =>
    event.preventDefault()
    console.debug 'BoardsView#edit', event
    boardContainer = $(event.target).parents('div.board')
    cid = boardContainer.data('cid')
    console.debug 'BoardsView#edit - alias ', cid
    board = @collection.getByCid(cid)
    console.debug 'BoardsView#edit - board before', board
    board.set({
      title: boardContainer.find('input.title').val(),
      description: boardContainer.find('input.description').val()
    })
    console.debug 'BoardsView#edit - board before', board
    board.save()
      .done (response) =>
        @collection.fetch()

    console.debug 'BoardsView#edit - board after', board

  template: template

  itemView: BoardView

  listSelector: 'div.boards'

  container: '#page-container'

  autoRender: yes
  
  # The most important method a class derived from CollectionView
  # must overwrite.
  getView: (item) ->
    # Instantiate an item view
    new BoardView model: item
