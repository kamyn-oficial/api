import Route from '@ioc:Adonis/Core/Route'
import fs from 'fs'
import path from 'path'
import ProductRepository from 'App/Repositories/ProductRepository'

Route.group(() => {
  Route.post('register', 'AuthController.register')
  Route.post('forgot-password', 'AuthController.forgotPassword')
  Route.post('reset-password', 'AuthController.resetPassword')
  Route.post('login', 'AuthController.login')
  Route.get('logout', 'AuthController.logout')
  Route.get('products', 'ProductController.index')
  Route.get('comments', 'CommentController.allUserLogged')
  Route.get('banner', 'BannerController.index')
  Route.get('product/:id', 'ProductController.show')
  Route.get('fy', 'ProductController.fy')
  Route.get('/category', 'CategoryController.index')
  Route.get('/size', 'SizeController.index')
  Route.post('/order/notification', 'OrderController.notification')

  Route.group(() => {
    Route.group(() => {
      Route.group(() => {
        Route.post('/', 'BannerController.store')
        Route.put('/:id', 'BannerController.update')
        Route.delete('/:id', 'BannerController.delete')
      }).prefix('banner')

      Route.group(() => {
        Route.post('/', 'ProductController.store')
        Route.put('/:id', 'ProductController.update')
        Route.delete('/:id', 'ProductController.delete')
      }).prefix('product')

      Route.group(() => {
        Route.get('/:id', 'CategoryController.show')
        Route.post('/', 'CategoryController.store')
        Route.put('/:id', 'CategoryController.update')
        Route.delete('/:id', 'CategoryController.delete')
      }).prefix('category')

      Route.group(() => {
        Route.get('/', 'OrderController.index')
        Route.put('/:id', 'OrderController.updateStatus')
      }).prefix('order')

      Route.group(() => {
        Route.get('/:id', 'SizeController.show')
        Route.post('/', 'SizeController.store')
        Route.put('/:id', 'SizeController.update')
        Route.delete('/:id', 'SizeController.delete')
      }).prefix('size')

      Route.group(() => {
        Route.get('/', 'UserController.index')
        Route.post('/', 'UserController.store')
        Route.put('/:id', 'UserController.update')
        Route.delete('/:id', 'UserController.delete')
      }).prefix('user')

      Route.group(() => {
        Route.get('/', 'CommentController.index')
      }).prefix('comment')
    }).middleware('permission:isAdm')

    Route.group(() => {
      Route.get('/', 'AuthController.me')
      Route.put('/', 'AuthController.update')
    }).prefix('me')

    Route.group(() => {
      Route.get('/', 'AddressController.index')
      Route.post('/', 'AddressController.store')
      Route.put('/:id', 'AddressController.update')
      Route.delete('/:id', 'AddressController.delete')
    }).prefix('address')

    Route.group(() => {
      Route.get('/find/:id', 'OrderController.show')
      Route.get('/my', 'OrderController.listUserLogged')
      Route.post('/', 'OrderController.store')
      Route.post('/delivered/:id', 'OrderController.delivered')
    }).prefix('order')

    Route.group(() => {
      Route.post('/', 'CommentController.store')
      Route.delete('/:id', 'CommentController.delete')
    }).prefix('comment')
  }).middleware('jwt:accessToken')
}).prefix('api')

Route.get('/admin', ({ response }) => {
  return response.redirect('https://adm-six.vercel.app/')
})

Route.get('/:product_name', async ({ request, response }) => {
  const productName = decodeURI(request.params().product_name)
  const productId = productName.split('-').pop()
  try {
    if (!productId) return response.redirect(productName)
    const product = await ProductRepository.findById(productId)
    if (!product._id) return response.redirect('/404.html')
    const filePath = path.join(__dirname, '..', 'app', 'Assets', 'product.html')
    const file = fs
      .readFileSync(filePath, 'utf8')
      .replace(`var data = '{}'`, `var data = ${JSON.stringify(product)}`)
    return response.send(file)
  } catch (error) {
    console.log(error)
    return response.redirect('/404.html')
  }
})

Route.any('*', ({ response }) => response.redirect('/404.html'))
