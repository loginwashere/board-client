Controller = require 'controllers/base/controller'

Threads = require 'models/threads'

ThreadsView = require 'views/threads_view'

module.exports = class ThreadsController extends Controller

  initialize: ->
    console.log 'ThreadsController - initialize'
    super

  index: (params) ->
    console.log 'ThreadsController - index - params: ', params
    @collection = new Threads {alias: params.alias}
    console.log 'collection: ', @collection
    @view = new ThreadsView {collection: @collection, alias: params.alias}
    @collection.fetch()

  show: (params) ->
    console.log 'ThreadsController - show - params: ', params
    @collection = new Threads {alias: params.alias, threadId: params.threadId}
    console.log 'collection: ', @collection
    @view = new ThreadsView {collection: @collection, alias: params.alias}
    @collection.fetch()