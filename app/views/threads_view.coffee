CollectionView = require 'views/base/collection_view'
template = require 'views/templates/threads'
ThreadView = require 'views/thread_view'

module.exports = class ThreadsView extends CollectionView
  template: template
  itemView: ThreadView

  container: '#page-container'
  autoRender: yes

  
  # The most important method a class derived from CollectionView
  # must overwrite.
  getView: (item) ->
    # Instantiate an item view
    new ThreadView model: item

