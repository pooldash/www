
/// Serverless Cloud Params for this app:
export const SUPABASE_URL = process.env.SUPABASE_URL as string;
export const SUPABASE_KEY_ANON = process.env.SUPABASE_KEY_ANON as string;
export const SUPABASE_JWT_SECRET = process.env.SUPABASE_JWT_SECRET as string;

// Surprise, this one is named differently?
export const SUPABASE_DB_STRING = process.env.DATABASE_URL as string;

// Vercel uses the default names here, so we have to customize our role names:
export const AWS_ACCESS_KEY = process.env.SR_AWS_ACCESS_KEY_ID as string;
export const AWS_SECRET_KEY = process.env.SR_AWS_SECRET_ACCESS_KEY as string;

// CoinMarketCap stuff, we might need to pay for an account soon:
export const COINMARKETCAP_KEY = process.env.COINMARKETCAP_KEY as string;

// Is this too much logic for a "dumb" file like this? meh.
export const VERCEL_URL = process.env.VERCEL_URL as string;

const GIT_BRANCH_NAME = process.env.VERCEL_GIT_COMMIT_REF;
export const IS_PROD = GIT_BRANCH_NAME === 'master';
export const IS_STAGING = GIT_BRANCH_NAME === 'develop';
export const IS_PREVIEW = !(IS_STAGING || IS_PROD);

export const DOMAIN_HOST_NAME = 'stakeriver.com';

export const POCKET_SECRET_PASSPHRASE = process.env.POCKET_SECRET_PASSPHRASE as string;

// The height at which StakeRiver effectively started
export const GENESIS_BLOCK_HEIGHT = BigInt('47000');

export const BANKING_ADDRESS = '3157f68acec7c0e4e3bd28a4abf743b33e6f7aa0';

export const ADMIN_SECRET = process.env.ADMIN_SECRET as string;

// Sanity-check to catch missing params (try to do this on deploy or something):
export const explodeIfMissingParams = () => {
    console.log('Checking for missing parameters...');
    const expectedVars = [
        SUPABASE_URL,           // 0
        SUPABASE_KEY_ANON,      // 1
        SUPABASE_JWT_SECRET,    // 2
        VERCEL_URL,              // 3
    ];
    expectedVars.forEach((v, i) => {
        if (v && v.length) {}
        else { throw `Secret ${i} not implemented`; }
    });
    if (BANKING_ADDRESS !== '3157f68acec7c0e4e3bd28a4abf743b33e6f7aa0') {
        throw 'Changed banking address!!';
    }
    console.log('All params are present & non-empty! Nice.');
};
