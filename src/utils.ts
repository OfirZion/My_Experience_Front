import { IResponse } from "./types/http.types"
import { IPostFull, IPostWithRatings } from "./types/posts.types"
import { IPostRatingForm } from "./types/schemas.types"

// user clicks the like button
// user clicks the dislike button
type RatingIndex = number

export function findPostRating(post: IPostWithRatings, currentUserId: string): RatingIndex {
    const existingRatingIndex = post.ratings.findIndex(rating =>
        (typeof rating.user === 'string' && rating.user === currentUserId) || 
        (typeof rating.user === 'object' && rating.user._id === currentUserId))
    return existingRatingIndex
}

export function updatePostRating(
     post: IPostFull,
     existingRatingIndex: RatingIndex, 
     rating: IPostRatingForm) {
     // if the user clicks the same rating type again, remove the rating
     if(post.ratings[existingRatingIndex].rating_type === rating.rating_type) {
        post.ratings.splice(existingRatingIndex, 1)
        post.isLikedByCurrentUser = false
        post.isDislikedByCurrentUser = false
    } else { // change the rating type
        post!.ratings[existingRatingIndex].rating_type = rating.rating_type
        post.isLikedByCurrentUser = rating.rating_type === 1
        post.isDislikedByCurrentUser = rating.rating_type === -1
    }
}

export function normalizeDate<T extends IPostWithRatings>(post: T) {
    post.created_at = new Date(post.created_at)
    return post
}

export function normalizePosts<T extends IPostWithRatings>(posts: T[], currentUserId:string | null | undefined) : T[] {
    for(const post of posts) {
        normalizeDate(post)
        if(!currentUserId) { 
            post.isDislikedByCurrentUser = false
            post.isLikedByCurrentUser = false
            continue
        }
        const ratingIndex = findPostRating(post, currentUserId)
        if(ratingIndex !== -1) {
            post.isLikedByCurrentUser = post.ratings[ratingIndex].rating_type === 1
            post.isDislikedByCurrentUser = post.ratings[ratingIndex].rating_type === -1
        } else {
            post.isDislikedByCurrentUser = false
            post.isLikedByCurrentUser = false
        }
    }
    return posts
}


export function toBeautifiedDate(date: Date): string {
    return date.toDateString()
}

export function waitFor(timeInMillis: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, timeInMillis)
  })
}


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function withHandleError<T, U extends any[]>(fn: (...args: U) => Promise<IResponse<T>>) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return async (...args: U) => {
            try {
                return await fn(...args)
            } catch (error: unknown) {
                const err =  (error as {response:{data:IResponse<T> }}).response?.data
                throw err
            }
        }
}
    