// import models
const Product = require('./Product');
const Category = require('./Category');
const Tag = require('./Tag');
const ProductTag = require('./ProductTag');

// Products belongsTo Category
Product.hasOne(Category, {
  foreignKey: 'product_id',
  onDelete: 'CASCADE',
});
// Categories have many Products
Category.hasMany(Product, {
  foreignKey: 'product_id',
  onDelete: 'CASCADE',
});
// Products belongToMany Tags (through ProductTag)
Product.belongsTo(Tag, {
  foreignKey: 'tag_id',
});
// Tags belongToMany Products (through ProductTag)
Tag.belongsTo(Product, {
  foreignKey: 'product_id',
}),

module.exports = {
  Product,
  Category,
  Tag,
  ProductTag,
};
