"use client";
import { useRouter } from 'next/navigation';
import styles from './ProfilePosts.module.css'
import { followAuthor, unfollowAuthor } from '../actions/actions';

export default function FollowButton({isFollowedByUser, username}: {isFollowedByUser: boolean,username:string}){
    const router = useRouter()
    return <button onClick={async () => {
        if(!isFollowedByUser){
            await followAuthor(username);
        }else{
            await unfollowAuthor(username);
        }
        router.refresh();
    }
    } className={styles.followButton}>{isFollowedByUser ? "Following author" : "Follow author"}</button>
}