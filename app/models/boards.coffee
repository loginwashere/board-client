Collection = require 'models/base/collection'
Board = require 'models/board'
config = require 'config'

module.exports = class Boards extends Collection
  model: Board

  initialize: (attributes, options) ->
    super
    console.debug 'Boards#initialize - attributes', attributes 
    if attributes?.boardId?
      console.debug 'attributes.boardId', attributes.boardId
      @boardId = attributes.boardId

  url: (method) ->
    url = config.api.root + '/boards'
    
    switch method
      when 'read', 'delete', 'update'
        if @boardId?
          url += '/' + @boardId
      when 'create' then url
      else
        url

    console.debug 'Boards - url - @boardId ', @boardId
    console.debug 'Boards - url - @boardId? ', @boardId?
    console.debug 'Boards - url - method ', method
    console.debug 'Boards - url - url ', url
    url

  sync: (method, model, options) ->
    @url(method)

    Backbone.sync method, model, options
    console.debug 'Boards#sync - method ', method
    console.debug 'Boards#sync - model ', model
    console.debug 'Boards#sync - options ', options

  parse: (response) ->
    console.log 'Boards - parse - response', response
    response.response.boards
