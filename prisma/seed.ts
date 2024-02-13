import prisma from "../src/prisma/client";

const seed = async () => {
    try {
        console.log('Started seeding...');
        await prisma.user.upsert({
            where: {username: 'john_doe'},
            create: {
                name: 'John Doe',
                password: 'password',
                username: 'john_doe',
            },
            update: {
                name: 'John Doe',
                password: 'password',
                username: 'john_doe',
            }
        });
        console.log('Completed seeding.')
    } catch (error) {
        console.log('Something went wrong during seeding the database!');
        console.error(error);
    }
}

seed()