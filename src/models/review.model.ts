export default class Review {
  receipt_id: string;
  customer_id: string;
  product_id: string;
  review_text: string;
  rating: number;
  create_at: Date;
  update_at: Date;

  constructor(
      receipt_id: string,
      customer_id: string,
      product_id: string,
      review_text: string,
      rating: number,
      create_at: Date,
      update_at: Date
  ) {
      this.receipt_id = receipt_id;
      this.customer_id = customer_id;
      this.product_id = product_id;
      this.review_text = review_text;
      this.rating = rating;
      this.create_at = create_at;
      this.update_at = update_at;
  }
}
