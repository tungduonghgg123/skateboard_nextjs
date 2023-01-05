import fetchTweetAst from '../lib/fetchTweetAst'
import TweetPage from '../components/tweet-page'
import styles from '../components/twitter-layout/twitter.module.css'
import { fetchPartnerColor } from '../lib/twitter/api'
import { useRouter } from 'next/router'

// Regex to test a valid username, you should also test for a max length of 15, but we're not using
// the user to get the tweet
// const USERNAME = /^[a-zA-Z0-9_]+$/;
const TWEET_ID = /^[a-z]+$/

export async function getStaticPaths() {
  return { paths: [], fallback: true }
}

export async function getStaticProps({ params }) {
  const { tweet } = params

  if (tweet.length > 40 || !TWEET_ID.test(tweet)) {
    return { notFound: true }
  }

  try {
    //TODO: fetch color from back-end
    const color = (await fetchPartnerColor(tweet))[0].color
    console.log('LOG', color)
    return color ? { props: { color }, revalidate: 60 } : { notFound: true, revalidate: 60 }
  } catch (error) {
    // The Twitter API most likely died
    console.error(error)
    return { notFound: true, revalidate: 60 }
  }
}

export default function Page({ date, color }) {
  const { isFallback } = useRouter()

  // TODO: create a PartnerPage and pass the color to it
  return <h1 style={{
    background: color,
    height: '100%'
  }}>{isFallback ? 'Loading...': 'EKKO'}</h1>
}
