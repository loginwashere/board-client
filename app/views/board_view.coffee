View = require 'views/base/view'
template = require 'views/templates/board'

module.exports = class BoardView extends View
  template: template
  
  initialize: (atributes) ->
    console.debug 'BoardView - initialize - arguments ', arguments
    console.debug 'BoardView - initialize - atributes ', atributes


  getTemplateData: ->
    console.log 'BoardView - @model - ', @model
    tojsonModel = @model.toJSON()
    console.log 'BoardView - @model - json', tojsonModel
    board: @model