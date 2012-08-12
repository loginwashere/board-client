View = require 'views/base/view'
template = require 'views/templates/post'

module.exports = class PostView extends View
  template: template

  initialize: (atributes) ->
    console.debug 'PostView#initialize - arguments ', arguments
    console.debug 'PostView#initialize - atributes ', atributes
    @boardId = atributes.boardId
    @threadId = atributes.threadId


  getTemplateData: ->
    console.log 'PostView#getTemplateData - @model - ', @model
    post: @model, boardId: @boardId, threadId: @threadId