const swaggerUi = require('swagger-ui-express');
const YAML = require('yaml');
const fs = require('fs');
const path = require('path');

// Função auxiliar para carregar YAML com tratamento de erro
const loadSwaggerModule = (modulePath) => {
  try {
    return YAML.parse(fs.readFileSync(modulePath, 'utf8'));
  } catch (error) {
    console.warn(`Aviso: Não foi possível carregar ${modulePath}`);
    return { paths: {}, components: { schemas: {} } };
  }
};

// Carregar base
const baseSwagger = YAML.parse(
  fs.readFileSync(path.join(__dirname, '../../swagger.base.yaml'), 'utf8')
);

// Carregar módulos
const healthSwagger = loadSwaggerModule(
  path.join(__dirname, '../modules/health/health.swagger.yaml')
);

const productSwagger = loadSwaggerModule(
  path.join(__dirname, '../modules/products/product.swagger.yaml')
);

const couponSwagger = loadSwaggerModule(
  path.join(__dirname, '../modules/coupons/coupon.swagger.yaml')
);

const orderSwagger = loadSwaggerModule(
  path.join(__dirname, '../modules/orders/order.swagger.yaml')
);

const userSwagger = loadSwaggerModule(
  path.join(__dirname, '../modules/users/users.swagger.yaml')
);

const categorySwagger = loadSwaggerModule(
  path.join(__dirname, '../modules/categories/category.swagger.yaml')
);

const reviewSwagger = loadSwaggerModule(
  path.join(__dirname, '../modules/reviews/review.swagger.yaml')
);

// Mesclar tudo
const swaggerDocument = {
  ...baseSwagger,
  paths: {
    ...healthSwagger.paths,
    ...productSwagger.paths,
    ...couponSwagger.paths,
    ...orderSwagger.paths,
    ...userSwagger.paths,
    ...categorySwagger.paths,
    ...reviewSwagger.paths,
  },
  components: {
    ...baseSwagger.components,
    schemas: {
      ...baseSwagger.components?.schemas,
      ...productSwagger.components?.schemas,
      ...couponSwagger.components?.schemas,
      ...orderSwagger.components?.schemas,
      ...userSwagger.components?.schemas,
      ...categorySwagger.components?.schemas,
      ...reviewSwagger.components?.schemas,
    },
    responses: baseSwagger.components?.responses,
    parameters: baseSwagger.components?.parameters,
  }
};

// Configurações customizadas do Swagger UI
const swaggerOptions = {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'E-commerce API Documentation',
  customfavIcon: '/favicon.ico',
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true,
    filter: true,
    tryItOutEnabled: true,
  },
};

module.exports = {
  swaggerUi,
  swaggerDocument,
  swaggerOptions,
};
