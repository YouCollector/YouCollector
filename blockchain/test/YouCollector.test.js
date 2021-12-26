const { expect } = require('chai')
const { ethers } = require('hardhat')

const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ01234567890-_'

function createVideoId() {
  let id = ''

  for (let i = 0; i < 11; i++) id += alphabet[Math.floor(Math.random() * alphabet.length)]

  return id
}

describe('YouCollector', () => {

  let youCollectorLibrary
  let youCollector
  let ownerAddress
  let videoIdMintingPrice = 0
  let marketplaceItemsPagination

  const nVideoIds = 64
  const videoIds = []
  const reversedVideoIds = []

  for (let i = 0; i < nVideoIds; i++) {
    const videoId = createVideoId()

    videoIds.push(videoId)
    reversedVideoIds.unshift(videoId)
  }

  const inTwoDays = Math.floor((Date.now() + 2 * 24 * 60 * 60 * 1000) / 1000) // seconds

  const SORT_CREATED_ASC = 0
  const SORT_CREATED_DESC = 1
  const SORT_PRICE_ASC = 2
  const SORT_PRICE_DESC = 3

  before(async () => {
    console.log('Deploying contracts...')

    const YouCollectorLibrary = await ethers.getContractFactory('YouCollectorLibrary')

    youCollectorLibrary = await YouCollectorLibrary.deploy()

    await youCollectorLibrary.deployed()

    const YouCollector = await ethers.getContractFactory('YouCollector', {
      libraries: {
        YouCollectorLibrary: youCollectorLibrary.address,
      },
    })

    youCollector = await YouCollector.deploy()

    await youCollector.deployed()

    console.log('YouCollector deployed')
  })

  before(async () => {
    marketplaceItemsPagination = (await youCollectorLibrary.MARKETPLACE_ITEMS_PAGINATION()).toNumber()
    videoIdMintingPrice = await youCollector.videoIdMintingPrice()
  })

  before(async () => {
    [{ address: ownerAddress }] = await ethers.getSigners()
  })

  it('Should mint a videoId', async () => {
    await Promise.all(videoIds.map(videoId => youCollector.mintVideoId(videoId, { value: videoIdMintingPrice })))

    const owners = await Promise.all(videoIds.map(videoId => youCollector.videoIdToOwner(videoId)))

    expect(owners).to.deep.equal(Array(videoIds.length).fill(ownerAddress))
  })

  it('Should retrieve videoIds', async () => {
    const videoIds = await youCollector.getUserInfo(ownerAddress)

    expect(videoIds).to.deep.equal(videoIds)
  })

  it('Should mint a marketplace item', async () => {
    await Promise.all(videoIds.map(videoId => youCollector.mintMarketplaceItem(videoId, 2, 1, inTwoDays)))

    const marketplaceItems = await Promise.all(videoIds.map(videoId => youCollector.videoIdToMarketplaceItem(videoId)))

    expect(marketplaceItems.map(mi => mi.videoId)).to.deep.equal(videoIds)
  })

  it('Should return a list of marketplace items', async () => {
    let skip = 0
    let marketplaceItems = await youCollector.getMarketplaceItems(skip, SORT_CREATED_ASC)

    expect(marketplaceItems.map(x => x.videoId)).to.deep.equal(videoIds.filter((_x, i) => i >= skip && i < marketplaceItemsPagination + skip))

    skip = 3
    marketplaceItems = await youCollector.getMarketplaceItems(skip, SORT_CREATED_ASC)

    expect(marketplaceItems.map(x => x.videoId)).to.deep.equal(videoIds.filter((_x, i) => i >= skip && i < marketplaceItemsPagination + skip))

    skip = 0
    marketplaceItems = await youCollector.getMarketplaceItems(skip, SORT_CREATED_DESC)

    expect(marketplaceItems.map(x => x.videoId)).to.deep.equal(reversedVideoIds.filter((_x, i) => i >= skip && i < marketplaceItemsPagination + skip))

    skip = 6
    marketplaceItems = await youCollector.getMarketplaceItems(skip, SORT_CREATED_DESC)

    expect(marketplaceItems.map(x => x.videoId)).to.deep.equal(reversedVideoIds.filter((_x, i) => i >= skip && i < marketplaceItemsPagination + skip))
  })

})
