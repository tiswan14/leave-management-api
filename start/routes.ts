import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  // Konvensional
  Route.post('/auth/register', 'AuthController.register')
    .middleware(['throttle:3,60'])
  Route.post('/auth/login', 'AuthController.login')
    .middleware(['throttle:5,60'])

  // OAuth Google
  Route.get('/auth/google/redirect', 'GoogleAuthController.redirect')
  Route.get('/auth/google/callback', 'GoogleAuthController.callback')
    .middleware(['throttle:10,60'])

  // --- LEAVE MANAGEMENT SECTION ---
  Route.group(() => {
    Route.post('/auth/logout', 'AuthController.logout')
    Route.get('/me', 'AuthController.me')

    // Employee
    Route.get('/leave', 'LeaveController.index')
    Route.post('/leave', 'LeaveController.store')

    // Admin
    Route.group(() => {
      Route.get('/admin/leave', 'LeaveController.adminIndex')
      Route.patch('/admin/leave/:id', 'LeaveController.updateStatus')
    }).middleware('admin')

  }).middleware('auth:api')

}).prefix('/api')
// Route Root untuk cek server jalan atau tidak
Route.get('/', async () => {
  return { status: 'Server is running', message: 'Hello Wan!' }
})