'use server'
import { auth, signIn } from "@/auth";
import axios from "axios";
import bcrypt from "bcrypt";
import { redirect } from "next/navigation";
import { API_URL, Post } from "../lib/posts";
import { verifyCsrfToken } from "../csrf";
import { z } from 'zod';
import { AuthError } from "next-auth";

const processingUsername: Record<string, boolean> = {};

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
        username: String(formData.get('username')),
        password: String(formData.get('password')),
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
    category: z.enum(["All", "General", "Essay", "Ideas", "Guides", "Reviews", "Personal", "Travel", "Fitness", "Food"]),
});

export async function publishPost(formData: FormData) {
    const user:any = (await auth())?.user;

    if(!user) {
      throw new Error('User not authenticated');
    }

    const csrfToken = String(formData.get("csrfToken"));
    if(!csrfToken) {
      throw new Error('CSRF token missing');
    }

    if(!verifyCsrfToken(csrfToken)) {
      throw new Error('Invalid CSRF token');
    }

    const postData = PostSchema.parse({
        title: String(formData.get("title")),
        excerpt: String(formData.get("excerpt")),
        content: String(formData.get("content")),
        category: String(formData.get("category")),
    });

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
    };

    try {
      const postResponse = (await axios.post(`${API_URL}/posts`, post)).data;
      redirect(`/posts/${postResponse.id}`); 
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

        try {
        const postId = z.string().trim().parse(String(formData.get("id")));
        const post = await axios.get(`${API_URL}/posts/${postId}`).then(res => res.data);
         if(!post){
          throw new Error('No post with id');
        }

        if(user.username !== post.createdBy) {
            console.error(`User ${user.username} is not authorized to edit post created by ${post.createdBy})`);
            throw new Error('User not authorized to edit this post');
        }

         const postData = PostSchema.parse({
            title: String(formData.get("title")),
            excerpt: String(formData.get("excerpt")),
            content: String(formData.get("content")),
            category: String(formData.get("category")),
        });

      const updatedPost = {
        ...post,
        title: postData.title,
        excerpt: postData.excerpt,
        content: postData.content,
        category: postData.category,
        readTime: `${Math.max(1, Math.ceil(postData.content.split(/\s+/).length / 180))} min read`,
        updatedAt: new Date().toISOString(),
      };
      await axios.put(`${API_URL}/posts/${post.id}`, updatedPost);
      redirect(`/posts/${post.id}`);
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

    try {
      const postId = z.string().trim().parse(id);
      const post = await axios.get(`${API_URL}/posts/${postId}`).then(res => res.data);
      if(!post) {
          throw new Error('Post not found');
      }
      if(user.username !== post.createdBy) {
          console.error(`User ${user.username} is not authorized to edit post created by ${post.createdBy})`);
          throw new Error('User not authorized to edit this post');
      }

      await fetch(`${API_URL}/posts/${post.id}`, { method: "DELETE" }); 
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
        username: String(formData.get("username")),
        name: String(formData.get("name")),
        password: String(formData.get("password")),
    });

    if(username in processingUsername){
      throw new Error('Username in process. Please try again later');
    }

    try {
      const users = (await axios.get(`${process.env.API_URL}/users`, {
          params: { username },
        })).data;

        if(users.length > 1){
          throw new Error('Username already in use');
        }

        processingUsername[username] = true;

        const hashedPassword = await bcrypt.hash(password, 10);

        await axios.post(`http://localhost:4000/users`, {
          username,
          name,
          password: hashedPassword,
        });

    } catch (error) {
      console.log(error);
      delete processingUsername[username];
      throw error;
    } finally {
      delete processingUsername[username];
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
            name: String(formData.get("name"))
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
          password: String(formData.get("password")),
          newpassword: String(formData.get("newpassword")),
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