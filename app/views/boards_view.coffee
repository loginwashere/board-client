CollectionView = require 'views/base/collection_view'
template = require 'views/templates/boards'
BoardView = require 'views/board_view'
Board = require 'models/board'

module.exports = class BoardsView extends CollectionView
  initialize: (options) ->
    super
    console.debug 'BoardsView#initialize', @el, @$el, options
    @delegate('submit', 'form.boards', @save)

  save: (event) =>
    event.preventDefault()
    console.debug 'BoardsView#save', event

    console.debug @board
    @collection.create({
      'alias': $('input#board-alias').val(),
      'title': $('input#board-title').val(),
      'description': $('input#board-description').val()
    })

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
