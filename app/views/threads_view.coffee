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
    @delegate('click', 'button.item-edit', @toggleEdit)
    @delegate('submit', 'form.thread-create', @create)
    console.debug 'ThreadsView - @collection ', @collection

  create: (event) =>
    event.preventDefault()
    console.debug 'ThreadsView#create', event
    result = @collection.create({
        'title': $('input#thread-title').val(),
        'description': $('input#thread-description').val()
      },{
        'wait': true
      })
    if result?
      $('input.thread-create-reset').trigger('click')

  toggleEdit: (event) =>
    console.debug 'ThreadsView#toggleEdit', event
    $(event.target)
      .closest('div.container')
        .find('div.view').toggleClass('hidden')
      .end()
        .find('div.edit-view').toggleClass('hidden')

  
  # The most important method a class derived from CollectionView
  # must overwrite.
  getView: (item) ->
    # Instantiate an item view
    new ThreadView model: item, boardId: @boardId

