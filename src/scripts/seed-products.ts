import { ExecArgs } from "@medusajs/framework/types";
import { 
  ContainerRegistrationKeys, 
  Modules, 
  ProductStatus,
} from "@medusajs/framework/utils";
import { 
  createInventoryLevelsWorkflow,
  createProductsWorkflow,
} from "@medusajs/medusa/core-flows";

import '../../medusa-config'


type ProductDataArgs = {
  name: string,
  colors: string[],
  title: string,
  description: string
};

const productDataArgs : ProductDataArgs[] = [
  {
    name: "barking-dog",
    title: "Barking Dog",
    description: "Profile of a small dog barking",
    colors: ["white", "light-blue", "orange", "red"]
  },
  {
    name: "birds-feather",
    title: "Birds of a Feather Flock Together",
    description: "Abstract art of a flock of birds flying within a feather",
    colors: ["asphalt", "creme", "slate"]
  },
  {
    name: "cat-starry-night",
    title: "Cat in a Starry Night",
    description: "An abstract representation of a cat with stars, inspired by Vincent Van Gogh's Starry Night",
    colors: ["white", "light-blue", "heather"]
  },
  {
    name: "crow",
    title: "Crow",
    description: "A black and white profile of a crow",
    colors: ["light-blue", "white"]
  },
  {
    name: "dune",
    title: "Sand Dunes",
    description: "Towering sand dunes in the setting sun, inspired by Frank Herbert's fictional planet Arrakis from Dune",
    colors: ["creme"]
  },
  {
    name: "elephant",
    title: "Elephant",
    description: "A multicolored elephant in paisley pastels",
    colors: ["white", "creme"]
  },
  {
    name: "fox-wilderness",
    title: "Fox in the Wild",
    description: "A lone fox in the forest",
    colors: ["white", "creme"]
  },
  {
    name: "jellyfish",
    title: "Bobbing Jellyfish",
    description: "A bright jellyfish swimming along",
    colors: ["military-green", "teal", "white", "creme"]
  },
  {
    name: "koi",
    title: "Koi",
    description: "A group of koi swimming in circles",
    colors: ["royal-blue", "slate", "yellow", "heather"],
  },
  {
    name: "meditation-tree",
    title: "Meditation Tree",
    description: "A graceful meditation tree reminiscent of Japanese gardens",
    colors: ["white", "royal-heather"]
  },
  {
    name: "mountain-meadow",
    title: "Meadow Ringed by Mountains",
    description: "A lush meadow with wildflowers silhouetted by the mountains",
    colors: ["soft-pink", "white", "creme"]
  },
  {
    name: "retro-landscape",
    title: "Retro Landscape",
    description: "Mountains and sun grouped for fun",
    colors: ["black", "brown", "navy", "red-heather"]
  },
  {
    name: "sea-otter",
    title: "Sea Otter",
    description: "A cute sea otter floating on the water",
    colors: ["light-blue", "white", "orange"]
  },
  {
    name: "sunflower",
    title: "Bright Sunflower",
    description: "A single sunflower head, open, tall, and yellow",
    colors: ["slate", "heather", "blue", "soft-pink"]
  },
  {
    name: "sunflowers",
    title: "Curving Sunflowers",
    description: "Abstract drawing of a field of curving sunflowers",
    colors: ["yellow", "asphalt", "maroon"]
  },
  {
    name: "tree-of-life", 
    title: "Tree of Life",
    description: "The iconic tree of life representing the sacred roots in which life is rooted",
    colors: ["teal", "heather", "green"]
  },
  {
    name: "tree-ring",
    title: "Tree Trunk with Rings",
    description: "Tree rings representing the passage of time",
    colors: ["maroon", "green", "white"]
  },
  {
    name: "waterfall",
    title: "Waterfall",
    description: "A curving waterfall set in a mountainous landscape",
    colors: ["light-blue", "white", "teal", "soft-pink"]
  },
];

const SIZE_OPTION =  {
  title: "Size",
  values: ["S", "M", "L", "XL"],
};
const COLOR_DELIMITER = '-';
const WEIGHT = 2;

const CURRENCY_CODE = "usd";
const PRICE = 30;

export default async function seedProducts({
  container,
}: ExecArgs) {

  const logger = container.resolve(
    ContainerRegistrationKeys.LOGGER
  );
  const query = container.resolve(
    ContainerRegistrationKeys.QUERY
  );

  const { data: productCategories } = await query.graph({
    entity: "product_categories",
    fields: ["id", "name"]
  });

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

  // Function to generate the product data for a single product
  const _generateCoreProductData = (args: ProductDataArgs) => {
    const {
      name,
      colors,
      title,
      description
    } = args;
  
    const images = colors.map((color) => ({
      url: `https://${process.env.IMAGE_CLOUD_HOSTNAME}/shirt-images/shirt-${name}-${color}.png`
    }));
  
    const options = [
      SIZE_OPTION,
      {
        title: "Color",
        values: colors.map((color) => _formatColor(color)),
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
              amount: PRICE,
              currency_code: CURRENCY_CODE,
            },
          ],
        };
        variants.push(variant);
      })
    });
  
    const productData = {
      title,
      description,
      handle: `${name}-shirt`,
      weight: WEIGHT,
      images,
      options,
      variants,
      category_ids: [
        productCategories.find((cat) => cat.name === "Shirts")!.id,
      ],
      status: ProductStatus.PUBLISHED,
      shipping_profile_id: shippingProfile?.id,
      sales_channels: [
        {
          id: defaultSalesChannel[0].id,
        },
      ],
    };
    return productData;
  };

  logger.info("Generating product data...")
  const productsData = productDataArgs.map((args) => _generateCoreProductData(args));
  logger.info("Finished generating product data.");
  logger.info(JSON.stringify(productsData, null, 2));

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

const _formatColor = (color: string) : string => {
  return color
    .split(COLOR_DELIMITER) 
    .map(word => word[0].toUpperCase() + word.slice(1))
    .join(" ");
};
