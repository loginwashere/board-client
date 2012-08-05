View = require 'views/base/view'
template = require 'views/templates/board'

module.exports = class BoardView extends View
  template: template
  
  getTemplateData: ->
    console.log 'BoardView - @model - ', @model
    board: 
      @model.toJSON()