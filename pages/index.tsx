import type { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { sanityClient, urlFor } from '../sanity'
import { Collection } from '../typings'

interface Props {
  collections: Collection[]
}

const Home = ({ collections }: Props) => {
  return (
    <div className="flex flex-col min-h-screen px-10 py-20 mx-auto max-w-7xl lg:px-0">
      <Head>
        <title>NFT App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1 className="mb-10 text-4xl font-light text-shadow-md">
        The{' '}
        <span className="font-bold underline text-cyan-700/70 decoration-cyan-800/60 underline-offset-2">
          NFT APES
        </span>{' '}
        Marketplace
      </h1>
      <main className="p-8 shadow-xl rounded-xl bg-slate-100 shadow-rose-400/20">
        <div className="grid space-x-3 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {collections.map((collection) => (
            <Link key={collection._id} href={`/nft/${collection.slug.current}`}>
              <div className="flex flex-col items-center transition duration-200 cursor-pointer hover:scale-105">
                <img
                  className="object-cover h-96 w-60 rounded-2xl"
                  src={urlFor(collection.mainImage).url()}
                  alt=""
                />

                <div className="p-5 text-center">
                  <h2 className="text-3xl font-semibold">{collection.title}</h2>
                  <p className="mt-2 text-base text-[gray]">
                    {collection.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}

export default Home

export const getServerSideProps: GetServerSideProps = async () => {
  const query = `*[_type == "collection"] {
    _id,
    title,
    address,
    description,
    nftCollectionName,
    mainImage {
      asset
    },
    previewImage {
      asset
    },
    slug {
      current
    },
    creator-> {
      _id,
      name,
      address,
      slug {
        current
      },
    },
  }`

  const collections = await sanityClient.fetch(query)

  return {
    props: {
      collections,
    },
  }
}