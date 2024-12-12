import prisma from "../lib/prisma.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const addPost = async (req, res) => {
  const body = req.body;
  const tokenUserId = req.userId;
  try {
    const newPost = await prisma.post.create({
      data: {
        ...body.postData,
        userId: tokenUserId,
        postDetail: {
          create: body.postDetail,
        },
      },
    });
    res.status(200).json(newPost);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "failed to load posts...",
    });
  }
};
export const getPosts = async (req, res) => {
  const { location, minPrice, maxPrice, type, bedroom, property } = req.query;
  //console.log({ location, minPrice, maxPrice, type })
  try {
    const posts = await prisma.post.findMany({
      where: {
        city: location || undefined,
        type: type && type !== "" ? type : undefined,
        property: property || undefined,
        bedroom: parseInt(bedroom) || undefined,
        price: {
          gte: parseInt(minPrice) || 0,
          lte: parseInt(maxPrice) || 10000000,
        },
      },
    });
    console.log(posts);
    //setTimeout(() =>{
    res.status(200).json(posts);
    //}, 3000)
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "failed to load posts...",
    });
  }
};
export const getPost = async (req, res) => {
  const id = req.params.id;
  try {
    const post = await prisma.post.findUnique({
      where: {
        id,
      },
      include: {
        postDetail: true,
        user: {
          select: {
            username: true,
            avatar: true,
          },
        },
      },
    });

    const token = req.cookies.token;
    if (token) {
      jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
        if (!err) {
          const saved = await prisma.savedPost.findUnique({
            where: {
              userId_postId: {
                postId: id,
                userId: payload.id,
              },
            },
          });
          res.status(200).json({ ...post, isSaved: saved ? true : false });
        }
      });
    }
  } catch (error) {
    console.log(error);
    res.status(200).json({ ...post, isSaved: false });
  }
};

export const updatePost = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId;
  const { password, avatar, ...inputs } = req.body;
  if (id !== tokenUserId) {
    return res.status(403).json({
      messge: "Not Authorized....",
    });
  }
  const updatePassword = null;
  try {
    if (password) updatePassword = await bcrypt.hashSync(password, 10);
    const updateUser = await prisma.user.update({
      where: { id },
      data: {
        ...inputs,
        ...(updatePassword && { password: updatePassword }),
        ...(avatar && { avatar }),
      },
    });
    const { password: userPassword, ...rest } = updateUser;
    res.status(200).json(rest);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "failed to load users...",
    });
  }
};
export const deletePost = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId;
  const post = await prisma.post.findUnique({
    where: {
      id,
    },
  });
  console.log("post", post);
  console.log("from token", tokenUserId);
  console.log("from post", post.userId);
  if (post.userId != tokenUserId) {
    return res.status(403).json({
      messge: "Not Authorized....",
    });
  }
  try {
    await prisma.post.delete({
      where: { id },
    });
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "failed to load post...",
    });
  }
};
