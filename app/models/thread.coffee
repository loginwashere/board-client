Model = require 'models/base/model'

module.exports = class Thread extends Model
  parse: (response) ->
    console.log 'Thread - parse - response', response
    if response?.response?.threads?
      response.response.threads[0]
    else
      response