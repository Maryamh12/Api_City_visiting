import Cat from "../models/cat.js";

/** POST /story/:catId — add a story to a city */
const create = async (req, res, next) => {
  const { catId } = req.params;
  const { id: userId } = req.currentUser;

  try {
    const city = await Cat.findById(catId);
    if (!city) {
      return res.status(404).json({ message: `City with id ${catId} not found.` });
    }

    city.storys.push({ ...req.body, createdBy: userId });
    await city.save();

    return res.status(201).json({ message: "Story created successfully." });
  } catch (err) {
    next(err);
  }
};

/** PATCH /story/:catId/:storyId — update a story (owner or admin only) */
const update = async (req, res, next) => {
  const { catId, storyId } = req.params;
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

    const isOwner = userId === story.createdBy.toString();
    const isAdmin = req.currentUser.role === "admin";
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "You can only edit your own stories." });
    }

    story.set(req.body);
    await city.save();

    return res.status(200).json({ message: "Story updated.", story });
  } catch (err) {
    next(err);
  }
};

/** DELETE /story/:catId/:storyId — delete a story (owner or admin only) */
const remove = async (req, res, next) => {
  const { catId, storyId } = req.params;
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

    const isOwner = userId === story.createdBy.toString();
    const isAdmin = req.currentUser.role === "admin";
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "You can only delete your own stories." });
    }

    story.deleteOne();
    await city.save();

    return res.status(200).json({ message: "Story deleted." });
  } catch (err) {
    next(err);
  }
};

/** POST /story/:storyId/like — toggle like on a story */
const liked = async (req, res, next) => {
  const { storyId } = req.params;
  const { id: userId } = req.currentUser;

  try {
    const cityWithStory = await Cat.findOne(
      { "storys._id": storyId },
      { "storys.$": 1 }
    );

    if (!cityWithStory) {
      return res.status(404).json({ message: `Story with id ${storyId} not found.` });
    }

    const story    = cityWithStory.storys[0];
    const hasLiked = story.likes.map(String).includes(String(userId));
    const operator = hasLiked ? "$pull" : "$push";

    await Cat.updateOne(
      { _id: cityWithStory._id, "storys._id": storyId },
      { [operator]: { "storys.$.likes": userId } }
    );

    const updated    = await Cat.findOne({ "storys._id": storyId }, { "storys.$": 1 });
    const likesCount = updated.storys[0].likes.length;

    return res.status(200).json({ success: true, likes: likesCount });
  } catch (err) {
    next(err);
  }
};

export default { create, update, remove, liked };
