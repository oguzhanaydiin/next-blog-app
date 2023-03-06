import FeaturedPosts from "@/components/home-page/featured-posts"
import Hero from "@/components/home-page/hero"
import { getFeaturedPosts } from "@/lib/posts-util"
import Head from "next/head"

type HomePageProps = {
  posts: any
}

export default function HomePage(props: HomePageProps) {
  return (
    <>
      <Head>
        <title>{`Oğuzhan's Blog`}</title>
        <meta
          name="description"
          content={`I post about programming and web development.`}
        />
      </Head>
      <Hero />
      <FeaturedPosts posts={props.posts} />
    </>
  )
}

export function getStaticProps() {
  const featuredPosts = getFeaturedPosts()

  return {
    props: {
      posts: featuredPosts,
    },
    revalidate: 1800,
  }
}
// we use getStaticProps() to fetch data at build time
// because the data on this page will not change frequently
// and we want to optimize the performance of our app
