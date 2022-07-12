import { pc } from './Prisma';

export namespace BerbixRepo {
    export const saveEvent = async (content: string) => {
        await pc.berbixEvent.create({
            data: {
                content
            }
        });
    };
}
