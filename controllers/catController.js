import Cat from "../models/cat.js";

/** GET /cats — return all cities */
const getAll = async (req, res, next) => {
  try {
    const cities = await Cat.find();
    return res.status(200).json(cities);
  } catch (err) {
    next(err);
  }
};

/** GET /cats/:id — return one city */
const getIndividual = async (req, res, next) => {
  const { id } = req.params;
  try {
    const city = await Cat.findById(id);
    if (!city) {
      return res.status(404).json({ message: `City with id ${id} not found.` });
    }
    return res.status(200).json({ message: "City found.", data: city });
  } catch (err) {
    next(err);
  }
};

/** POST /cats — create a city (auth required) */
const create = async (req, res, next) => {
  try {
    const newCity = await Cat.create({ ...req.body, createdBy: req.currentUser.id });
    return res.status(201).json({ message: "City created.", city: newCity });
  } catch (err) {
    next(err);
  }
};

/** PATCH /cats/:id — update a city (owner or admin only) */
const update = async (req, res, next) => {
  const { id } = req.params;
  try {
    const city = await Cat.findById(id);
    if (!city) {
      return res.status(404).json({ message: `City with id ${id} not found.` });
    }

    const isOwner = req.currentUser.id === city.createdBy.toString();
    const isAdmin = req.currentUser.role === "admin";
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "You can only edit cities you created." });
    }

    const updated = await Cat.findByIdAndUpdate(id, req.body, { returnDocument: "after" });
    return res.status(200).json({ message: "City updated.", city: updated });
  } catch (err) {
    next(err);
  }
};

/** DELETE /cats/:id — delete a city (owner or admin only) */
const remove = async (req, res, next) => {
  const { id } = req.params;
  try {
    const city = await Cat.findById(id);
    if (!city) {
      return res.status(404).json({ message: `City with id ${id} not found.` });
    }

    const isOwner = req.currentUser.id === city.createdBy.toString();
    const isAdmin = req.currentUser.role === "admin";
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "You can only delete cities you created." });
    }

    await Cat.findByIdAndDelete(id);
    return res.status(200).json({ message: "City deleted." });
  } catch (err) {
    next(err);
  }
};

/** POST /search — find cities by name (case-insensitive) */
const search = async (req, res, next) => {
  const { query } = req.body;

  if (!query || !query.trim()) {
    return res.status(400).json({ message: "Search query cannot be empty." });
  }

  try {
    const results = await Cat.find({ name: { $regex: query.trim(), $options: "i" } });

    if (!results.length) {
      return res.status(404).json({ message: `No city matching "${query}" was found.` });
    }

    return res.status(200).json({ message: "Cities found.", data: results });
  } catch (err) {
    next(err);
  }
};

export default { getAll, getIndividual, create, update, remove, search };
