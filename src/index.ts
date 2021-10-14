import {PrismaClient} from '@prisma/client'
import express from 'express'
import cors from 'cors'

import checkGames from "./checkGames";
import compressVec from "./compressVec";

type checkProgress = (body: any) => boolean;
import checkProgress from "./checkProgress";


const prisma = new PrismaClient()
const app = express()

app.use(express.json())
app.use(cors())
app.use(express.static("./prisma/"))

app.get(`/game/:id`, async (req, res) => {
    const {id}: { id?: string } = req.params
    if (id) {
        const result = await getProgress(Number(id));
        if (result && result.status && result.data) {
            res.status(result.status).json(result.data);
        }
    }
})

app.post(`/checkmate`, async (req, res) => {
    const result: any = await postProgress(req.body);
    console.log(result)
    res.status(result.status).json(result.data);
})

async function getProgress(skip: number) {
    try {
        const init = await prisma.initial.findFirst({
            orderBy: {
                time: "asc",
            },
            skip: Number(skip),
        });
        if (init) {
            try {
                prisma.initial.update({
                    where: {
                        moves: String(init.moves),
                    },
                    data: {
                        time: new Date().getTime(),
                    },
                    select: {
                        moves: true,
                        time: true,
                    },
                });

                return {
                    status: 200,
                    data: init,
                };
            } catch (error) {
                console.error("update", error);
                return {
                    status: 500,
                    data: {message: "update", error: error},
                };
            }
        }
    } catch (error) {
        console.error("initial.findMany", error);
        return {
            status: 500,
            data: {message: "initial.findMany", error: error},
        };
    }
}


async function postProgress(body: any) {
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
                                time: new Date().getTime(),
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

async function updateProgress(game: any) {
    return new Promise(async (resolve?: any, reject?: any) => {
        try {
            await prisma.initial.update({
                where: {
                    moves: game.moves, //"[0,0,0,0]",
                },
                data: {
                    progress: game.progress, //"[0,0,0,0,0]",
                    length: JSON.parse(game.progress).length,
                    time: new Date().getTime(),
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


const server = app.listen(3000, () => {
    console.log("🚀 Server ready at: http://localhost:3000")
})
