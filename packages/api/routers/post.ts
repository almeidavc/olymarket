import { router, publicProcedure } from 'api/trpc'

export const postRouter = router({
  list: publicProcedure.query(() => {
    return [
      {
        title: 'test post',
        price: 40,
        imageUrl:
          'https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/SMPTE_Color_Bars.svg/200px-SMPTE_Color_Bars.svg.png',
      },
      {
        title: 'test post 2',
        price: 45,
        imageUrl:
          'https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/SMPTE_Color_Bars.svg/200px-SMPTE_Color_Bars.svg.png',
      },
    ]
  }),
})
