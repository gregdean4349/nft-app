import React from 'react'
import { useAddress, useDisconnect, useMetamask } from '@thirdweb-dev/react'
import { GetServerSideProps } from 'next'
import { sanityClient, urlFor } from '../../sanity'
import { Collection } from '../../typings'
import Link from 'next/link'

interface Props {
  collection: Collection
}

function NFTDropPage({ collection }: Props) {
  // Auth for Metamask
  const address = useAddress()
  const connectWithMetamask = useMetamask()
  const disconnect = useDisconnect()

  return (
    <div className="flex flex-col h-full lg:grid lg:grid-cols-10">
      <div className=" bg-gradient-to-br from-gray-800 to-cyan-700/70 lg:col-span-4">
        <div className="flex flex-col items-center justify-center py-4 lg:min-h-screen">
          <div className="p-1 rounded-xl bg-gradient-to-br from-yellow-300 to-gray-700 lg:p-2">
            <img
              src={urlFor(collection.previewImage).url()}
              className="object-cover w-44 rounded-xl lg:h-96 lg:w-72"
              alt="nftPicture"
            />
          </div>

          <div className="p-5 space-y-2 text-center">
            <h1 className="text-4xl font-bold text-white">
              {collection.nftCollectionName}
            </h1>
            <h2 className="text-xl text-gray-300">{collection.description}</h2>
          </div>
        </div>
      </div>

      <div className="flex flex-col flex-1 p-12 lg:col-span-6">
        {/* Header */}
        <header className="flex items-center justify-between p-2 rounded-lg bg-gradient-to-b from-white to-slate-200">
          <Link href={'/'}>
            <h1 className="text-xl cursor-pointer w-52 font-extralight text-shadow-md sm:w-80">
              The{' '}
              <span className="font-extrabold underline text-cyan-700/70 decoration-cyan-800/60 underline-offset-2">
                NFT APES
              </span>{' '}
              Marketplace
            </h1>
          </Link>

          <button
            onClick={() => (address ? disconnect() : connectWithMetamask())}
            className="px-4 py-2 text-xs font-bold text-white rounded-xl bg-cyan-700/70 hover:shadow-lg lg:px-5 lg:py-3 lg:text-base"
          >
            {address ? 'Sign Out' : 'Sign In'}
          </button>
        </header>
        <hr className="my-2 border" />
        {address && (
          <p className="text-center text-rose-500/80">
            You're logged in with wallet{' '}
            <span className="font-bold tracking-wide text-rose-500/60">
              {address.substring(0, 5)}...
              {address.length - 5}
            </span>
          </p>
        )}

        {/* Content */}
        <div className="flex flex-col items-center flex-1 mt-10 space-y-2 text-center lg:justify-center lg:space-y-0">
          <img
            src={urlFor(collection.mainImage).url()}
            className="object-cover pb-10 w-80 lg:h-40"
            alt=""
          />
          <h1 className="text-3xl font-bold text-shadow-md lg:text-5xl lg:font-extrabold">
            {collection.title}
          </h1>
          <p className="pt-2 text-xl font-semibold text-green-500 lg:pt-8">
            13 / 21 NFT's claimed
          </p>
        </div>

        {/* Button */}
        <button className="w-full h-16 mt-8 text-xl font-bold text-white rounded-xl bg-gradient-to-br from-gray-700 to-cyan-700/70 hover:shadow-lg">
          Mint NFT (0.01 ETH)
        </button>
      </div>
    </div>
  )
}

export default NFTDropPage

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const query = `*[_type == "collection" && slug.current == $id][0] {
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

  const collection = await sanityClient.fetch(query, { id: params?.id })

  if (!collection) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      collection,
    },
  }
}