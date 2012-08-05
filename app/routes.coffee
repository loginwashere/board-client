module.exports = (match) ->
  match '', 'boards#index'
  match 'boards', 'boards#index'
  match 'boards/:alias', 'boards#show'
