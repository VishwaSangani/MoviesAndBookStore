import { Component } from '@angular/core';
import { IpServiceService } from './shared/services/ip-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductService } from './shared/services/product.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'MoviesAndBooksStore';
  opened: true;
  wishlist: any = [];
  ipAddress;

  constructor(
    private ip: IpServiceService,
    public productService: ProductService) {
  }

  ngOnInit(): void {
    this.productService.GetWishlist().subscribe((data: {}) => {
      this.wishlist = data;
      this.ip.getIPAddress().subscribe((res: any) => {
        this.ipAddress = res.ip;
        var list = this.wishlist.filter(element => element.ipAddress === this.ipAddress);
        this.productService.wishListCount = list.length;
      });
    });

    this.productService.GetCartProducts().subscribe((data: any) => {
      this.productService.cartCount = data.length;
    })
  }
}
