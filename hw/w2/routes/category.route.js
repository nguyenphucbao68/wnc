import express from 'express';
import categoryModel from '../models/category.model.js';

const router = express.Router();

/**
 * @openapi
 * tags:
 *  name: Categories
 *  description: The categories managing API
 * /api/categories/:
 *  get:
 *   tags: [Categories]
 *   summary: Returns all categories
 *   responses:
 *    200:
 *     description: An array of categories
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/Category'
 *       example:
 *        - category_id: 1
 *          name: string
 *          last_update: 2006-02-15 05:03:42
 */
router.get('/', async function (req, res) {
  const list = await categoryModel.findAll();
  res.json(list);
})

/**
 * @openapi
 * /api/categories/{id}:
 *  get:
 *   tags: [Categories]
 *   summary: Returns a single category
 *   parameters:
 *    - name: id
 *      description: Category's id
 *      in: path
 *      required: true
 *      type: integer
 *   responses:
 *    200:
 *     description: An array of categories
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/Category'
 *       example:
 *        category_id: 1
 *        name: string
 *        last_update: 2006-02-15 05:03:42
 */
router.get('/:id', async function (req, res) {
  const id = req.params.id || 0;
  const category = await categoryModel.findById(id);
  if (category === null) {
    return res.status(204).end();
  }

  res.json(category);
})

/**
 * @openapi
 * /api/categories/:
 *  post:
 *   tags: [Categories]
 *   summary: Create a new category
 *   requestBody:
 *    description: Category object
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/components/schemas/Category'
 *      example: 
 *       category_id: 1
 *       name: string
 *       last_updated: 2006-02-15 05:03:42
 *   responses:
 *    200:
 *     description: An array of categories
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/Category'
 *       example:
 *        category_id: 1
 *        name: string
 *        last_update: 2006-02-15 05:03:42
 */
router.post('/', async function (req, res) {
  let category = req.body;
  const ret = await categoryModel.add(category);

  category = {
    category_id: ret[0],
    ...category
  }
  res.status(201).json(category);
})

/**
 * @openapi
 * /api/categories/{id}:
 *  delete:
 *   tags: [Categories]
 *   summary: Remove a single category
 *   parameters:
 *    - name: id
 *      description: Category's id
 *      in: path
 *      required: true
 *      type: integer
 *   responses:
 *    200:
 *     description: Number of affected rows
 *     content:
 *      application/json:
 *       schema:
 *        affected:
 *         type: number
 *       example:
 *        affected: 1
 */
router.delete('/:id', async function (req, res) {
  const id = req.params.id || 0;
  const n = await categoryModel.del(id);
  res.json({
    affected: n
  });
})

/**
 * @openapi
 * /api/categories/{id}:
 *  patch:
 *   tags: [Categories]
 *   summary: Updates a single category
 *   parameters:
 *    - name: id
 *      description: Category's id
 *      in: path
 *      required: true
 *      type: integer
 *   requestBody: 
 *    description: Category object
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/components/schemas/Category'
 *      example: 
 *       category_id: 1
 *       name: string
 *       last_updated: 2006-02-15 05:03:42
 *   responses:
 *    200:
 *     description: Number of affected rows
 *     content:
 *      application/json:
 *       schema:
 *        affected:
 *         type: number
 *       example:
 *        affected: 1
 */
router.patch('/:id', async function (req, res) {
  const id = req.params.id || 0;
  const category = req.body;
  const n = await categoryModel.patch(id, category);
  res.json({
    affected: n
  });
})

export default router;