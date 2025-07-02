import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    // Crear usuario de prueba
    const user = await prisma.user.upsert({
      where: { id: 'user1' },
      update: {},
      create: {
        id: 'user1',
        email: 'user1@example.com',
        password: '$2a$10$test_hash_for_development',
        name: 'Usuario de Prueba',
      },
    })

    console.log('Usuario de prueba creado:', user)
  } catch (error) {
    console.error('Error al crear el usuario de prueba:', error)
    process.exit(1)
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  }) 