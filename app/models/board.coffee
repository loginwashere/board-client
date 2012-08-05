Model = require 'models/base/model'

module.exports = class Board extends Model

  # initialize: (attributes, options) ->
  #   super
  #   console.debug 'Board#initialize', attributes, options
  #   if attributes?.alias?
  #     console.debug 'attributes.alias', attributes.alias
  #     @alias = attributes.alias

  # url: ->
  #   #console.debug 'url - @alias ', @alias
  #   'http://192.168.1.35:8080' + '/boards/' + @alias

  # parse: (response) ->
  #   console.debug 'Board - parse - response', response
  #   if response?.response?
  #     response.response.boards[0]
  #   else
  #     response.response