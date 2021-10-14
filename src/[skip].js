import getProgress from "./getProgress";
import postProgress from "./postProgress";

export default async function progress(req, res) {
  if (req.method === "GET") {
    if (req.query.skip) {
      const result = await getProgress(req.query.skip);
      res.status(result.status).json(result.data);
    } else {
      return res.status(400);
    }
  } else if (req.method === "POST") {
    console.log(req.body);
    if (!req.body) {
      return res.status(400).json({
        message: { games: String(), progress: String(), moves: Array() },
      });
    }

    if (!req.body.progress) {
      return res
        .status(400)
        .json({ data: { message: "body.progress", error: req.body.progress } });
    }
    if (!req.body.moves) {
      return res
        .status(400)
        .json({ data: { message: "body.moves", error: req.body.moves } });
    }

    const result = await postProgress(req.body);
    console.log(result)
    res.status(result.status).json(result.data);
  } else {
    res.status(404).json({ method: ["GET", "POST"] });
  }
}
