Collection = require 'models/base/collection'
Thread = require 'models/thread'
config = require 'config'

module.exports = class Threads extends Collection
  model: Thread

  initialize: (attributes, options) ->
    super
    console.debug 'Threads#initialize - attributes', attributes 
    if attributes?.boardId?
      console.debug 'Threads#attributes.boardId', attributes.boardId
      console.debug 'Threads#attributes.threadId', attributes.threadId
      @boardId = attributes.boardId
      if attributes.threadId?
        @threadId = attributes.threadId

  url: ->
    console.debug 'Threads#url - @boardId ', @boardId
    console.debug 'Threads#url - @threadId ', @threadId
    url = config.api.root + '/boards/' + @boardId + '/threads'
    # if @threadId?
    #   url = url + '/' + @threadId
    url

  parse: (response) ->
    console.log 'Threads#parse - response', response
    response.response.threads

