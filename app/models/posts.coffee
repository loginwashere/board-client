Collection = require 'models/base/collection'
Post = require 'models/post'

module.exports = class Posts extends Collection
  model: Post
