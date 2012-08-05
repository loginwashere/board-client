module.exports = (match) ->
  match '', 'boards#index'
  match 'boards', 'boards#index'
  match ':alias', 'boards#show'
