View = require 'views/base/view'
template = require 'views/templates/thread'

module.exports = class ThreadView extends View
  template: template

  initialize: (atributes) ->
    console.debug 'ThreadView - initialize - arguments ', arguments
    console.debug 'ThreadView - initialize - atributes ', atributes
    @boardId = atributes.boardId


  getTemplateData: ->
    console.log 'ThreadView - @model - ', @model
    thread: @model, boardId: @boardId
