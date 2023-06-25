import { Client } from '@elastic/elasticsearch'

export const elastic = new Client({
  node: process.env.ELASTICSEARCH_NODE_URL,
  auth: {
    username: 'elastic',
    password: process.env.ELASTIC_PASSWORD,
  },
})
