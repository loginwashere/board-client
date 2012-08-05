Collection = require 'models/base/collection'
Board = require 'models/board'

module.exports = class Boards extends Collection
  model: Board

  url: ->
    'http://192.168.1.35:8080' + '/boards'

  parse: (response) ->
    console.log 'Boards - parse - response', response
    response.response.boards
