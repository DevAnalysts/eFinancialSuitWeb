import { ItemPriceDetail } from './ItemPriceDetail';
export class ItemPrice {
  constructor(
    public id: any,
    public pricelistid: any,
    public itempricedetail: ItemPriceDetail[]
  ) { }
}
