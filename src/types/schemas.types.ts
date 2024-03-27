
import z from 'zod'
import { RatingType } from './posts.types'

export const PostSchema = z.object({
    title: z.string().min(6, { message: 'Title must be at least 6 characters long'}),
    message: z.string().min(6, { message: 'Message must be at least 6 characters long'}),
    imgUrl: z.string().optional(),
    exp_rating: z.number().min(0, "Rating cannot be negative").max(10, "Maximum rating is 10").nullable(),
    post_owner_name: z.string().min(3, { message: 'Name must be at least 3 characters long'}),
})
export const PostUpdateSchema = z.object({
    title: z.string().min(6, { message: 'Title must be at least 6 characters long'}).optional(),
    message: z.string().min(6, { message: 'Message must be at least 6 characters long'}).optional(),
    imgUrl: z.string().optional(),
    exp_rating: z.number().min(0, "Rating cannot be negative").max(10, "Maximum rating is 10").nullable(),
    post_owner_name: z.string().min(3, { message: 'Name must be at least 3 characters long'}).optional(),
})

export const UserRegistrationSchema = z.object({
    name: z.string().min(3, { message: 'Name must be at least 3 characters long'}),
    email: z.string().email({ message: 'Invalid email'}),
    imgUrl: z.string().optional(),
    age: z.number()
    .min(13, { message: 'You must be at least 13 years old to register'})
    .max(120, { message: 'You must be at most 120 years old to register'}),
    password: z.string().min(6, { message: 'Password must be at least 6 characters long'}),
})
export const UserUpdateSchema = z.object({
    name: z.string().min(3, { message: 'Name must be at least 3 characters long'}).optional(),
    email: z.string().email({ message: 'Invalid email'}).optional(),
    imgUrl: z.string().optional(),
    age: z.number()
    .min(13, { message: 'You must be at least 13 years old to register'})
    .max(120, { message: 'You must be at most 120 years old to register'})
    .optional(),
})
export const UserLoginSchema = z.object({
    email: z.string().email({ message: 'Invalid email'}),
    password: z.string().min(6, { message: 'Password must be at least 6 characters long'}),
})


// FORMS

export type IPostForm = z.infer<typeof PostSchema>
export interface IPostRatingForm {
    rating?: string
    rating_type: RatingType
}

export interface ICommentForm {
    comment_owner_name:string
    message:string
}
export type IUserRegistrationForm = z.infer<typeof UserRegistrationSchema>
export type IUserAuthForm = Pick<IUserRegistrationForm, 'email' | 'password'>
export type IUserDataForm = Omit<IUserRegistrationForm, 'password' | 'email'>
export type IUserLoginForm = z.infer<typeof UserLoginSchema>
