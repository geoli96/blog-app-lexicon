'use server'
import { auth, signIn } from "@/auth";
import axios from "axios";
import bcrypt from "bcrypt";
import { redirect } from "next/navigation";
import { API_URL, Post } from "../lib/posts";
import { verifyCsrfToken } from "../csrf";
import { z } from 'zod';
import { AuthError } from "next-auth";
import { utapi } from "../uploadthing";
 
const CredentialsSchema = z.object({
  username: z.string(),
  password: z.string()
});

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    const credentials = CredentialsSchema.parse({
        username: formData.get('username'),
        password: formData.get('password'),
    });
    
    await signIn('credentials', {username: credentials.username, password: credentials.password, redirect: false});
    return "success";
  } catch (error) {
    console.error(error);
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
  }
}

const PostSchema = z.object({
    title: z.string().min(1).max(200).trim(),
    excerpt: z.string().min(1).max(500).trim(),
    content: z.string().min(1).trim(),
    category: z.enum(["All", "General", "Essay", "Ideas", "Guides", "Reviews", "Personal", "Travel", "Fitness", "Food"])
});

export async function publishPost(formData: FormData) {
    const user:any = (await auth())?.user;

    if(!user) {
      throw new Error('User not authenticated');
    }

    const csrfToken = formData.get("csrfToken") as string;
    if(!csrfToken) {
      throw new Error('CSRF token missing');
    }

    if(!verifyCsrfToken(csrfToken)) {
      throw new Error('Invalid CSRF token');
    }

    const postData = PostSchema.parse({
        title: formData.get("title"),
        excerpt: formData.get("excerpt"),
        content: formData.get("content"),
        category: formData.get("category")
    });

    const postImageFile = formData.get('image');
    if(!(postImageFile instanceof File && postImageFile)){
      throw new Error("Invalid image file");
    }
    const imageCaption = formData.get('imagecaption');
    if(!(typeof imageCaption === "string" && imageCaption)){
      throw new Error("Image caption");
    }

    const imageData = (await utapi.uploadFiles(postImageFile)).data;
    const imageUrl = imageData!.ufsUrl!;
    const imageKey = imageData!.key;

    const timestamp = new Date().toISOString();

    const post: Post = {
      id: crypto.randomUUID(),
      title: postData.title,
      excerpt: postData.excerpt,
      content: postData.content,
      category: postData.category,
      date: new Intl.DateTimeFormat("en-US", { month: "short", day: "2-digit", year: "numeric" }).format(new Date()),
      readTime: `${Math.max(1, Math.ceil(postData.content.split(/\s+/).length / 180))} min read`,
      createdBy: user.username,
      createdAt: timestamp,
      updatedAt: timestamp,
      imageUrl: imageUrl,
      imageKey: imageKey,
      imageCaption: imageCaption
    };

    try {
      const postResponse = (await axios.post(`${API_URL}/posts`, post)).data;
      return postResponse;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

 export async function updatePost(formData: FormData) {
      const user:any = (await auth())?.user;

        if(!user) {
            throw new Error('User not authenticated');
        }

        const postId = z.string().trim().parse(formData.get("id"));
        const post = await axios.get(`${API_URL}/posts/${postId}`).then(res => res.data);
         if(!post){
          throw new Error('No post with id');
        }
        if(user.username !== post.createdBy) {
            console.error(`User ${user.username} is not authorized to edit post created by ${post.createdBy})`);
            throw new Error('User not authorized to edit this post');
        }

        try {
         const postData = PostSchema.parse({
            title: formData.get("title"),
            excerpt: formData.get("excerpt"),
            content: formData.get("content"),
            category: formData.get("category"),
        });
        
        const postImageFile = formData.get('image');
        const imageCaption = formData.get('imagecaption');
        const updatedImage: {imageUrl?:string, imageKey?:string, imageCaption?: string} = {};

        if(typeof imageCaption === "string" && imageCaption){
          updatedImage["imageCaption"] = imageCaption;
        }

        if((postImageFile instanceof File && postImageFile.size)){
          await utapi.deleteFiles([post.imageKey]);
          const imageData = (await utapi.uploadFiles(postImageFile)).data;
          const imageUrl = imageData!.ufsUrl!;
          const imageKey = imageData!.key;
          updatedImage["imageUrl"] = imageUrl;
          updatedImage["imageKey"] = imageKey;
        }


      const updatedPost = {
        ...post,
        title: postData.title,
        excerpt: postData.excerpt,
        content: postData.content,
        category: postData.category,
        readTime: `${Math.max(1, Math.ceil(postData.content.split(/\s+/).length / 180))} min read`,
        imageUrl: updatedImage.imageUrl ?? post.imageUrl,
        imageKey: updatedImage.imageKey ?? post.imageKey,
        imageCaption: updatedImage.imageCaption ?? post.imageCaption,
        updatedAt: new Date().toISOString(),
      };
      await axios.put(`${API_URL}/posts/${post.id}`, updatedPost);
      } catch (error) {
          console.log("Could not update post", error); 
          throw error;
        }
    }

export async function deletePost(id: string) {
    const user:any = (await auth())?.user;

    if(!user) {
        throw new Error('User not authenticated');
    }

    const postId = z.string().trim().parse(id);
    try {
    const post = await axios.get(`${API_URL}/posts/${postId}`).then(res => res.data);
    if(!post) {
        throw new Error('Post not found');
    }
    if(user.username !== post.createdBy) {
        console.error(`User ${user.username} is not authorized to edit post created by ${post.createdBy})`);
        throw new Error('User not authorized to edit this post');
    }

      await axios.delete(`${API_URL}/posts/${post.id}`); 
    } catch (error) {
      console.log("Could not update post", error); 
      throw error;
    }
}

const UserSchema = z.object({
  username: z.string().min(2).max(100).trim(),
  name: z.string().min(2).max(100).trim(),
  password: z.string().min(6).max(100)
});
 
export async function createUser(formData: FormData) {
    const { username, password, name } = UserSchema.parse({
        username: formData.get("username"),
        name: formData.get("name"),
        password: formData.get("password"),
    });

    try {
         const hashedPassword = await bcrypt.hash(password, 10);

         // code below should be a transaction in real database
          const createdUser = (await axios.post(`http://localhost:4000/users`, {
            username,
            name,
            password: hashedPassword,
          })).data;

          const users = (await axios.get(`${process.env.API_URL}/users`, {
            params: { username },
          })).data;

          if(users.length > 1){
            await axios.delete(`http://localhost:4000/users/${createdUser.id}`);
            throw new Error('Username already in use');
          }
    } catch (error) {
      console.log(error);
      throw error;
    }

}

const UpdateUserSchema = z.object({
  name: z.string().min(2).max(100).trim()
});

export async function updateUser(formData: FormData) {
    const user:any = (await auth())?.user;
    if(!user) {
        throw new Error('User not authenticated');
    }

    try {
          const _user = (await axios.get(`${process.env.API_URL}/users`, {
              params: { username: user.username },
          })).data[0];

          const { name } = UpdateUserSchema.parse({
              name: formData.get("name")
          });

          await axios.put(`http://localhost:4000/users/${user.id}`, {..._user,
            name
          });


    } catch (error) {
      console.log("Could not update user", error);
      throw error;
    }
}

const UpdatePasswordSchema = z.object({
  password: z.string().min(6).max(100),
  newpassword: z.string().min(6).max(100)
});

export async function updatePassword(formData: FormData) {
    const user:any = (await auth())?.user;
    if(!user) {
        throw new Error('User not authenticated');
    }

    try {
      const _user = (await axios.get(`${process.env.API_URL}/users`, {
          params: { username: user.username },
      })).data[0]; 

      const { password, newpassword } = UpdatePasswordSchema.parse({
          password: formData.get("password"),
          newpassword: formData.get("newpassword"),
      });

      const passwordsMatch = await bcrypt.compare(password, _user.password);

      if(!passwordsMatch){
        throw new Error("Incorrect password");
      }

      const hashedPassword = await bcrypt.hash(newpassword, 10);

      await axios.put(`${process.env.API_URL}/users/${user.id}`,{..._user, password: hashedPassword}); 
    } catch (error) {
      console.log("Could not update password", error);
      throw error;
    }
}

export async function followAuthor(username:string) {
    const user:any = (await auth())?.user;
    if(!user) {
        throw new Error('User not authenticated');
    }
    const _username = z.string().parse(username);

    try {
          const users = (await axios.get(`${process.env.API_URL}/users`, {
            params: { username:_username },
          })).data;

          if(users.length === 0){
            throw new Error('No user found with username');
          }
          const followedUser = users[0];
          if(followedUser.id === user.id){
            throw new Error();
          }

          // code below should be a transaction in real database
          const follow = (await axios.post(`${process.env.API_URL}/follows`, {
            follow: followedUser.username,
            followedBy: user.username
          })).data;

          const follows = (await axios.get(`${process.env.API_URL}/follows`, {
            params: { follow: _username, followedBy: user.username },
          })).data;

          if(follows.length > 1){
            await axios.delete(`http://localhost:4000/follows/${follow.id}`);
            throw new Error('Already following');
          }

    } catch (error) {
      console.log(error);
      throw error;
    }
}

export async function unfollowAuthor(username:string) {
    const user:any = (await auth())?.user;
    if(!user) {
        throw new Error('User not authenticated');
    }
    const _username = z.string().parse(username);

    try {
          const users = (await axios.get(`${process.env.API_URL}/users`, {
            params: { username:_username },
          })).data;

          if(users.length === 0){
            throw new Error('No user found with username');
          }
          const unfollowedUser = users[0];

          const follow = (await axios.get(`${process.env.API_URL}/follows`, {
            params: {
              follow: unfollowedUser.username,
              followedBy: user.username
            }
          })).data[0];

          if(!follow){
            throw new Error("Not following");
          }
          
          await axios.delete(`http://localhost:4000/follows/${follow.id}`);

    } catch (error) {
      console.log(error);
      throw error;
    }
}