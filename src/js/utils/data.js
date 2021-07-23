/**
 * Standard product GraphQL query
 */
export const productQuery = `
    id
    title
    handle
    tags
    productType
    images(first: 2) {
        edges {
            node {
            originalSrc
            }
        }
    }
    priceRange {
        maxVariantPrice {
            amount
        }
        minVariantPrice {
            amount
        }
    }
    variants(first: 1) {
        edges {
            node {
                id
                compareAtPriceV2 {
                    amount
                }
            }
        }
    }
`;

/**
 * The products loaded from graphQL need to be edited to
 * - name variables to match liquid versions
 * - set URL correctly
 * - fix IDs with atob()
 * - set pricing correctly
 */
export function transformGraphqlProduct(productNode, collectionHandle=null) {
    return productNode ? {
        objectType: "product",
        handle: productNode.handle,
        url: !!collectionHandle ? `/collections/${collectionHandle}/products/${productNode.handle}` : `/products/${productNode.handle}`,
        id: parseInt(atob(productNode.id).replace("gid://shopify/Product/", "")),
        tags: productNode.tags.map(tag => tag.toLowerCase()),
        productType: productNode.productType,
        title: productNode.title,
        variant: parseInt(atob(productNode.variants.edges[0].node.id).replace("gid://shopify/ProductVariant/", "")),
        price: productNode.priceRange.minVariantPrice.amount * 100,
        compare_at_price: productNode.variants.edges[0].node.compareAtPriceV2 ? productNode.variants.edges[0].node.compareAtPriceV2.amount * 100 : null,
        images: productNode.images.edges.map(image => image.node.originalSrc)
    } : null;
}

/**
 * The products loaded from Shopify Product Ajax API need to be edited to
 * - conform to Liquid Project object
 */
export function transformAjaxProduct(product) {
    product.options_with_values = product.options;
    product.options = product.options.map(option => option.name);
    return product;
}