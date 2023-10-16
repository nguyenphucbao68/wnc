import express from "express";
import actorModel from "../models/actor.model.js";
import validate from "../middlewares/validate.middleware.js";
import schema from "../schemas/actor.schema.js";

const router = express.Router();

/**
 * @openapi
 * tags:
 *   name: Actors
 *   description: The actors managing API
 * /api/actors/:
 *   get:
 *     tags: [Actors]
 *     summary: Returns all actors
 *     responses:
 *       200:
 *         description: An array of actors
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Actor'
 *             example:
 *               actor_id: 1
 *               first_name: string
 *               last_name: string
 *               last_update: 2006-02-15 05:03:42
 */
router.get("/", async function (req, res) {
  const list = await actorModel.findAll();
  res.json(list);
});

/**
 * @openapi
 * /api/actors/{id}/:
 *   get:
 *     tags: [Actors]
 *     summary: Returns a single actor
 *     parameters:
 *       - name: id
 *         description: Actor's id
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: A single actor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Actor'
 *             example:
 *               actor_id: 1
 *               first_name: string
 *               last_name: string
 *               last_update: 2006-02-15 05:03:42
 *       204:
 *         description: No actor found
 */
router.get("/:id", async function (req, res) {
  const id = req.params.id || 0;
  const film = await actorModel.findById(id);
  if (film === null) {
    return res.status(204).end();
  }

  res.json(film);
});

/** 
 * @openapi
 * /api/actors/:
 *   post:
 *     tags: [Actors]
 *     summary: Create a new actor
 *     requestBody:
 *       description: Actor's data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Actor'
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Actor'
 *             example:
 *               actor_id: 1
 *               first_name: string
 *               last_name: string
 *               last_update: 2006-02-15 05:03:42
 */
router.post("/", validate(schema), async function (req, res) {
  const entity = req.body;
  const ids = await actorModel.add(entity);
  entity.actor_id = ids[0];
  res.status(201).json(entity);
});

/**
 * @openapi
 * /api/actors/{id}/:
 *   delete:
 *     tags: [Actors]
 *     summary: Remove a single actor
 *     parameters:
 *       - name: id
 *         description: Actor's id
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: Number of affected rows
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Actor'
 *         example:
 *           affected: 1
 *       204:
 *         description: No actor found
 */
router.delete("/:id", async function (req, res) {
  const id = req.params.id || 0;
  const n = await actorModel.del(id);
  res.json({
    affected: n,
  });
});

/**
 * @openapi
 * /api/actors/{id}/:
 *   patch:
 *     tags: [Actors]
 *     summary: Updates a single actor
 *     parameters:
 *       - name: id
 *         description: Actor's id
 *         in: path
 *         required: true
 *         type: integer
 *     requestBody:
 *       description: Actor object
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Actor'
 *     responses:
 *       200:
 *         description: A single actor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Actor'
 *             example:
 *               actor_id: 1
 *               first_name: string
 *               last_name: string
 *               last_update: 2006-02-15 05:03:42
 *       204:
 *         description: No actor found
 */
router.patch("/:id", validate(schema), async function (req, res) {
  const id = req.params.id || 0;
  const actor = req.body;
  console.log("actor", id, actor);
  const n = await actorModel.patch(id, actor);
  res.json({
    affected: n,
  });
});

export default router;
