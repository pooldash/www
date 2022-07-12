import { NextApiHandler } from 'next';

// see graphql/index.ts for a better example.
const handler: NextApiHandler = (req, res) => {
    res.send('This is not the Stakeriver API. Go away.');
};

export default handler;
