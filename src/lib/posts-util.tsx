import fs from "fs"
import matter from "gray-matter"
import path from "path"

const POSTS_DIRECTORY = path.join(process.cwd(), "posts")

export function getPostData(postIdentifier: string) {
  const postSlug = postIdentifier.replace(/\.md$/, "") // this removes the file extension
  const filePath = path.join(POSTS_DIRECTORY, `${postSlug}.md`)
  const fileContent = fs.readFileSync(filePath, "utf-8")
  const { data, content } = matter(fileContent)

  const postData = {
    slug: postSlug,
    ...data,
    content,
  }

  return postData
}

export function getPostsFiles() {
  return fs.readdirSync(POSTS_DIRECTORY)
}

export function getAllPosts() {
  const postFiles = getPostsFiles()

  const allPosts = postFiles.map((fileName) => getPostData(fileName))

  const sortedPosts = allPosts.sort((postA: any, postB: any) =>
    postA.date > postB.date ? -1 : 1
  )
  return sortedPosts
}

export function getFeaturedPosts() {
  const allPosts = getAllPosts()
  const featuredPosts = allPosts.filter((post: any) => post.isFeatured)
  return featuredPosts
}
