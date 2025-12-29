import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create default roles
  const adminRole = await prisma.role.upsert({
    where: { name: 'admin' },
    update: {},
    create: {
      name: 'admin',
      description: 'Full system access',
      permissions: 'content:view,content:edit,content:delete,content:publish,users:manage,settings:manage,analytics:view,media:manage,categories:manage,comments:moderate,system:admin',
    },
  })

  const editorRole = await prisma.role.upsert({
    where: { name: 'editor' },
    update: {},
    create: {
      name: 'editor',
      description: 'Content management access',
      permissions: 'content:view,content:edit,content:publish,media:manage,categories:manage,comments:moderate,analytics:view',
    },
  })

  const authorRole = await prisma.role.upsert({
    where: { name: 'author' },
    update: {},
    create: {
      name: 'author',
      description: 'Content creation access',
      permissions: 'content:view,content:edit,content:create,media:upload',
    },
  })

  const viewerRole = await prisma.role.upsert({
    where: { name: 'viewer' },
    update: {},
    create: {
      name: 'viewer',
      description: 'Read-only access',
      permissions: 'content:view,analytics:view',
    },
  })

  console.log('✅ Roles created:', { adminRole, editorRole, authorRole, viewerRole })

  // Create default admin user
  const hashedPassword = await bcrypt.hash('admin123', 12)
  
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@5cms.com' },
    update: {},
    create: {
      email: 'admin@5cms.com',
      name: 'System Administrator',
      password: hashedPassword,
      roleId: adminRole.id,
      isActive: true,
    },
  })

  // Create demo editor user
  const editorPassword = await bcrypt.hash('editor123', 12)
  
  const editorUser = await prisma.user.upsert({
    where: { email: 'editor@5cms.com' },
    update: {},
    create: {
      email: 'editor@5cms.com',
      name: 'Content Editor',
      password: editorPassword,
      roleId: editorRole.id,
      isActive: true,
    },
  })

  // Create demo author user
  const authorPassword = await bcrypt.hash('author123', 12)
  
  const authorUser = await prisma.user.upsert({
    where: { email: 'author@5cms.com' },
    update: {},
    create: {
      email: 'author@5cms.com',
      name: 'Content Author',
      password: authorPassword,
      roleId: authorRole.id,
      isActive: true,
    },
  })

  console.log('✅ Users created:', { adminUser, editorUser, authorUser })

  // Create default categories
  const categories = [
    { name: 'Technology', slug: 'technology', description: 'Technology related content' },
    { name: 'Business', slug: 'business', description: 'Business and finance content' },
    { name: 'Lifestyle', slug: 'lifestyle', description: 'Lifestyle and wellness content' },
    { name: 'Education', slug: 'education', description: 'Educational content' },
  ]

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    })
  }

  console.log('✅ Categories created')

  // Create default tags
  const tags = [
    { name: 'AI', slug: 'ai' },
    { name: 'Web Development', slug: 'web-development' },
    { name: 'Design', slug: 'design' },
    { name: 'Marketing', slug: 'marketing' },
    { name: 'SEO', slug: 'seo' },
  ]

  for (const tag of tags) {
    await prisma.tag.upsert({
      where: { slug: tag.slug },
      update: {},
      create: tag,
    })
  }

  console.log('✅ Tags created')
  console.log('🎉 Database seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })