import ProductService from '../src/services/product.service';
import { pool } from '../src/utils';
import reviewService from '../src/services/review.service';
import userService from '../src/services/user.service';
import Product from '../src/models/product.model';

jest.mock('../src/utils', () => ({
  pool: {
    query: jest.fn(),
  },
}));

jest.mock('../src/services/review.service', () => ({
  __esModule: true,
  default: {
    getAverageRatingByProductId: jest.fn(),
  },
}));

jest.mock('../src/services/user.service', () => ({
  __esModule: true,
  default: {
    getUserByID: jest.fn(),
  },
}));

describe('ProductService - getProduct', () => {
  const mockProductId = '03182936-0845-4996-983f-11e0d68e1257';
  const mockUserId = 'user456';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return product with average rating and isFavourited (true) when product is found and user has favourited it', async () => {
    const mockProduct: Product = new Product(
      mockProductId,
      1,
      'Test Product',
      ['image1.jpg'],
      'Test Description',
      100,
      80,
      10,
      true,
      10,
      new Date(),
      new Date()
    );
    (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [mockProduct] });
    (reviewService.getAverageRatingByProductId as jest.Mock).mockResolvedValue(4.5);
    (userService.getUserByID as jest.Mock).mockResolvedValue({ user_id: mockUserId, favourite_list: [mockProductId] });

    const result = await ProductService.getProduct(mockProductId, mockUserId);

    expect(pool.query).toHaveBeenCalledWith('SELECT * FROM product WHERE product_id = $1', [mockProductId]);
    expect(reviewService.getAverageRatingByProductId).toHaveBeenCalledWith(mockProductId);
    expect(userService.getUserByID).toHaveBeenCalledWith(mockUserId);
    expect(result).toEqual({
      ...mockProduct,
      average_rating: 4.5,
      is_favourited: true,
    });
  });

  it('should return product with average rating and isFavourited (false) when product is found and user has not favourited it', async () => {
    const mockProduct: Product = new Product(
      mockProductId,
      1,
      'Test Product',
      ['image1.jpg'],
      'Test Description',
      100,
      80,
      10,
      true,
      10,
      new Date(),
      new Date()
    );
    (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [mockProduct] });
    (reviewService.getAverageRatingByProductId as jest.Mock).mockResolvedValue(4.5);
    (userService.getUserByID as jest.Mock).mockResolvedValue({ user_id: mockUserId, customer_favouriteList: [] });

    const result = await ProductService.getProduct(mockProductId, mockUserId);

    expect(pool.query).toHaveBeenCalledWith('SELECT * FROM product WHERE product_id = $1', [mockProductId]);
    expect(reviewService.getAverageRatingByProductId).toHaveBeenCalledWith(mockProductId);
    expect(userService.getUserByID).toHaveBeenCalledWith(mockUserId);
    expect(result).toEqual({
      ...mockProduct,
      average_rating: 4.5,
      is_favourited: false,
    });
  });

  it('should return product with average rating and isFavourited (false) when product is found and user does not have customer_favouriteList', async () => {
    const mockProduct: Product = new Product(
      mockProductId,
      1,
      'Test Product',
      ['image1.jpg'],
      'Test Description',
      100,
      80,
      10,
      true,
      10,
      new Date(),
      new Date()
    );
    (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [mockProduct] });
    (reviewService.getAverageRatingByProductId as jest.Mock).mockResolvedValue(4.5);
    (userService.getUserByID as jest.Mock).mockResolvedValue({ user_id: mockUserId }); // No customer_favouriteList

    const result = await ProductService.getProduct(mockProductId, mockUserId);

    expect(pool.query).toHaveBeenCalledWith('SELECT * FROM product WHERE product_id = $1', [mockProductId]);
    expect(reviewService.getAverageRatingByProductId).toHaveBeenCalledWith(mockProductId);
    expect(userService.getUserByID).toHaveBeenCalledWith(mockUserId);
    expect(result).toEqual({
      ...mockProduct,
      average_rating: 4.5,
      is_favourited: false,
    });
  });

  it('should return product with product_image = null', async () => {
    const mockProduct: Product = new Product(
      mockProductId,
      1,
      'Test Product',
      null, // product_image is null
      'Test Description',
      100,
      80,
      10,
      true,
      10,
      new Date(),
      new Date()
    );
    (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [mockProduct] });
    (reviewService.getAverageRatingByProductId as jest.Mock).mockResolvedValue(4.5);
    (userService.getUserByID as jest.Mock).mockResolvedValue({ user_id: mockUserId });

    const result = await ProductService.getProduct(mockProductId, mockUserId);

    expect(result.product_image).toBeNull();
  });

  it('should return product with empty product_image array', async () => {
    const mockProduct: Product = new Product(
      mockProductId,
      1,
      'Test Product',
      [], // product_image is an empty array
      'Test Description',
      100,
      80,
      10,
      true,
      10,
      new Date(),
      new Date()
    );
    (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [mockProduct] });
    (reviewService.getAverageRatingByProductId as jest.Mock).mockResolvedValue(4.5);
    (userService.getUserByID as jest.Mock).mockResolvedValue({ user_id: mockUserId });

    const result = await ProductService.getProduct(mockProductId, mockUserId);

    expect(result.product_image).toEqual([]);
  });

  it('should return product with product_describe = null', async () => {
    const mockProduct: Product = new Product(
        mockProductId,
        1,
        'Test Product',
        ['image1.jpg'],
        null,
        100,
        80,
        10,
        true,
        10,
        new Date(),
        new Date()
      );
      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [mockProduct] });
      (reviewService.getAverageRatingByProductId as jest.Mock).mockResolvedValue(4.5);
      (userService.getUserByID as jest.Mock).mockResolvedValue({ user_id: mockUserId });
  
      const result = await ProductService.getProduct(mockProductId, mockUserId);
  
      expect(result.product_describe).toBeNull();
  });
  
  it('should return product with is_sale = null', async () => {
    const mockProduct: Product = new Product(
        mockProductId,
        1,
        'Test Product',
        ['image1.jpg'],
        'Test Description',
        100,
        80,
        10,
        null,
        10,
        new Date(),
        new Date()
      );
      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [mockProduct] });
      (reviewService.getAverageRatingByProductId as jest.Mock).mockResolvedValue(4.5);
      (userService.getUserByID as jest.Mock).mockResolvedValue({ user_id: mockUserId });
  
      const result = await ProductService.getProduct(mockProductId, mockUserId);
  
      expect(result.is_sale).toBeNull();
  });

  it('should return product with percentage_sale = null', async () => {
    const mockProduct: Product = new Product(
        mockProductId,
        1,
        'Test Product',
        ['image1.jpg'],
        'Test Description',
        100,
        80,
        10,
        true,
        null,
        new Date(),
        new Date()
      );
      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [mockProduct] });
      (reviewService.getAverageRatingByProductId as jest.Mock).mockResolvedValue(4.5);
      (userService.getUserByID as jest.Mock).mockResolvedValue({ user_id: mockUserId });
  
      const result = await ProductService.getProduct(mockProductId, mockUserId);
  
      expect(result.percentage_sale).toBeNull();
  });

  it('should throw an error when product is not found', async () => {
    (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [] });

    await expect(ProductService.getProduct(mockProductId, mockUserId)).rejects.toThrow('Product not found');

    expect(pool.query).toHaveBeenCalledWith('SELECT * FROM product WHERE product_id = $1', [mockProductId]);
    expect(reviewService.getAverageRatingByProductId).not.toHaveBeenCalled();
    expect(userService.getUserByID).not.toHaveBeenCalled();
  });
});

describe('ProductService - getProductsByCategoryId', () => {
  const mockUserId = 'user123';
  const mockCategoryId = 1;
  const mockProducts: Product[] = [
    new Product(
        'product1',
        mockCategoryId,
        'Product 1',
        ['image1.jpg'],
        'Description 1',
        100,
        80,
        10,
        false,
        0,
        new Date(),
        new Date()
      ),
      new Product(
        'product2',
        mockCategoryId,
        'Product 2',
        ['image2.jpg'],
        'Description 2',
        200,
        150,
        20,
        true,
        10,
        new Date(),
        new Date()
      ),
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return products with average rating and isFavourited (true/false) when categoryId is valid', async () => {
    (pool.query as jest.Mock).mockResolvedValueOnce({ rows: mockProducts });
    (reviewService.getAverageRatingByProductId as jest.Mock)
        .mockResolvedValueOnce(4.5)
        .mockResolvedValueOnce(3.8);
    (userService.getUserByID as jest.Mock).mockResolvedValue({
      user_id: mockUserId,
      favourite_list: ['product1'],
    });

    const result = await ProductService.getProductsByCategoryId(
      mockCategoryId,
      mockUserId
    );

    expect(pool.query).toHaveBeenCalledWith(
      'SELECT * FROM product WHERE category_id = $1',
      [mockCategoryId]
    );
    expect(reviewService.getAverageRatingByProductId).toHaveBeenCalledTimes(2);
    expect(userService.getUserByID).toHaveBeenCalledTimes(2); 

    expect(result).toEqual([
      {
        ...mockProducts[0],
        average_rating: 4.5,
        is_favourited: true, // product1 is favourited
      },
      {
        ...mockProducts[1],
        average_rating: 3.8,
        is_favourited: false, // product2 is not favourited
      },
    ]);
  });
  it('should return products with average rating and isFavourited (false) when categoryId is valid and user does not have favourite_list', async () => {
    (pool.query as jest.Mock).mockResolvedValueOnce({ rows: mockProducts });
    (reviewService.getAverageRatingByProductId as jest.Mock)
        .mockResolvedValueOnce(4.5)
        .mockResolvedValueOnce(3.8);
    (userService.getUserByID as jest.Mock).mockResolvedValue({
      user_id: mockUserId
    });

    const result = await ProductService.getProductsByCategoryId(
      mockCategoryId,
      mockUserId
    );

    expect(pool.query).toHaveBeenCalledWith(
      'SELECT * FROM product WHERE category_id = $1',
      [mockCategoryId]
    );
    expect(reviewService.getAverageRatingByProductId).toHaveBeenCalledTimes(2);
    expect(userService.getUserByID).toHaveBeenCalledTimes(2); 

    expect(result).toEqual([
      {
        ...mockProducts[0],
        average_rating: 4.5,
        is_favourited: false, 
      },
      {
        ...mockProducts[1],
        average_rating: 3.8,
        is_favourited: false,
      },
    ]);
  });
});