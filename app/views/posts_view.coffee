CollectionView = require 'views/base/collection_view'
template = require 'views/templates/posts'
PostView = require 'views/post_view'

module.exports = class PostsView extends CollectionView
  template: template

  itemView: PostView
  listSelector: 'div.posts'

  container: '#page-container'

  autoRender: yes

  initialize: (options) ->
    super
    console.debug 'PostsView#initialize - options', options
    @boardId = options.collection.boardId
    @threadId = options.collection.threadId
    console.debug 'PostsView#initialize - @container', @container
    @delegate('click', 'button.item-edit', @toggleEdit)
    @delegate('submit', 'form.post-create', @create)
    @delegate('submit', 'form.post-edit', @edit)
    @delegate('click', 'button.post-delete', @delete)
    console.debug 'PostsView#@collection ', @collection

  create: (event) =>
    event.preventDefault()
    console.debug 'PostsView#create', event
    result = @collection.create({
        'title': $('input#post-title').val(),
        'description': $('input#post-description').val()
      },{
        'wait': true
      })
    if result?
      $('input.post-create-reset').trigger('click')

  edit: (event) =>
    event.preventDefault()
    console.debug 'PostsView#edit', event
    postContainer = $(event.target).parents('div.post')
    cid = postContainer.data('cid')
    console.debug 'PostsView#edit - cid ', cid
    post = @collection.getByCid(cid)
    console.debug 'PostsView#edit - post before', post
    post.set({
      title: postContainer.find('input.title').val(),
      description: postContainer.find('input.description').val()
    })
    console.debug 'PostsView#edit - post before', post
    post.save()
      .done (response) =>
        @collection.fetch {url: @collection.url()}

    console.debug 'PostsView#edit - post after', post

  delete: (event) =>
    event.preventDefault()
    console.debug 'PostsView#delete', event
    cid = $(event.target).parents('div.post').data('cid')
    console.debug 'PostsView#delete - cid ', cid
    post = @collection.getByCid(cid)
    console.debug 'PostsView#delete - post before', post
    result = post.destroy({
      success: (model, response) ->
        console.debug 'PostsView#delete - post desctroy success model', model
        console.debug 'PostsView#delete - post desctroy success response', response
      error: (model, response) ->
        console.debug 'PostsView#delete - post desctroy error model', model
        console.debug 'PostsView#delete - post desctroy error response', response
      })
    console.debug 'PostsView#delete - result', result
    console.debug 'PostsView#delete - post after', post

  toggleEdit: (event) =>
    console.debug 'PostsView#toggleEdit', event
    $(event.target)
      .closest('div.container')
        .find('div.view').toggleClass('hidden')
      .end()
        .find('div.edit-view').toggleClass('hidden')

  
  # The most important method a class derived from CollectionView
  # must overwrite.
  getView: (item) ->
    # Instantiate an item view
    new PostView model: item, boardId: @boardId, threadId: @threadId