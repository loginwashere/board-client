module.exports = (match) ->
  match '', 'boards#index'
  
  match 'boards', 'boards#index'
  match 'boards/:boardId', 'boards#show'

  match 'boards/:boardId/threads', 'threads#index'
  match 'boards/:boardId/threads/:threadId', 'threads#show'

  match 'boards/:boardId/threads/:threadId/posts', 'posts#index'
  match 'boards/:boardId/threads/:threadId/posts/:postId', 'posts#show'