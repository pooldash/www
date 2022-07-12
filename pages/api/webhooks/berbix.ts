import { NextApiHandler } from 'next';

// see graphql/index.ts for a better example.
const handler: NextApiHandler = (req, res) => {
    const data = req.body;
    return res.send('ok');
};

export default handler;
