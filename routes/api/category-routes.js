const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  // find all categories
  // be sure to include its associated Products
  try {
    const categoryData = await Category.findAll({
      include: [{ model: Product }],
    });
    res.status(200).json(categoryData); 
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  // find one category by its `id` value
  // be sure to include its associated Products
  try {
    const categoryId = req.params.id; // Gets the category id from the request params
    const categoryData = await Category.findByPk(categoryId, {
      include: [{ model: Product }],
    });
    if (!categoryData) {
      // Checks if categoryData is null, returns an error message
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', (req, res) => {
  // create a new category
});

router.put('/:id', (req, res) => {
  // update a category by its `id` value
});
router.delete('/:id', async (req, res) => {
  // delete a category by its `id` value
  try {
    const categoryId = req.params.id;
    const deletedCategory = await Category.destroy({
      where: {
        id: categoryId,
      },
    });

    if (deletedCategory === 0) {
      // If no category was deleted, respond with a 404 status and a message
      res.status(404).json({ message: 'Category not found' });
    } else {
      // If the category was successfully deleted, respond with a 200 status
      res.status(200).json({ message: 'Category deleted successfully' });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
