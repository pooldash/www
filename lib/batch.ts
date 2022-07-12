import _ from 'lodash';

export const batchEmUp = async <T>(promises: Promise<T>[], batchSize: number): Promise<T[]> => {
    const batches = _.chunk(promises, batchSize);
    const results: T[][] = [];
    while (batches.length) {
        const batch = batches.shift();
        const result = await Promise.all(batch);
        results.push(result);
    }
    return _.flatten(results);
};
