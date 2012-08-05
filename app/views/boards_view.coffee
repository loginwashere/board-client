CollectionView = require 'views/base/collection_view'
template = require 'views/templates/boards'
BoardView = require 'views/board_view'

module.exports = class BoardsView extends CollectionView
  template: template
  itemView: BoardView

  container: '#page-container'
  autoRender: yes

  
  # The most important method a class derived from CollectionView
  # must overwrite.
  getView: (item) ->
    # Instantiate an item view
    new BoardView model: item
