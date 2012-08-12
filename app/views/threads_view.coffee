CollectionView = require 'views/base/collection_view'
template = require 'views/templates/threads'
ThreadView = require 'views/thread_view'

module.exports = class ThreadsView extends CollectionView
  template: template
  itemView: ThreadView
  listSelector: 'div.threads'

  container: '#page-container'

  autoRender: yes

  initialize: (options) ->
    super
    console.debug 'ThreadsView#initialize - options', options
    @boardId = options.collection.boardId
    @container = '.board-' + options.collection.boardId + '-threads'
    console.debug 'ThreadsView#initialize - @container', @container

  
  # The most important method a class derived from CollectionView
  # must overwrite.
  getView: (item) ->
    # Instantiate an item view
    new ThreadView model: item, boardId: @boardId

