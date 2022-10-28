import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('ping', 'AuthController.ping')
  Route.post('register', 'AuthController.register')
  Route.post('login', 'AuthController.login')
  Route.get('logout', 'AuthController.logout')

  Route.group(() => {
    Route.group(() => {
      Route.get('user', 'UserController.index')
      Route.post('user', 'UserController.store')
      Route.put('user/:id', 'UserController.update')
      Route.delete('user/:id', 'UserController.delete')
    }).middleware('permission:isAdm')

    Route.get('me', 'AuthController.me')
    Route.put('me', 'AuthController.update')

    Route.get('address', 'AddressController.index')
    Route.post('address', 'AddressController.create')
    Route.put('address/:id', 'AddressController.update')
    Route.delete('address/:id', 'AddressController.delete')
  }).middleware('jwt:accessToken')
}).prefix('api')

Route.get('/adm', ({ response }) => {
  return response.redirect('https://adm-six.vercel.app/')
})

Route.any('*', ({ response }) => response.redirect('/404.html'))
