import {
  CreateProductWorkflowInputDTO,
  ExecArgs,
  ProductCategoryDTO,
  SalesChannelDTO,
  ShippingProfileDTO
} from "@medusajs/framework/types";

import { 
  ContainerRegistrationKeys, 
  Modules, 
  ProductStatus,
} from "@medusajs/framework/utils";
import { 
  createInventoryLevelsWorkflow,
  createProductCategoriesWorkflow,
  createProductsWorkflow,
} from "@medusajs/medusa/core-flows";

import '../../medusa-config'

type ProductDataArgs = {
  name: string,
  colors: string[],
  title: string,
  description: string,
  categories: string[]
};

const productDataArgs : ProductDataArgs[] = [
  {
    name: "barking-dog",
    title: "Barking Dog",
    description: "Profile of a small dog barking",
    colors: ["white", "light-blue", "orange", "red"],
    categories: ["Simple Lines", "Animals"]
  },
  {
    name: "birds-feather",
    title: "Birds of a Feather Flock Together",
    description: "Abstract art of a flock of birds flying within a feather",
    colors: ["asphalt", "creme", "slate"],
    categories: ["Art Within Art", "Bold and Bright"]
  },
  {
    name: "cat-starry-night",
    title: "Cat in a Starry Night",
    description: "An abstract representation of a cat with stars, inspired by Vincent Van Gogh's Starry Night",
    colors: ["white", "light-blue", "heather"],
    categories: ["Art Within Art", "Thematic Nature"]
  },
  {
    name: "crow",
    title: "Crow",
    description: "A black and white profile of a crow",
    colors: ["light-blue", "white"],
    categories: ["Simple Lines", "Animals"]
  },
  {
    name: "dune",
    title: "Sand Dunes",
    description: "Towering sand dunes in the setting sun, inspired by Frank Herbert's fictional planet Arrakis from Dune",
    colors: ["creme"],
    categories: ["Landscapes", "Thematic Nature"]
  },
  {
    name: "elephant",
    title: "Elephant",
    description: "A multicolored elephant in paisley pastels",
    colors: ["white", "creme"],
    categories: ["Animals", "Bold and Bright"]
  },
  {
    name: "fox-wilderness",
    title: "Fox in the Wild",
    description: "A lone fox in the forest",
    colors: ["white", "creme"],
    categories: ["Landscapes"]
  },
  {
    name: "jellyfish",
    title: "Bobbing Jellyfish",
    description: "A bright jellyfish swimming along",
    colors: ["military-green", "teal", "white", "creme"],
    categories: ["Animals", "Art Within Art"]
  },
  {
    name: "koi",
    title: "Koi",
    description: "A group of koi swimming in circles",
    colors: ["royal-blue", "slate", "yellow", "heather"],
    categories: ["Animals", "Bold and Bright"]
  },
  {
    name: "meditation-tree",
    title: "Meditation Tree",
    description: "A graceful meditation tree reminiscent of Japanese gardens",
    colors: ["white", "royal-heather"],
    categories: ["Plant Portraits", "Thematic Nature"]
  },
  {
    name: "mountain-meadow",
    title: "Meadow Ringed by Mountains",
    description: "A lush meadow with wildflowers silhouetted by the mountains",
    colors: ["soft-pink", "white", "creme"],
    categories: ["Landscapes"]
  },
  {
    name: "retro-landscape",
    title: "Retro Landscape",
    description: "Mountains and sun grouped for fun",
    colors: ["black", "brown", "navy", "red-heather"],
    categories: ["Landscapes"]
  },
  {
    name: "retro-sunset",
    title: "Palm Trees",
    description: "A cluster of palm trees framed by a retro sunset theme",
    colors: ["black", "white"],
    categories: ["Plant Portraits", "Bold and Bright"]
  },
  {
    name: "sea-otter",
    title: "Sea Otter",
    description: "A cute sea otter floating on the water",
    colors: ["light-blue", "white", "orange"], 
    categories: ["Animals"]
  },
  {
    name: "sequoias",
    title: "Forest of Sequoias",
    description: "A forest of towering redwood sequoias",
    colors: ["brown", "black"],
    categories: ["Landscapes"]
  },
  {
    name: "sunflower",
    title: "Bright Sunflower",
    description: "A single sunflower head, open, tall, and yellow",
    colors: ["slate", "heather", "blue", "soft-pink"],
    categories: ["Plant Portraits", "Bold and Bright"]
  },
  {
    name: "sunset-landscape",
    title: "Sun over Mountains",
    description: "A sun setting behind a forested mountain range",
    colors: ["purple", "navy", "royal-blue"],
    categories: ["Landscapes"]
  },
  {
    name: "sunflowers",
    title: "Curving Sunflowers",
    description: "Abstract drawing of a field of curving sunflowers",
    colors: ["yellow", "asphalt", "maroon"],
    categories: ["Plant Portraits", "Bold and Bright"]
  },
  {
    name: "tree-of-life", 
    title: "Tree of Life",
    description: "The iconic tree of life representing the sacred roots in which life is rooted",
    colors: ["teal", "heather", "green"],
    categories: ["Plant Portraits", "Thematic Nature", "Simple Lines"]
  },
  {
    name: "tree-ring",
    title: "Tree Trunk with Rings",
    description: "Tree rings representing the passage of time",
    colors: ["maroon", "green", "white"],
    categories: ["Plant Portraits", "Simple Lines"]
  },
  {
    name: "waterfall",
    title: "Waterfall",
    description: "A curving waterfall set in a mountainous landscape",
    colors: ["light-blue", "white", "teal", "soft-pink"],
    categories: ["Landscapes", "Simple Lines"]
  },
  {
    name: "yin-yang",
    title: "Yin-Yang with Nature",
    description: "An artistic rendering of trees, the sun, and the moon within a yin-yang backdrop",
    colors: ["military-green", "black", "slate"],
    categories: ["Thematic Nature", "Simple Lines"]
  }
];

const SIZE_OPTION =  {
  title: "Size",
  values: ["S", "M", "L", "XL"],
};
const STYLE_CATEGORY_NAMES = [
  "Simple Lines",
  "Landscapes",
  "Animals",
  "Plant Portraits",
  "Art Within Art",
  "Thematic Nature",
  "Bold and Bright"
];

const USD_PRICE = 30;
const EU_PRICE = 26;

export default async function seedProducts({
  container,
}: ExecArgs) {

  const logger = container.resolve(
    ContainerRegistrationKeys.LOGGER
  );
  const query = container.resolve(
    ContainerRegistrationKeys.QUERY
  );

  const salesChannelModuleService = container.resolve(
    Modules.SALES_CHANNEL
  );
  const defaultSalesChannel = await salesChannelModuleService
    .listSalesChannels({
      name: "Default Sales Channel",
    });

  const fulfillmentModuleService = container.resolve(
    Modules.FULFILLMENT
  );
  const shippingProfiles = await fulfillmentModuleService
    .listShippingProfiles({
      type: "default"
    });
  let shippingProfile = shippingProfiles.length ? shippingProfiles[0] : null;

  logger.info("Seeding product category data...");
  const styleCategories = STYLE_CATEGORY_NAMES.map((name) => ({
    name,
    is_active: true 
  }))
  const { result: productCategories } = await createProductCategoriesWorkflow(
    container
  ).run({
    input: {
      product_categories: [
        {
          name: "Shirts",
          is_active: false
        },
        ...styleCategories
      ],
    },
  });
  logger.info("Finished seeding product category data.")

  logger.info("Generating product data...")
  const productsData = productDataArgs
    .map((productArgs) => _generateProductData({
        product: productArgs,
        meta: {
          salesChannel: defaultSalesChannel,
          productCategories,
          shippingProfile
        }
      })
    );
  logger.info("Finished generating product data.");

  logger.info("Seeding the product data...")
  const { result: products } = await createProductsWorkflow(container).run({
    input: {
      products: productsData,
    },
  })

  logger.info("Finished seeding the product data.");

  logger.info("Seeding inventory levels...")

  const { data: stockLocations } = await query.graph({
    entity: "stock_location",
    fields: ["id"],
  })

  const { data: inventoryItems } = await query.graph({
    entity: "inventory_item",
    fields: ["id"],
  })

  const inventoryLevels = inventoryItems.map((inventoryItem) => ({
    location_id: stockLocations[0].id,
    stocked_quantity: 1000000,
    inventory_item_id: inventoryItem.id,
  }))

  await createInventoryLevelsWorkflow(container).run({
    input: {
      inventory_levels: inventoryLevels,
    },
  })

  logger.info("Finished seeding inventory levels data.")
}

/*
Function to generate the full set of product args needed to create 
a single product using the CreateProductsWorkflow. A minimal set 
of args specified in ProductDataArgs.
*/
const _generateProductData = (args: {
  product: ProductDataArgs,
  meta: {
    salesChannel: SalesChannelDTO[],
    productCategories: ProductCategoryDTO[],
    shippingProfile: ShippingProfileDTO | null,
  }
}) : CreateProductWorkflowInputDTO => {
  const {
    product: {
      name,
      colors,
      title,
      description,
      categories
    },
    meta: {
      salesChannel,
      productCategories,
      shippingProfile
    }
  } = args

  const images = colors.map((color) => ({
    url: `https://${process.env.IMAGE_CLOUD_HOSTNAME}/shirt-images/shirt-${name}-${color}.png`
  }));

  const options = [
    SIZE_OPTION,
    {
      title: "Color",
      // Format each color name to capitalized words e.g. "light-blue" becomes "Light Blue"
      values: colors.map((color) => (
        color
          .split("-") 
          .map(word => word[0].toUpperCase() + word.slice(1))
          .join(" ")
      )),
    },
  ];

  const variants : {
    title: string,
    sku: string,
    options: {
      Size: string,
      Color: string,
    },
    prices: {
      amount: number,
      currency_code: string
    }[] 
  }[] = [];
  options[0].values.forEach((size) => {
    options[1].values.forEach((color) => {
      const variant = {
        title: `${size} / ${color}`,
        sku: `SHIRT-${name.toLocaleUpperCase()}-${size.toLocaleUpperCase()}-${color.replace(" ", "-").toLocaleUpperCase()}`,
        options: {
          Size: size,
          Color: color
        },
        prices: [
          {
            amount: USD_PRICE,
            currency_code: "usd",
          },
          {
            amount: EU_PRICE,
            currency_code: "eur"
          }
        ],
      };
      variants.push(variant);
    })
  });

  const styleCategoryIds = categories
    .map((categoryName) => {
      return productCategories.find((cat) => cat.name === categoryName)!.id ?? "";
    }).filter((categoryId) => !!categoryId);
  
  const productData = {
    title,
    description,
    handle: `${name}-shirt`,
    images,
    options,
    variants,
    category_ids: [
      productCategories.find((cat) => cat.name === "Shirts")!.id,
      ...styleCategoryIds
    ],
    status: ProductStatus.PUBLISHED,
    shipping_profile_id: shippingProfile?.id,
    sales_channels: [
      {
        id: salesChannel[0].id,
      },
    ],
  };
  return productData;
};