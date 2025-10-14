import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // 1. Seed Admin
  const email = process.env.ADMIN_EMAIL || 'admin@example.com'
  const name = process.env.ADMIN_NAME || 'Admin'
  const rawPassword = process.env.ADMIN_PASSWORD || 'Admin123!'
  const password = await bcrypt.hash(rawPassword, 10)

  const admin = await prisma.admin.upsert({
    where: { email },
    update: { name },
    create: { email, name, password },
  })
  console.log(`✓ Seeded admin: ${admin.email}`)

  // 2. Seed Site Settings
  const siteSettings = await prisma.siteSettings.upsert({
    where: { id: '00000000-0000-0000-0000-000000000001' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000001',
      logoUrl: '/logo.png',
      siteName: 'Travel Indonesia',
      metaTitle: 'Travel Indonesia - Jelajahi Dunia Bersama Kami',
      metaDescription: 'Temukan penawaran terbaik untuk penerbangan, hotel, dan paket liburan',
      heroTitle: 'JELAJAHI DUNIA BERSAMA KAMI',
      heroSubtitle: 'Temukan penawaran terbaik untuk penerbangan, hotel, dan paket liburan',
      heroImageUrl: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=70&w=1920&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      flightHeroTitle: 'Make your travel wishlist, we\'ll do the rest',
      flightHeroSubtitle: 'Special offers to suit your plan',
      flightHeroImageUrl: 'https://images.unsplash.com/photo-1542296332-2e4473faf563?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
  })
  console.log(`✓ Seeded site settings`)

  // 3. Seed Bank Accounts
  const bankAccounts = [
    { bankName: 'BCA', accountNumber: '1234567890', accountName: 'Travel Indonesia', displayOrder: 1 },
    { bankName: 'Mandiri', accountNumber: '0987654321', accountName: 'Travel Indonesia', displayOrder: 2 },
    { bankName: 'BNI', accountNumber: '5555666677', accountName: 'Travel Indonesia', displayOrder: 3 },
  ]

  // Delete existing bank accounts first
  await prisma.bankAccount.deleteMany({})
  
  for (const bank of bankAccounts) {
    await prisma.bankAccount.create({
      data: bank,
    })
  }
  console.log(`✓ Seeded ${bankAccounts.length} bank accounts`)

  // 4. Seed Customer Reviews
  const existingReviews = await prisma.customerReview.count()
  if (existingReviews === 0) {
    const reviews = [
      {
        customerName: 'Mojahid',
        rating: 5,
        comment: 'Using this travel agency\'s website has been a seamless experience. The platform is user-friendly and professional, making it easy to search and book flights and hotels. Customer support is responsive and helpful, pricing is fair and transparent with no hidden fees, and bookings are accurate and reliable. Communication via emails and notifications is clear and timely. Overall, it provides a trustworthy, smooth, and stress-free travel booking experience.',
        location: 'Jakarta',
        isActive: true,
      },
      {
        customerName: 'Jane Doe',
        rating: 5,
        comment: 'An absolutely fantastic service. The website is incredibly intuitive, and I found some of the best travel deals I\'ve ever seen. The entire process, from searching for destinations to final booking, was smooth and hassle-free. The customer support team was also very quick to respond to my queries. I\'ll definitely be using this agency for all my future travels.',
        location: 'Bali',
        isActive: true,
      },
      {
        customerName: 'Ahmad Rizki',
        rating: 5,
        comment: 'Pelayanan yang sangat memuaskan! Proses booking sangat mudah dan cepat. Customer service sangat responsif dalam menjawab pertanyaan. Harga juga sangat kompetitif. Sangat recommended!',
        location: 'Bandung',
        isActive: true,
      },
    ]

    for (const review of reviews) {
      await prisma.customerReview.create({
        data: review,
      })
    }
    console.log(`✓ Seeded ${reviews.length} customer reviews`)
  } else {
    console.log(`✓ Customer reviews already exist (${existingReviews} reviews)`)
  }

  // 5. Seed Popular Destinations (commented out - model not defined in schema)
  // const existingDestinations = await prisma.popularDestination.count()
  // if (existingDestinations === 0) {
  //   const destinations = [
  //     {
  //       city: 'São Paulo',
  //       country: 'Brazil',
  //       airportCode: 'GRU',
  //       imageUrl: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?q=80&w=1470',
  //       description: 'Kota metropolitan terbesar di Amerika Selatan',
  //       isActive: true,
  //       order: 1,
  //     },
  //     {
  //       city: 'Delhi',
  //       country: 'India',
  //       airportCode: 'DEL',
  //       imageUrl: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=1470',
  //       description: 'Ibukota India yang kaya akan sejarah',
  //       isActive: true,
  //       order: 2,
  //     },
  //     {
  //       city: 'Jakarta',
  //       country: 'Indonesia',
  //       airportCode: 'CGK',
  //       imageUrl: 'https://images.unsplash.com/photo-1555321355-2d80e5c9e069?q=80&w=1470',
  //       description: 'Ibukota Indonesia yang modern dan dinamis',
  //       isActive: true,
  //       order: 3,
  //     },
  //     {
  //       city: 'Tokyo',
  //       country: 'Japan',
  //       airportCode: 'HND',
  //       imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=1494',
  //       description: 'Kota futuristik dengan budaya tradisional',
  //       isActive: true,
  //       order: 4,
  //     },
  //   ]

  //   for (const dest of destinations) {
  //     await prisma.popularDestination.create({
  //       data: dest,
  //     })
  //   }
  //   console.log(`✓ Seeded ${destinations.length} popular destinations`)
  // } else {
  //   console.log(`✓ Popular destinations already exist (${existingDestinations} destinations)`)
  // }

  // 6. Mark some packages as popular (commented out - model not defined in schema)
  // const existingPopular = await prisma.popularPackage.count()
  // if (existingPopular === 0) {
  //   const packages = await prisma.package.findMany({ take: 3 })
  //   if (packages.length > 0) {
  //     for (let i = 0; i < packages.length; i++) {
  //       await prisma.popularPackage.create({
  //         data: {
  //           packageId: packages[i].id,
  //           order: i + 1,
  //         },
  //       })
  //     }
  //     console.log(`✓ Marked ${packages.length} packages as popular`)
  //   }
  // } else {
  //   console.log(`✓ Popular packages already exist (${existingPopular} popular packages)`)
  // }

  console.log('🎉 Seeding completed successfully!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Seeding failed:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
