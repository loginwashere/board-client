Model = require 'models/base/model'

module.exports = class Board extends Model
  parse: (response) ->
    console.log 'Board - parse - response', response
    if response?.response?.boards?
      response.response.boards[0]
    else
      response
