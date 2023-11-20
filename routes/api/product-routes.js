const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/', async (req, res) => {
  // find all products
  // be sure to include its associated Category and Tag data
  try {
    const productData = await Product.findAll({
      include: [{ model: Category }, { model: Tag }],
    });
    res.status(200).json(productData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get one product
router.get('/:id', async (req, res) => {
  // find a single product by its `id`
  // be sure to include its associated Category and Tag data
  try {
    const productId = req.params.id; // Gets the product id from the request params
    const productData = await Product.findByPk(productId, {
      include: [{ model: Category }, { model: Tag }],
    });
    if (!productData) {
      // Checks if productData is null, returns an error message
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(productData);
  } catch (err) {
    res.status(500).json(err);
  }
});


// create new product
router.post('/', async (req, res) => {
  try {
    const { product_name, price, stock, tagIds, category_id } = req.body;

    // First, create the product
    const newProduct = await Product.create({
      product_name,
      price,
      stock,
      category_id, // Associate the product with the specified category
    });

    // Next, associate the product with tags (if any)
    if (tagIds && tagIds.length > 0) {
      const productTagIdArr = tagIds.map((tag_id) => {
        return {
          product_id: newProduct.id,
          tag_id,
        };
      });
      await ProductTag.bulkCreate(productTagIdArr);
    }

    // Fetch the created product along with its associated category and tags
    const createdProduct = await Product.findByPk(newProduct.id, {
      include: [
        { model: Category },
        { model: Tag, through: ProductTag },
      ],
    });

    res.status(200).json(createdProduct);
  } catch (err) {
    console.error(err);
    res.status(400).json(err);
  }
});



// update product
router.put('/:id', (req, res) => {
  // update product data
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      if (req.body.tagIds && req.body.tagIds.length) {
        
        ProductTag.findAll({
          where: { product_id: req.params.id }
        }).then((productTags) => {
          // create filtered list of new tag_ids
          const productTagIds = productTags.map(({ tag_id }) => tag_id);
          const newProductTags = req.body.tagIds
          .filter((tag_id) => !productTagIds.includes(tag_id))
          .map((tag_id) => {
            return {
              product_id: req.params.id,
              tag_id,
            };
          });

            // figure out which ones to remove
          const productTagsToRemove = productTags
          .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
          .map(({ id }) => id);
                  // run both actions
          return Promise.all([
            ProductTag.destroy({ where: { id: productTagsToRemove } }),
            ProductTag.bulkCreate(newProductTags),
          ]);
        });
      }

      return res.json(product);
    })
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
});

router.delete('/:id', (req, res) => {
  // delete one product by its `id` value
  const productId = req.params.id;
  Product.destroy({
    where: {
      id: productId,
    },
  })
    .then((deletedProduct) => {
      if (deletedProduct === 0) {
        // If no product was deleted, respond with a 404 status and a message
        res.status(404).json({ message: 'Product not found' });
      } else {
        // If the product was successfully deleted, respond with a 200 status
        res.status(200).json({ message: 'Product deleted successfully' });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});


module.exports = router;
