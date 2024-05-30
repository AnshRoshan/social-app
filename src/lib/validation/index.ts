import * as z from 'zod'

const MIN_NAME_LENGTH = 2
const MIN_PASSWORD_LENGTH = 8
const MIN_CAPTION_LENGTH = 5
const MAX_CAPTION_LENGTH = 2200
const MIN_LOCATION_LENGTH = 1
const MAX_LOCATION_LENGTH = 1000

const NAME_VALIDATION_MESSAGE = `Name must be at least ${MIN_NAME_LENGTH} characters.`
const USERNAME_VALIDATION_MESSAGE = `Username must be at least ${MIN_NAME_LENGTH} characters and lowercase.`
const PASSWORD_VALIDATION_MESSAGE = `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`
const CAPTION_VALIDATION_MESSAGE = `Caption must be between ${MIN_CAPTION_LENGTH} and ${MAX_CAPTION_LENGTH} characters.`
const LOCATION_VALIDATION_MESSAGE = `Location must be between ${MIN_LOCATION_LENGTH} and ${MAX_LOCATION_LENGTH} characters.`

//
// USER
//
export const SignupValidation = z.object({
  name: z.string().min(MIN_NAME_LENGTH, { message: NAME_VALIDATION_MESSAGE }),
  username: z
    .string()
    .min(MIN_NAME_LENGTH)
    .refine((value) => value === value.toLowerCase(), { message: USERNAME_VALIDATION_MESSAGE }),
  email: z.string().email(),
  password: z.string().min(MIN_PASSWORD_LENGTH, { message: PASSWORD_VALIDATION_MESSAGE }),
})

export const SigninValidation = z.object({
  email: z.string().email(),
  password: z.string().min(MIN_PASSWORD_LENGTH, { message: PASSWORD_VALIDATION_MESSAGE }),
})

export const ProfileValidation = z.object({
  file: z.custom<File[]>(),
  name: z.string().min(MIN_NAME_LENGTH, { message: NAME_VALIDATION_MESSAGE }),
  username: z
    .string()
    .min(MIN_NAME_LENGTH)
    .refine((value) => value === value.toLowerCase(), { message: USERNAME_VALIDATION_MESSAGE }),
  email: z.string().email(),
  bio: z.string(),
})

//
// POST
//
export const PostValidation = z.object({
  caption: z
    .string()
    .min(MIN_CAPTION_LENGTH)
    .max(MAX_CAPTION_LENGTH, { message: CAPTION_VALIDATION_MESSAGE }),
  file: z.custom<File[]>(),
  location: z
    .string()
    .min(MIN_LOCATION_LENGTH)
    .max(MAX_LOCATION_LENGTH, { message: LOCATION_VALIDATION_MESSAGE }),
  tags: z.string(),
})
