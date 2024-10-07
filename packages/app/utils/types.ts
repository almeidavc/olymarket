import { inferProcedureOutput } from '@trpc/server'
import { AppRouter } from 'api/trpc'

export type Post = inferProcedureOutput<AppRouter['post']['getById']>
