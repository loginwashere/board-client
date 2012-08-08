View = require 'views/base/view'
template = require 'views/templates/thread'

module.exports = class ThreadView extends View
  template: template

  initialize: (atributes) ->
    console.debug 'ThreadView - initialize - arguments ', arguments
    console.debug 'ThreadView - initialize - atributes ', atributes


  getTemplateData: ->
    console.log 'ThreadView - @model - ', @model
    thread: 
      @model.toJSON()