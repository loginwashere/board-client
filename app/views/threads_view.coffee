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
    # @container = '.board-' + options.collection.boardId + '-threads'
    console.debug 'ThreadsView#initialize - @container', @container
    @delegate('click', 'button.item-edit', @toggleEdit)
    @delegate('submit', 'form.thread-create', @create)
    @delegate('submit', 'form.thread-edit', @edit)
    @delegate('click', 'button.thread-delete', @delete)
    console.debug 'ThreadsView#@collection ', @collection

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

  edit: (event) =>
    event.preventDefault()
    console.debug 'ThreadsView#edit', event
    threadContainer = $(event.target).parents('div.thread')
    cid = threadContainer.data('cid')
    console.debug 'ThreadsView#edit - cid ', cid
    thread = @collection.getByCid(cid)
    console.debug 'ThreadsView#edit - thread before', thread
    thread.set({
      title: threadContainer.find('input.title').val(),
      description: threadContainer.find('input.description').val()
    })
    console.debug 'ThreadsView#edit - thread before', thread
    thread.save()
      .done (response) =>
        @collection.fetch {url: @collection.url()}

    console.debug 'ThreadsView#edit - thread after', thread

  delete: (event) =>
    event.preventDefault()
    console.debug 'ThreadsView#delete', event
    cid = $(event.target).parents('div.thread').data('cid')
    console.debug 'ThreadsView#delete - cid ', cid
    thread = @collection.getByCid(cid)
    console.debug 'ThreadsView#delete - thread before', thread
    result = thread.destroy({
      success: (model, response) ->
        console.debug 'ThreadsView#delete - thread desctroy success model', model
        console.debug 'ThreadsView#delete - thread desctroy success response', response
      error: (model, response) ->
        console.debug 'ThreadsView#delete - thread desctroy error model', model
        console.debug 'ThreadsView#delete - thread desctroy error response', response
      })
    console.debug 'ThreadsView#delete - result', result
    console.debug 'ThreadsView#delete - thread after', thread

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

