## Dev setup
- `yarn install`
- get an api token at https://confluence.atlassian.com/x/Vo71Nw
- `cp .env.example .env`
- fill `.env` file
- run server with `PORT=3333 yarn run watch`
- run script with `PORT=3333 yarn run watch:updatedb`

## Setup db:
```cypher
CREATE CONSTRAINT unique_issue_id IF NOT EXISTS ON (n:Issue) ASSERT n.id IS UNIQUE
CREATE CONSTRAINT unique_board_id IF NOT EXISTS ON (n:Board) ASSERT n.id IS UNIQUE
CREATE CONSTRAINT unique_sprint_id IF NOT EXISTS ON (n:Sprint) ASSERT n.id IS UNIQUE
CREATE CONSTRAINT unique_board_id IF NOT EXISTS ON (n:Project) ASSERT n.id IS UNIQUE
```

