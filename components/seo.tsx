import React from 'react'
import Head from 'next/head'
import metaSettings from '../lib/utils/meta'

interface SocialTagsProps {
  openGraphType: string
  schemaType?: string
  url: string
  title: string
  description: string
  image: string
  createdAt?: string
  updatedAt?: string
}

const socialTagsTwitter = ({
  openGraphType,
  url,
  title,
  description,
  image,
  createdAt,
  updatedAt
}: SocialTagsProps) => {
  return [
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: image },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:site', content: '@tessera' },
    { name: 'twitter:creator', content: '@tessera' }
  ]
}

const socialTagsFacebook = ({
  openGraphType,
  url,
  title,
  description,
  image,
  createdAt,
  updatedAt
}: SocialTagsProps) => {
  return [
    { name: 'og:title', content: title },
    { name: 'og:description', content: description },
    { name: 'og:image', content: image },
    // { name: 'og:url', content: url },
    { name: 'og:url', content: title }, // wtf?
    { name: 'og:type', content: 'website' },
    { name: 'og:site_name', content: 'Nounlets' }
    // {
    //   name: 'og:published_time',
    //   content: createdAt || new Date().toISOString()
    // },
    // {
    //   name: 'og:modified_time',
    //   content: updatedAt || new Date().toISOString()
    // }
  ]
}

// const defaults = {
//   title: `test`,
//   description: `test`,
//   image: `https://d0c0-93-103-177-250.eu.ngrok.io/img/noun.jpg`,
//   url: `https://d0c0-93-103-177-250.eu.ngrok.io/`
// }

const SEO = (props: SocialTagsProps) => {
  const { title, description, image } = props
  //   const props2 = {}
  return (
    <Head>
      {/* <title>{title + ' | Nounlets'}</title> */}
      {/* <title>{props2.title || defaults.title}</title>
      <meta name="description" content={props2.description || defaults.description} /> */}

      {/* <meta itemProp="test1" content={props.image || defaults.title} />
      <meta itemProp="test2" content={defaults.title} /> */}

      {/*<!-- Google / Search Engine Tags -->*/}
      {/* <meta itemProp="name" content={props2.title || defaults.title} />
      <meta itemProp="description" content={props2.description || defaults.description} />
      <meta itemProp="image" content={props2.image || defaults.image} />
      <meta itemProp="image2" content={props.image || defaults.image} /> */}

      {/*<!-- Facebook Meta Tags -->*/}
      {/* <meta property="og:title" content={props2.title || defaults.title} />
      <meta property="og:description" content={props2.description || defaults.description} />
      <meta property="og:image" content={props2.image || defaults.image} />
      <meta property="og:url" content={props2.title || defaults.title} />
      <meta property="og:type" content="website" /> */}

      {/*<!-- Twitter Meta Tags -->*/}
      {/* <meta name="twitter:title" content={props2.title || defaults.title} />
      <meta name="twitter:description" content={props2.description || defaults.description} />
      <meta name="twitter:image" content={props2.image || defaults.image} />
      <meta name="twitter:card" content="summary_large_image" /> */}

      <title>{title + ' | Nounlets'}</title>
      <meta name="description" content={description} />

      <meta itemProp="name" content={title} />
      <meta itemProp="description" content={description} />
      <meta itemProp="image" content={image} />

      {socialTagsFacebook(props).map(({ name, content }) => {
        return <meta key={name} property={name} content={content} />
      })}

      {socialTagsTwitter(props).map(({ name, content }) => {
        return <meta key={name} name={name} content={content} />
      })}

      {/* <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": schemaType,
                  name: title,
                  about: description,
                  url: url,
              }),
          }}
      /> */}
    </Head>
  )
}

SEO.defaultProps = {
  url: '/',
  openGraphType: 'website',
  type: 'website',
  title: 'Nounlets',
  description: 'Own a noun together with Nounlets',
  image: 'https://pbs.twimg.com/profile_images/1560444183948804096/-2oi18u7_400x400.jpg'
}

export default SEO
