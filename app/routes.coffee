module.exports = (match) ->
  match '', 'boards#index'
  
  match 'boards', 'boards#index'
  match 'boards/:alias', 'boards#show'

  match 'boards/:alias/threads', 'threads#index'
  match 'boards/:alias/threads/:threadId', 'threads#show'

  match 'boards/:alias/threads/:threadId/posts', 'posts#index'
  match 'boards/:alias/threads/:threadId/posts/:postId', 'posts#show'