import express from "express";
import filmModel from "../models/film.model.js";
import validate from "../middlewares/validate.middleware.js";
import schema from "../schemas/film.schema.js";

const router = express.Router();

/**
 * @openapi
 * tags:
 *   name: Films
 *   description: The films managing API
 * /api/films/:
 *   get:
 *     tags: [Films]
 *     summary: Returns all films
 *     responses:
 *       200:
 *         description: An array of films
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Film'
 *             example:
 *             - film_id: 1
 *               title: string
 *               description: string
 *               release_year: 2006
 *               language_id: 1
 *               original_language_id: 1
 *               rental_duration: 6
 *               rental_rate: 0.99
 *               length: 86
 *               replacement_cost: 20.99
 *               special_features: "Trailers,Deleted Scenes"
 *               rating: G
 *               last_update: 2006-02-15 05:03:42
 */
router.get("/", async function (req, res) {
  const list = await filmModel.findAll();
  res.json(list);
});

/**
 * @openapi
 * /api/films/{id}:
 *   get:
 *     tags: [Films]
 *     summary: Returns a single film
 *     parameters:
 *       - name: id
 *         description: Film's id
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: A single film
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Film'
 *       204:
 *         description: No content
 */
router.get("/:id", async function (req, res) {
  const id = req.params.id || 0;
  const film = await filmModel.findById(id);
  if (film === null) {
    return res.status(204).end();
  }

  res.json(film);
});

/**
 * @openapi
 * /api/films/:
 *   post:
 *     tags: [Films]
 *     summary: Adds a new film
 *     requestBody:
 *       description: Film object
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Film'
 *     responses:
 *       201:
 *         description: The created film
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Film'
 */
router.post("/", validate(schema), async function (req, res) {
  let film = req.body;
  const ret = await filmModel.add(film);

  film = {
    film_id: ret[0],
    ...film,
  };
  res.status(201).json(film);
});

/**
 * @openapi
 * /api/films/{id}:
 *   delete:
 *     tags: [Films]
 *     summary: Removes a single film
 *     parameters:
 *       - name: id
 *         description: Film's id
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: Number of affected rows
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 affected:
 *                   type: integer
 *             example:
 *               affected: 1
 */
router.delete("/:id", async function (req, res) {
  const id = req.params.id || 0;
  const n = await filmModel.del(id);
  res.json({
    affected: n,
  });
});

/**
 * @openapi
 * /api/films/{id}:
 *   patch:
 *     tags: [Films]
 *     summary: Updates a single film
 *     parameters:
 *       - name: id
 *         description: Film's id
 *         in: path
 *         required: true
 *         type: integer  
 *     requestBody:
 *       description: Film object
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Film'
 *     responses:
 *       200:
 *         description: Number of affected rows
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties: 
 *                 affected:
 *                   type: integer  
 *             example:
 *               affected: 1
 */
router.patch("/:id", validate(schema), async function (req, res) {
  const id = req.params.id || 0;
  const film = req.body;
  const n = await filmModel.patch(id, film);
  res.json({
    affected: n,
  });
});

export default router;
