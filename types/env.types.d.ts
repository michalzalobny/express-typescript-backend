declare namespace NodeJS {
  export interface ProcessEnv {
    DATABASE_USER: string
    DATABASE_PASSWORD: string

    COOKIE_SECRET: string

    MAIL_HOST: string
    MAIL_USER: string
    MAIL_PASSWORD: string
    MAIL_DESTINATION: string

    FACEBOOK_CLIENT_SECRET: string
    FACEBOOK_CLIENT_ID: string

    GOOGLE_CLIENT_SECRET: string
    GOOGLE_CLIENT_ID: string

    APP_EXPIRATION_TIME: string

    NEXT_PUBLIC_APP_PATH: string

    NEXT_PUBLIC_APP_PORT_BACK: string
  }
}
