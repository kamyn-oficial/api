/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.post('register', 'AuthController.register')
Route.get('register/:provider', 'AuthController.register')
Route.get('callback/:provider', 'AuthController.socialMediaCallback')
Route.post('login', 'AuthController.login')
Route.post('sing-out', 'AuthController.singOut').middleware('jwt:accessToken')
Route.get('confirm-email', 'AuthController.confirmEmail')
Route.post('send-confirm-email', 'AuthController.sendConfirmEmail').middleware(
  'jwt:accessToken'
)

Route.group(() => {
  Route.post('add', 'PasswordController.add').middleware('jwt:accessToken')
  Route.put('change', 'PasswordController.change').middleware('jwt:accessToken')
  Route.post('forgot', 'PasswordController.forgot')
  Route.post('reset', 'PasswordController.reset').middleware(
    'jwt:resetPasswordToken'
  )
}).prefix('password')

Route.group(() => {
  Route.post('/search', 'UserController.search')
  Route.delete('/:userId', 'UserController.delete')
  Route.get('/:id', 'UserController.view')
})
  .prefix('user')
  .middleware('jwt:accessToken')

Route.group(() => {
  Route.get('/', 'UserController.index')
  Route.put('/', 'UserController.update')
})
  .prefix('me')
  .middleware('jwt:accessToken')
