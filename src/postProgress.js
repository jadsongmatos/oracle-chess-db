import prisma from "./prisma";
import checkGames from "./checkGames";
import {compressVec} from "./compressVec";
import checkProgress from "./checkProgress";

export default async function postProgress(body) {
    if (checkProgress(body)) {
        if (body.gamesWins !== [] && Array.isArray(body.gamesWins)) {
            if (checkGames(body)) {
                try {
                    let i = 0;
                    for (let game of body.gamesWins) {
                        await prisma.checkmate.create({
                            data: {
                                game: compressVec(game), //"sa5f45ds4",
                            },
                            skipDuplicates: true
                        });
                        i++;
                    }

                    try {
                        await prisma.initial.update({
                            where: {
                                moves: body.moves, //"[0,0,0,0]",
                            },
                            data: {
                                progress: body.progress, //"[0,0,0,0,0]",
                                length: JSON.parse(body.progress).length,
                                time: new Date(),
                            },
                            select: {
                                progress: true,
                                time: true,
                                length: true,
                            },
                        });

                        return {
                            status: 200,
                            data: "ok",
                        };
                    } catch (error) {
                        console.error("initial.update", error);
                        return {
                            status: 500,
                            data: {message: "initial.update", error: error},
                        };
                    }
                } catch (error) {
                    console.error("checkmate.createMany", error);
                    return {
                        status: 500,
                        data: {message: "checkmate.createMany", error: error},
                    };
                }
            } else {
                console.error("game invalid");
                return {
                    status: 400,
                    data: {message: "game invalid"},
                };
            }
        } else {
            try {
                await updateProgress(body);

                return {
                    status: 200,
                    data: "ok",
                };
            } catch (error) {
                console.error("initial.update", error);
                return {
                    status: 500,
                    data: {message: "initial.update", error: error},
                };
            }
        }
    }
    return {
        status: 500,
        data: {message: "checkProgress false"},
    };
}

async function updateProgress(game) {
    return new Promise(async (resolve, reject) => {
        try {
            await prisma.initial.update({
                where: {
                    moves: game.moves, //"[0,0,0,0]",
                },
                data: {
                    progress: game.progress, //"[0,0,0,0,0]",
                    length: JSON.parse(game.progress).length,
                    time: new Date(),
                },
                select: {
                    progress: true,
                    time: true,
                    length: true,
                },
            });
            resolve();
        } catch (error) {
            reject(error);
        }
    });
}
