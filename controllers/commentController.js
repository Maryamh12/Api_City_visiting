import Cat from "../models/cat.js";

/** POST /comment/:catId/:storyId — add a comment to a story */
const create = async (req, res, next) => {
  const { catId, storyId } = req.params;
  const { text } = req.body;
  const { id: userId } = req.currentUser;

  try {
    const city = await Cat.findById(catId);
    if (!city) {
      return res.status(404).json({ message: `City with id ${catId} not found.` });
    }

    const story = city.storys.id(storyId);
    if (!story) {
      return res.status(404).json({ message: `Story with id ${storyId} not found.` });
    }

    story.comments.push({ text, createdBy: userId });
    await city.save();

    return res.status(201).json({
      message: "Comment added.",
      comment: { text, createdBy: userId },
    });
  } catch (err) {
    next(err);
  }
};

/** PATCH /comment/:catId/:commentId — update a comment (owner or admin only) */
const update = async (req, res, next) => {
  const { catId, commentId } = req.params;

  try {
    const city = await Cat.findById(catId);
    if (!city) {
      return res.status(404).json({ message: `City with id ${catId} not found.` });
    }

    // Search comments across all stories in this city
    let comment = null;
    for (const story of city.storys) {
      comment = story.comments.id(commentId);
      if (comment) break;
    }

    if (!comment) {
      return res.status(404).json({ message: `Comment with id ${commentId} not found.` });
    }

    const isOwner = req.currentUser.id === comment.createdBy.toString();
    const isAdmin = req.currentUser.role === "admin";
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "You can only edit your own comments." });
    }

    comment.text = req.body.text;
    await city.save();

    return res.status(200).json({ message: "Comment updated.", comment });
  } catch (err) {
    next(err);
  }
};

/** DELETE /comment/:catId/:commentId — delete a comment (owner or admin only) */
const remove = async (req, res, next) => {
  const { catId, commentId } = req.params;

  try {
    const city = await Cat.findById(catId);
    if (!city) {
      return res.status(404).json({ message: `City with id ${catId} not found.` });
    }

    let comment = null;
    for (const story of city.storys) {
      comment = story.comments.id(commentId);
      if (comment) break;
    }

    if (!comment) {
      return res.status(404).json({ message: `Comment with id ${commentId} not found.` });
    }

    const isOwner = req.currentUser.id === comment.createdBy.toString();
    const isAdmin = req.currentUser.role === "admin";
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "You can only delete your own comments." });
    }

    comment.deleteOne();
    await city.save();

    return res.status(200).json({ message: "Comment deleted." });
  } catch (err) {
    next(err);
  }
};

export default { create, update, remove };
