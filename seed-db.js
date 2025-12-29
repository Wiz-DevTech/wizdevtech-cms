import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

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

  console.log('✅ Roles created')

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

  console.log('✅ Admin user created')
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