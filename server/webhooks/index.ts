import { app } from '../app'
import bodyParser from 'body-parser'
import { prisma } from '../prisma'

app.use(bodyParser.json())
app.post('/hook', async (req) => {
  const event = req.body
  switch (event.type) {
    case 'user.created':
    case 'user.updated':
      const user = event.data
      await prisma.user.upsert({
        where: {
          id: user.id,
        },
        create: {
          id: user.id,
          username: user.username,
          profileImageUrl: user.profile_image_url,
        },
        update: {
          id: user.id,
          username: user.username,
          profileImageUrl: user.profile_image_url,
        },
      })
      break
    case 'user.deleted':
      if (!event.data.deleted) {
        return
      }

      const userId = event.data.id

      try {
        await prisma.user.delete({
          where: {
            id: userId,
          },
        })
      } catch (error) {
        // catch error thrown when user does not exist
        if (error.code === 'P2025') {
          return
        }
        throw error
      }
  }
})
