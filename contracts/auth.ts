// contracts/auth.ts
import User from 'App/Models/User'

declare module '@ioc:Adonis/Addons/Auth' {
  interface ProvidersList {
    user: {
      implementation: import('@ioc:Adonis/Addons/Auth').LucidProviderContract<typeof User>
      config: import('@ioc:Adonis/Addons/Auth').LucidProviderConfig<typeof User>
    }
  }

  interface GuardsList {
    api: {
      implementation: import('@ioc:Adonis/Addons/Auth').OATGuardContract<typeof User, 'api'>
      config: import('@ioc:Adonis/Addons/Auth').OATGuardConfig<typeof User>
    }
  }
}