import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  //Konvensional
  Route.post('/auth/register', 'AuthController.register')
  Route.post('/auth/login', 'AuthController.login')
  Route.post('/auth/logout', 'AuthController.logout')

  //OAuth Google
  Route.get('/auth/google/redirect', 'GoogleAuthController.redirect')
  Route.get('/auth/google/callback', 'GoogleAuthController.callback')

}).prefix('/api')

// Route Root untuk cek server jalan atau tidak
Route.get('/', async () => {
  return { status: 'Server is running', message: 'Hello Wan!' }
})