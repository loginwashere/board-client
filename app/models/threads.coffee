Collection = require 'models/base/collection'
Thread = require 'models/thread'
config = require 'config'

module.exports = class Threads extends Collection
  model: Thread

  initialize: (attributes, options) ->
    super
    console.debug 'Threads#initialize - attributes', attributes 
    if attributes?.alias?
      console.debug 'attributes.alias', attributes.alias
      console.debug 'attributes.threadId', attributes.threadId
      @alias = attributes.alias
      if attributes.threadId?
        @threadId = attributes.threadId

  url: ->
    console.debug 'Threads - url - @alias ', @alias
    url = config.api.root + '/boards/' + @alias + '/threads'
    if @threadId?
      url = url + '/' + @threadId
    url

  parse: (response) ->
    console.log 'Threads - parse - response', response
    response.response.threads

