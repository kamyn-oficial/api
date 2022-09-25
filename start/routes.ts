import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('ping', 'AuthController.ping')
  Route.post('register', 'AuthController.register')
  Route.post('login', 'AuthController.login')
  Route.get('logout', 'AuthController.logout')

  Route.group(() => {
    Route.get('me', 'AuthController.me')
    Route.put('me', 'AuthController.update')

    Route.get('address', 'AddressController.index')
    Route.post('address', 'AddressController.create')
    Route.put('address/:id', 'AddressController.update')
    Route.delete('address/:id', 'AddressController.delete')
  }).middleware('jwt:accessToken')
}).prefix('api')

Route.any('*', ({ response }) => response.redirect('/404.html'))
