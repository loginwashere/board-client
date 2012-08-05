Collection = require 'models/base/collection'
Board = require 'models/board'

module.exports = class Boards extends Collection
  model: Board

  initialize: (attributes, options) ->
    super
    console.debug 'Boards#initialize - attributes', attributes 
    if attributes?.alias?
      console.debug 'attributes.alias', attributes.alias
      @alias = attributes.alias

  url: ->
    console.debug 'Boards - url - @alias ', @alias
    url = 'http://192.168.1.35:8080' + '/boards'
    if @alias?
      url = url + '/' + @alias
    url

  parse: (response) ->
    console.log 'Boards - parse - response', response
    response.response.boards
